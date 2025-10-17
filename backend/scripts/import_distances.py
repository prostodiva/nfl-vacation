import pandas as pd
import pymongo
from pymongo import MongoClient

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['nfl-vacation']
distances_collection = db['distances']

def import_distances():
    try:
        print("🔌 Connecting to MongoDB...")
        
        # Clear existing distances
        distances_collection.delete_many({})
        print("🗑️ Cleared existing distance data")
        
        # Read Excel file
        print("📖 Reading Excel file...")
        df = pd.read_excel('stadium-distances.xlsx')
        
        print(f"📊 Found {len(df)} rows in Excel file")
        
        # Convert to list of dictionaries
        distances = []
        for index, row in df.iterrows():
            # Clean and map data
            distance = {
                "teamName": str(row['Team Name']).strip(),
                "beginningStadium": str(row['Beginning Stadium']).strip(),
                "endingStadium": str(row['Ending Stadium']).strip(),
                "distance": float(row['Distance']) if pd.notna(row['Distance']) else 0
            }
            
            # Only add if all required fields are present and distance > 0
            if (distance["teamName"] and distance["beginningStadium"] and 
                distance["endingStadium"] and distance["distance"] > 0):
                distances.append(distance)
        
        print(f"📊 Processed {len(distances)} valid distance records")
        
        # Insert into MongoDB
        if distances:
            distances_collection.insert_many(distances)
            print(f"✅ Successfully imported {len(distances)} distance records")
        
        # Verify import
        count = distances_collection.count_documents({})
        print(f"📈 Total distances in database: {count}")
        
        # Show sample data
        sample = distances_collection.find_one()
        print(f"📋 Sample distance: {sample['beginningStadium']} → {sample['endingStadium']} ({sample['distance']} miles)")
        
    except Exception as error:
        print(f"❌ Error importing distances: {error}")
    finally:
        client.close()

if __name__ == "__main__":
    import_distances()