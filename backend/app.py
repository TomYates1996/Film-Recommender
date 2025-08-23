import pandas as pd
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model_dir = "model"

user_movie_matrix = pd.read_pickle(os.path.join(model_dir, "user_film_matrix.pkl"))
film_stats = pd.read_pickle(os.path.join(model_dir, "film_stats.pkl"))
cosine_sim = pd.read_pickle(os.path.join(model_dir, "cosine_sim.pkl"))

@app.route("/recommend", methods=["GET"])
def recommend():
    film = request.args.get("film")
    if not film:
        return jsonify({"error": "No film provided"}), 400

    if film not in cosine_sim.index:
        return jsonify({"recommendations": []})

    similar_scores = cosine_sim[film].sort_values(ascending=False)

    similar_scores = similar_scores.drop(film, errors="ignore")

    top_recs = similar_scores.head(10).index.tolist()

    return jsonify({"recommendations": top_recs})

if __name__ == "__main__":
    app.run(debug=True)
