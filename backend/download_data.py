import os
from zipfile import ZipFile

dataset = "grouplens/movielens-20m-dataset"
output_dir = "backend/data"

os.makedirs(output_dir, exist_ok=True)

print("Downloading dataset...")
os.system(f"kaggle datasets download -d {dataset} -p {output_dir} --unzip")

print("Dataset downloaded and unzipped into", output_dir)