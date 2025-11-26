import pandas as pd
import pymongo
from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['nfl-vacation']
teams_collection = db['teams']

def import_teams():
    try:
        print("🔌 Connecting to MongoDB...")
        
        # Clear existing teams
        teams_collection.delete_many({})
        print("🗑️ Cleared existing teams")
        
        # Read Excel file
        print("📖 Reading Excel file...")
        df = pd.read_excel('teams-stadiums.xlsx')
        
        print(f"📊 Found {len(df)} rows in Excel file")
        
        # Convert to list of dictionaries
        teams = []
        for index, row in df.iterrows():
            try:
                # Skip the "Expansion" row (row 33)
                if str(row['Team(s)']).strip() == 'Expansion':
                    print(f"⚠️ Skipping expansion row {index + 1}")
                    continue
                
                # Clean and map data with correct column names
                team = {
                    "teamName": str(row['Team(s)']).strip() if pd.notna(row['Team(s)']) else "",
                    "conference": str(row['Conference']).strip() if pd.notna(row['Conference']) else "",
                    "division": str(row['Division ']).strip() if pd.notna(row['Division ']) else "",
                    "stadium": {
                        "name": str(row['Name']).strip() if pd.notna(row['Name']) else "",
                        "location": str(row['Location']).strip() if pd.notna(row['Location']) else "",
                        # Fix: Convert float to int properly
                        "seatingCapacity": int(float(row['Capacity'])) if pd.notna(row['Capacity']) else 0,
                        "surfaceType": str(row['Surface']).strip() if pd.notna(row['Surface']) else "",
                        "roofType": str(row['Roof Type']).strip() if pd.notna(row['Roof Type']) else "",
                        "yearOpened": int(float(row['Opened'])) if pd.notna(row['Opened']) else 0
                    },
                    "souvenirs": [
                        {"_id": ObjectId(), "name": "Signed helmets", "price": 74.99, "category": "Collectibles", "isTraditional": True},
                        {"_id": ObjectId(), "name": "Autographed Football", "price": 79.89, "category": "Collectibles", "isTraditional": True},
                        {"_id": ObjectId(), "name": "Team pennant", "price": 17.99, "category": "Accessories", "isTraditional": True},
                        {"_id": ObjectId(), "name": "Team picture", "price": 29.99, "category": "Collectibles", "isTraditional": True},
                        {"_id": ObjectId(), "name": "Team jersey", "price": 199.99, "category": "Apparel", "isTraditional": True}
                    ]
                }
                
                # Only add if all required fields are present
                if (team["teamName"] and team["conference"] and 
                    team["division"] and team["stadium"]["name"]):
                    teams.append(team)
                    print(f"✅ Added: {team['teamName']} - {team['stadium']['name']} ({team['stadium']['seatingCapacity']})")
                else:
                    print(f"⚠️ Skipping row {index + 1}: Missing required fields")
                    print(f"   Team: '{team['teamName']}', Conference: '{team['conference']}', Division: '{team['division']}'")
                    
            except KeyError as e:
                print(f"❌ Column not found: {e}")
                print(f"   Available columns: {list(df.columns)}")
                break
            except Exception as e:
                print(f"❌ Error processing row {index + 1}: {e}")
                continue
        
        print(f"📊 Processed {len(teams)} valid team records")
        
        # Insert into MongoDB
        if teams:
            teams_collection.insert_many(teams)
            print(f"✅ Successfully imported {len(teams)} teams with stadiums and souvenirs")
        
        # Verify import
        count = teams_collection.count_documents({})
        print(f"📈 Total teams in database: {count}")
        
        # Show sample data
        if count > 0:
            sample = teams_collection.find_one()
            print(f"📋 Sample team: {sample['teamName']} - {sample['stadium']['name']}")
        
    except Exception as error:
        print(f"❌ Error importing teams: {error}")
    finally:
        client.close()

if __name__ == "__main__":
    import_teams()