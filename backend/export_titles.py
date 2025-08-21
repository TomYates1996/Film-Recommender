import pandas as pd
import json

# Load film stats
film_stats = pd.read_pickle("model/film_stats.pkl")

# Save film titles
film_titles = list(film_stats.index)
with open("film_titles.json", "w", encoding="utf-8") as f:
    json.dump(film_titles, f, ensure_ascii=False, indent=2)

print(f"Saved {len(film_titles)} film titles to film_titles.json")