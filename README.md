## Screenshots for people who don't want to run the app themselves

https://github.com/TomYates1996/Film-Recommender/blob/main/assets/images/initial.png
https://github.com/TomYates1996/Film-Recommender/blob/main/assets/images/typing.png
https://github.com/TomYates1996/Film-Recommender/blob/main/assets/images/searching.png
https://github.com/TomYates1996/Film-Recommender/blob/main/assets/images/results.png

## Setup the environment

Open Command Prompt in the project folder and run the following:

    python -m venv venv

    .\venv\Scripts\activate

    pip install -r backend/requirements.txt
    
Add configuration
Set script path to backend/app.py and interpreter to the one for this app, everything else should be fine then click okay.

## Downloading the Data

    Create a Kaggle account and get your API token (kaggle.json). https://www.kaggle.com/
    Move to or ensure kaggle.json is in ~/.kaggle/.
    Run the following in your terminal ->>python backend/download_data.py

## Training the model
    
  1) cd backend
     
  2) Train the model:
        python backend/train_model.py

## Running the app
  
  4) Run the Flask API backend:
        python backend/app.py
  5) press the little play button to run the backend api.

  6) cd to the frontend folder
  7) npm install
  8) npm start
     
  Open your browser at http://localhost:3000 to access the app.
