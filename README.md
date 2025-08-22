## Setup the environment

Open Command Prompt in the project folder and run the following:

    python -m venv venv

    .\venv\Scripts\activate

    pip install -r backend/requirements.txt
    

## Downloading the Data

    Create a Kaggle account and get your API token (kaggle.json). https://www.kaggle.com/
    Move to or ensure kaggle.json is in ~/.kaggle/.
    Run the following in your terminal ->>python backend/download_data.py

## Creating the Model and Running the App
  1) Train the model:
        python backend/train_model.py
  1) Run the Flask API backend:
        python backend/app.py
     
  This will create and train the model.

  3) Run the React frontend:
        cd frontend
        npm start
     
  Open your browser at http://localhost:3000 to access the app.
