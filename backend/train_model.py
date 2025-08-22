import pandas as pd
import os

# Paths
data_dir = "data"
model_dir = "model"
os.makedirs(model_dir, exist_ok=True)

print("Training model...")
ratings = pd.read_csv(os.path.join(data_dir, "rating.csv"))
movies = pd.read_csv(os.path.join(data_dir, "movie.csv"))

data = ratings.merge(movies, on="movieId")

movie_counts = data.groupby('title')['rating'].count()
popular_movies = movie_counts[movie_counts >= 200].index
subset_data = data[data['title'].isin(popular_movies)]

user_counts = subset_data['userId'].value_counts()
active_users = user_counts[user_counts >= 10].index
subset_data = subset_data[subset_data['userId'].isin(active_users)]

user_movie_matrix = subset_data.pivot_table(index='userId', columns='title', values='rating')

film_stats = subset_data.groupby('title')['rating'].agg(['mean', 'count'])
film_stats.rename(columns={'mean':'avg_rating','count':'num_ratings'}, inplace=True)

user_movie_matrix.to_pickle(os.path.join(model_dir, "user_film_matrix.pkl"))
film_stats.to_pickle(os.path.join(model_dir, "film_stats.pkl"))

film_titles = list(film_stats.index)
import json
with open(os.path.join(model_dir, "..", "film_titles.json"), "w", encoding="utf-8") as f:
    json.dump(film_titles, f, ensure_ascii=False, indent=2)

print("Training complete.")
