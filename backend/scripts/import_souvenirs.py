import pandas as pd
import pymongo
from pymongo import MongoClient
from bson import ObjectId
import sys
import os

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['nfl-vacation']
teams_collection = db['teams']

def import_souvenirs(file_path=None):
    try:
        print("🔌 Connecting to MongoDB...", flush=True)
        
        # Determine file path
        if file_path is None:
            file_path = 'souvenirs.xlsx'
        
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}", flush=True)
            return False
        
        # Read Excel file
        print(f"📖 Reading Excel file: {file_path}...", flush=True)
        df = pd.read_excel(file_path)
        
        print(f"📊 Found {len(df)} rows in Excel file", flush=True)
        
        # Track statistics
        updated_count = 0
        skipped_count = 0
        teams_processed = set()
        
        # Group souvenirs by team
        teams_souvenirs = {}
        for index, row in df.iterrows():
            try:
                # Get required fields
                team_name = str(row['Team Name']).strip() if pd.notna(row['Team Name']) else ""
                souvenir_name = str(row['Souvenir Name']).strip() if pd.notna(row['Souvenir Name']) else ""
                price = float(row['Price']) if pd.notna(row['Price']) else 0
                category = str(row['Category']).strip() if pd.notna(row['Category']) else ""
                is_traditional = bool(row.get('Is Traditional', False)) if pd.notna(row.get('Is Traditional', False)) else False
                
                # Validate required fields
                if not (team_name and souvenir_name and price > 0 and category):
                    print(f"⚠️ Skipping row {index + 1}: Missing required fields", flush=True)
                    skipped_count += 1
                    continue
                
                # Validate category
                valid_categories = ['Apparel', 'Accessories', 'Collectibles', 'Food & Beverage']
                if category not in valid_categories:
                    print(f"⚠️ Skipping row {index + 1}: Invalid category '{category}'. Must be one of: {', '.join(valid_categories)}", flush=True)
                    skipped_count += 1
                    continue
                
                # Group by team
                if team_name not in teams_souvenirs:
                    teams_souvenirs[team_name] = []
                
                teams_souvenirs[team_name].append({
                    "_id": ObjectId(),
                    "name": souvenir_name,
                    "price": price,
                    "category": category,
                    "isTraditional": is_traditional
                })
                
            except KeyError as e:
                print(f"❌ Column not found: {e}", flush=True)
                print(f"   Available columns: {list(df.columns)}", flush=True)
                print(f"   Required columns: Team Name, Souvenir Name, Price, Category, Is Traditional (optional)", flush=True)
                break
            except Exception as e:
                print(f"❌ Error processing row {index + 1}: {e}", flush=True)
                skipped_count += 1
                continue
        
        # Update each team's souvenirs
        for team_name, souvenirs in teams_souvenirs.items():
            try:
                # Find the team
                team = teams_collection.find_one({"teamName": team_name})
                
                if not team:
                    print(f"⚠️ Team '{team_name}' not found, skipping souvenirs", flush=True)
                    skipped_count += len(souvenirs)
                    continue
                
                # Replace all souvenirs for this team
                teams_collection.update_one(
                    {"teamName": team_name},
                    {"$set": {"souvenirs": souvenirs}}
                )
                
                updated_count += 1
                teams_processed.add(team_name)
                print(f"✅ Updated souvenirs for '{team_name}': {len(souvenirs)} items", flush=True)
                
            except Exception as e:
                print(f"❌ Error updating souvenirs for '{team_name}': {e}", flush=True)
                skipped_count += len(souvenirs)
                continue
        
        # Print summary
        print(f"\n📊 Import Summary:", flush=True)
        print(f"   ✅ Updated: {updated_count} teams", flush=True)
        print(f"   📦 Total souvenirs imported: {sum(len(s) for s in teams_souvenirs.values())}", flush=True)
        print(f"   ⏭️  Skipped: {skipped_count} rows (invalid data or team not found)", flush=True)
        
        if teams_processed:
            print(f"\n📋 Teams processed:", flush=True)
            for team in sorted(teams_processed):
                souvenir_count = len(teams_souvenirs[team])
                print(f"   • {team}: {souvenir_count} souvenirs", flush=True)
        
        return True
        
    except Exception as error:
        print(f"❌ Error importing souvenirs: {error}", flush=True)
        import traceback
        traceback.print_exc()
        return False
    finally:
        client.close()

if __name__ == "__main__":
    # Allow file path as command line argument
    file_path = sys.argv[1] if len(sys.argv) > 1 else None
    result = import_souvenirs(file_path)
    sys.exit(0 if result else 1)

