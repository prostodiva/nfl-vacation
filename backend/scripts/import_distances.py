import pandas as pd
import pymongo
from pymongo import MongoClient
import sys
import os

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['nfl-vacation']
distances_collection = db['distances']

def import_distances(file_path=None):
    try:
        print("🔌 Connecting to MongoDB...", flush=True)
        
        # Determine file path
        if file_path is None:
            file_path = 'stadium-distances.xlsx'
        
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}", flush=True)
            sys.exit(1)
        
        # Read Excel file - get all sheet names first
        print(f"📖 Reading Excel file: {file_path}...", flush=True)
        excel_file = pd.ExcelFile(file_path)
        sheet_names = excel_file.sheet_names
        print(f"📋 Found {len(sheet_names)} sheet(s): {', '.join(sheet_names)}", flush=True)
        
        # Track statistics
        total_inserted_count = 0
        total_skipped_count = 0
        
        # Process each sheet
        for sheet_name in sheet_names:
            print(f"\n📄 Processing sheet: '{sheet_name}'", flush=True)
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            print(f"📊 Found {len(df)} rows in sheet '{sheet_name}'", flush=True)
            
            inserted_count = 0
            skipped_count = 0
            
            # Process each row
            for index, row in df.iterrows():
                try:
                    # Clean and map data
                    # Check which column structure this sheet uses
                    if 'Team Name' in df.columns:
                        team_name = str(row['Team Name']).strip()
                    else:
                        # If no Team Name column, try to infer or use empty
                        team_name = ""
                    
                    beginning_stadium = str(row['Beginning Stadium']).strip()
                    ending_stadium = str(row['Ending Stadium']).strip()
                    distance_value = float(row['Distance']) if pd.notna(row['Distance']) else 0
                    
                    # Only add if all required fields are present and distance > 0
                    if not (beginning_stadium and ending_stadium and distance_value > 0):
                        skipped_count += 1
                        continue
                    
                    # If team_name is empty, try to find it from the stadium name
                    # This is a fallback - ideally Team Name should be in the sheet
                    if not team_name:
                        # Try to find team by stadium name
                        from pymongo import MongoClient as MC
                        temp_client = MC('mongodb://localhost:27017/')
                        temp_db = temp_client['nfl-vacation']
                        temp_teams = temp_db['teams']
                        team_doc = temp_teams.find_one({"stadium.name": beginning_stadium})
                        if team_doc:
                            team_name = team_doc.get('teamName', '')
                        temp_client.close()
                    
                    # Check if distance record already exists
                    existing_distance = distances_collection.find_one({
                        "beginningStadium": beginning_stadium,
                        "endingStadium": ending_stadium
                    })
                    
                    if existing_distance:
                        print(f"⏭️  Distance '{beginning_stadium}' → '{ending_stadium}' already exists, skipping...", flush=True)
                        skipped_count += 1
                        continue
                    
                    # Create new distance document
                    distance = {
                        "teamName": team_name if team_name else "Unknown",
                        "beginningStadium": beginning_stadium,
                        "endingStadium": ending_stadium,
                        "distance": distance_value
                    }
                    
                    # Insert new distance
                    distances_collection.insert_one(distance)
                    inserted_count += 1
                    if (index + 1) % 10 == 0:  # Print progress every 10 rows
                        print(f"   Processed {index + 1} rows...", flush=True)
                    
                except KeyError as e:
                    print(f"⚠️ Column not found in row {index + 1}: {e}", flush=True)
                    print(f"   Available columns: {list(df.columns)}", flush=True)
                    skipped_count += 1
                    continue
                except Exception as e:
                    print(f"❌ Error processing row {index + 1}: {e}", flush=True)
                    skipped_count += 1
                    continue
            
            print(f"   ✅ Inserted: {inserted_count} records from '{sheet_name}'", flush=True)
            print(f"   ⏭️  Skipped: {skipped_count} records from '{sheet_name}'", flush=True)
            
            total_inserted_count += inserted_count
            total_skipped_count += skipped_count
        
        # Print summary
        print(f"\n📊 Overall Import Summary:", flush=True)
        print(f"   ✅ Total Inserted: {total_inserted_count} distance records", flush=True)
        print(f"   ⏭️  Total Skipped: {total_skipped_count} records (already exist or invalid)", flush=True)
        
        # Verify total count
        total_count = distances_collection.count_documents({})
        print(f"📈 Total distances in database: {total_count}", flush=True)
        
        return True
        
    except Exception as error:
        print(f"❌ Error importing distances: {error}", flush=True)
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        client.close()

if __name__ == "__main__":
    # Allow file path as command line argument
    file_path = sys.argv[1] if len(sys.argv) > 1 else None
    result = import_distances(file_path)
    sys.exit(0 if result else 1)