import pymongo
import sys
from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['nfl-vacation']
teams_collection = db['teams']

# Default souvenirs list
DEFAULT_SOUVENIRS = [
    {"_id": ObjectId(), "name": "Signed helmets", "price": 74.99, "category": "Collectibles", "isTraditional": True},
    {"_id": ObjectId(), "name": "Autographed Football", "price": 79.89, "category": "Collectibles", "isTraditional": True},
    {"_id": ObjectId(), "name": "Team pennant", "price": 17.99, "category": "Accessories", "isTraditional": True},
    {"_id": ObjectId(), "name": "Team picture", "price": 29.99, "category": "Collectibles", "isTraditional": True},
    {"_id": ObjectId(), "name": "Team jersey", "price": 199.99, "category": "Apparel", "isTraditional": True}
]

def restore_default_souvenirs():
    try:
        print("🔌 Connecting to MongoDB...", flush=True)
        
        # Get all teams
        teams = teams_collection.find({})
        total_teams = teams_collection.count_documents({})
        
        print(f"📊 Found {total_teams} teams in database", flush=True)
        
        updated_count = 0
        skipped_count = 0
        
        for team in teams:
            team_name = team.get('teamName', 'Unknown')
            current_souvenirs = team.get('souvenirs', [])
            
            # Create a map of default souvenirs by name for quick lookup
            default_souvenirs_map = {s['name']: s for s in DEFAULT_SOUVENIRS}
            
            # Track if we need to update
            needs_update = False
            updated_souvenirs = []
            added_count = 0
            restored_count = 0
            
            # Process existing souvenirs
            for souvenir in current_souvenirs:
                souvenir_name = souvenir.get('name', '')
                
                # Check if this souvenir matches a default one
                if souvenir_name in default_souvenirs_map:
                    default_souvenir = default_souvenirs_map[souvenir_name]
                    
                    # Check if price, category, or isTraditional differs from default
                    if (souvenir.get('price') != default_souvenir['price'] or
                        souvenir.get('category') != default_souvenir['category'] or
                        souvenir.get('isTraditional') != default_souvenir['isTraditional']):
                        # Restore to default values (keep existing _id)
                        restored_souvenir = {
                            '_id': souvenir.get('_id', ObjectId()),
                            'name': default_souvenir['name'],
                            'price': default_souvenir['price'],
                            'category': default_souvenir['category'],
                            'isTraditional': default_souvenir['isTraditional']
                        }
                        updated_souvenirs.append(restored_souvenir)
                        restored_count += 1
                        needs_update = True
                    else:
                        # Already matches default, keep as is
                        updated_souvenirs.append(souvenir)
                else:
                    # Custom souvenir (not in defaults), keep it
                    updated_souvenirs.append(souvenir)
            
            # Add missing default souvenirs
            current_names = {s.get('name', '') for s in updated_souvenirs}
            for default_souvenir in DEFAULT_SOUVENIRS:
                if default_souvenir['name'] not in current_names:
                    new_souvenir = default_souvenir.copy()
                    new_souvenir['_id'] = ObjectId()
                    updated_souvenirs.append(new_souvenir)
                    added_count += 1
                    needs_update = True
            
            # Update if needed
            if needs_update:
                teams_collection.update_one(
                    {"_id": team['_id']},
                    {"$set": {"souvenirs": updated_souvenirs}}
                )
                updated_count += 1
                messages = []
                if restored_count > 0:
                    messages.append(f"restored {restored_count} prices/properties")
                if added_count > 0:
                    messages.append(f"added {added_count} missing")
                message = " and ".join(messages) if messages else "updated"
                print(f"✅ {message.capitalize()} for '{team_name}' (now has {len(updated_souvenirs)} items)", flush=True)
            else:
                skipped_count += 1
                print(f"⏭️  Team '{team_name}' already has correct default souvenirs ({len(current_souvenirs)} items), skipping", flush=True)
        
        # Print summary
        print(f"\n📊 Restoration Summary:", flush=True)
        print(f"   ✅ Updated: {updated_count} teams (restored default souvenirs)", flush=True)
        print(f"   ⏭️  Skipped: {skipped_count} teams (already have souvenirs)", flush=True)
        print(f"   📦 Total souvenirs restored: {updated_count * len(DEFAULT_SOUVENIRS)}", flush=True)
        
        return True
        
    except Exception as error:
        print(f"❌ Error restoring default souvenirs: {error}", flush=True)
        import traceback
        traceback.print_exc()
        return False
    finally:
        client.close()

if __name__ == "__main__":
    result = restore_default_souvenirs()
    sys.exit(0 if result else 1)
