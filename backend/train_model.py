import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
import joblib

def train_and_save_model():
    print("Loading dataset...")
    df = pd.read_csv("D:/COLLEGE/SEM_5/ML/StockData/Stocks/gogl.us.txt")
    
    X = df[['Open']].values
    Y = df['Close'].values

    # Splitting data
    X_Train, X_Test, Y_Train, Y_Test = train_test_split(X, Y, test_size=0.2, random_state=42)

    print("Training SVR model...")
    # We use a pipeline to scale features, which is highly recommended for SVR
    model = make_pipeline(StandardScaler(), SVR(kernel='rbf', C=100, gamma=0.1, epsilon=.1))
    model.fit(X_Train, Y_Train)
    
    print("Saving model...")
    joblib.dump(model, "svr_model.pkl")
    print("Model 'svr_model.pkl' saved successfully.")

if __name__ == "__main__":
    train_and_save_model()
