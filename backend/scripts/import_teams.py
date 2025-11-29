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

def import_teams(file_path=None):
    try:
        print("🔌 Connecting to MongoDB...", flush=True)
        
        # Determine file path
        if file_path is None:
            file_path = 'teams-stadiums.xlsx'
        
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}", flush=True)
            return False
        
        # Read Excel file
        print(f"📖 Reading Excel file: {file_path}...", flush=True)
        df = pd.read_excel(file_path)
        
        print(f"📊 Found {len(df)} rows in Excel file", flush=True)
        
        # Track statistics
        inserted_count = 0
        updated_count = 0
        skipped_count = 0
        
        # Process each row
        for index, row in df.iterrows():
            try:
                # Skip the "Expansion" row (row 33)
                if str(row['Team(s)']).strip() == 'Expansion':
                    print(f"⚠️ Skipping expansion row {index + 1}", flush=True)
                    continue
                
                # Clean and map data with correct column names
                team_name = str(row['Team(s)']).strip() if pd.notna(row['Team(s)']) else ""
                conference = str(row['Conference']).strip() if pd.notna(row['Conference']) else ""
                division = str(row['Division ']).strip() if pd.notna(row['Division ']) else ""
                stadium_name = str(row['Name']).strip() if pd.notna(row['Name']) else ""
                
                # Only process if all required fields are present
                if not (team_name and conference and division and stadium_name):
                    print(f"⚠️ Skipping row {index + 1}: Missing required fields", flush=True)
                    skipped_count += 1
                    continue
                
                # Check if team already exists
                existing_team = teams_collection.find_one({"teamName": team_name})
                
                # Prepare stadium data
                stadium_data = {
                        "name": stadium_name,
                        "location": str(row['Location']).strip() if pd.notna(row['Location']) else "",
                        "seatingCapacity": int(float(row['Capacity'])) if pd.notna(row['Capacity']) else 0,
                        "surfaceType": str(row['Surface']).strip() if pd.notna(row['Surface']) else "",
                        "roofType": str(row['Roof Type']).strip() if pd.notna(row['Roof Type']) else "",
                        "yearOpened": int(float(row['Opened'])) if pd.notna(row['Opened']) else 0
                    }
                
                if existing_team:
                    # Update existing team - preserve souvenirs but update other fields
                    update_data = {
                        "$set": {
                            "conference": conference,
                            "division": division,
                            "stadium": stadium_data
                        }
                    }
                    teams_collection.update_one(
                        {"teamName": team_name},
                        update_data
                    )
                    updated_count += 1
                    print(f"🔄 Updated: {team_name} - {stadium_name} (preserved {len(existing_team.get('souvenirs', []))} souvenirs)", flush=True)
                else:
                    # Create new team document with default souvenirs
                    team = {
                        "teamName": team_name,
                        "conference": conference,
                        "division": division,
                        "stadium": stadium_data,
                        "souvenirs": [
                            {"_id": ObjectId(), "name": "Signed helmets", "price": 74.99, "category": "Collectibles", "isTraditional": True},
                            {"_id": ObjectId(), "name": "Autographed Football", "price": 79.89, "category": "Collectibles", "isTraditional": True},
                            {"_id": ObjectId(), "name": "Team pennant", "price": 17.99, "category": "Accessories", "isTraditional": True},
                            {"_id": ObjectId(), "name": "Team picture", "price": 29.99, "category": "Collectibles", "isTraditional": True},
                            {"_id": ObjectId(), "name": "Team jersey", "price": 199.99, "category": "Apparel", "isTraditional": True}
                        ]
                    }
                    
                    # Insert new team
                    teams_collection.insert_one(team)
                    inserted_count += 1
                    print(f"✅ Inserted: {team_name} - {stadium_name} ({team['stadium']['seatingCapacity']}) with {len(team['souvenirs'])} default souvenirs", flush=True)
                    
            except KeyError as e:
                print(f"❌ Column not found: {e}", flush=True)
                print(f"   Available columns: {list(df.columns)}", flush=True)
                break
            except Exception as e:
                print(f"❌ Error processing row {index + 1}: {e}", flush=True)
                skipped_count += 1
                continue
        
        # Print summary
        print(f"\n📊 Import Summary:", flush=True)
        print(f"   ✅ Inserted: {inserted_count} teams", flush=True)
        print(f"   🔄 Updated: {updated_count} teams", flush=True)
        print(f"   ⏭️  Skipped: {skipped_count} teams (invalid data)", flush=True)
        
        # Verify total count
        total_count = teams_collection.count_documents({})
        print(f"📈 Total teams in database: {total_count}", flush=True)
        
        return True
        
    except Exception as error:
        print(f"❌ Error importing teams: {error}", flush=True)
        import traceback
        traceback.print_exc()
        return False
    finally:
        client.close()

if __name__ == "__main__":
    # Allow file path as command line argument
    file_path = sys.argv[1] if len(sys.argv) > 1 else None
    result = import_teams(file_path)
    sys.exit(0 if result else 1)