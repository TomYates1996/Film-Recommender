import pandas as pd
from flask import Flask, request, jsonify

# Load preprocessed data
user_movie_matrix = pd.read_pickle("model/user_film_matrix.pkl")
film_stats = pd.read_pickle("model/film_stats.pkl")

def recommend_films(film_title, min_ratings=100, top_n=10):
    if film_title not in user_movie_matrix:
        return []  
    
    film_ratings = user_movie_matrix[film_title]
    similar = user_movie_matrix.corrwith(film_ratings)
    similar = similar.dropna()
    
    df = pd.DataFrame(similar, columns=['correlation'])
    df = df.join(film_stats['num_ratings'])
    
    # Filter out films with less than 200 reviews
    df = df[df['num_ratings'] >= 200].sort_values('correlation', ascending=False)
    
    # Remove the original film
    df = df.drop(film_title, errors='ignore')
    
    # Return top_n recommendations as a list
    return df.head(top_n).index.tolist()



app = Flask(__name__)

@app.route("/recommend", methods=["GET"])
def recommend():
    film = request.args.get("film")  
    if not film:
        return jsonify({"error": "No film provided"}), 400
    
    recommendations = recommend_films(film)
    return jsonify({"recommendations": recommendations})