import sys
import json
import numpy as np
import pandas as pd
from pymongo import MongoClient
from urllib.parse import quote_plus
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

def get_recommendations(user_email):
    # MongoDB connection
    username = quote_plus("sambhavjain874") 
    password = quote_plus("sambhavjain874")  
    host = "cluster0.km4b9.mongodb.net"

    connection_string = f"mongodb+srv://{username}:{password}@{host}/?retryWrites=true&w=majority"
    client = MongoClient(connection_string)
    db = client['test']  

    # Fetch user tag interactions
    user_collection = db['usertaginteractions']
    user_data = []
    user_documents = user_collection.find()

    for document in user_documents:
        user = document['userEmail']
        tags = document.get('tagCounts', {})  
        user_data.append({'userEmail': user, **tags})

    user_df = pd.DataFrame(user_data).fillna(0)

    # Check if user exists in the DataFrame
    if user_email not in user_df['userEmail'].values:
        client.close()
        return {"error": "User not found"}

    # Ensure all columns except 'userEmail' are numeric
    for column in user_df.columns:
        if column != 'userEmail':
            user_df[column] = pd.to_numeric(user_df[column], errors='coerce').fillna(0)

    # Normalize user tag interactions
    scaler = MinMaxScaler()
    user_df.iloc[:, 1:] = scaler.fit_transform(user_df.iloc[:, 1:])

    # Fetch events data
    event_collection = db['events']
    event_data = []
    event_documents = event_collection.find()

    for document in event_documents:
        event_id = str(document['_id'])
        title = document['title']
        tags = document.get('tags', [])
        event_data.append({'eventId': event_id, 'title': title, **{tag: 1 for tag in tags}})

    event_df = pd.DataFrame(event_data).fillna(0)

    # Ensure all columns from user_df are present in event_df
    for column in user_df.columns:
        if column not in event_df.columns and column != 'userEmail':
            event_df[column] = 0

    # Align columns (excluding 'userEmail' and 'eventId'/'title')
    common_columns = [col for col in user_df.columns if col != 'userEmail']
    event_features = event_df[common_columns]

    user_profile = user_df[user_df['userEmail'] == user_email].iloc[0, 1:].values.reshape(1, -1)
    
    # Calculate cosine similarity between user profile and events
    similarities = cosine_similarity(user_profile, event_features)
    
    # Get top 5 similar events
    similar_indices = similarities[0].argsort()[::-1][:5]
    recommended_events = event_df.iloc[similar_indices]
    
    recommendations = recommended_events[['eventId', 'title']].to_dict('records')

    user_profile = user_df[user_df['userEmail'] == user_email].iloc[0, 1:]
    top_user_tags = user_profile.sort_values(ascending=False).head(3).index.tolist()
    
    for event in recommendations:
        event_tags = event_df[event_df['eventId'] == event['eventId']].iloc[0, 3:].sort_values(ascending=False).head(3).index.tolist()
        matching_tags = list(set(top_user_tags) & set(event_tags))
        event['explanation'] = matching_tags if matching_tags else ["Based on overall similarity"]

    client.close()
    return recommendations

if __name__ == "__main__":
    user_email = sys.argv[1]
    recommendations = get_recommendations(user_email)
    print(json.dumps(recommendations))