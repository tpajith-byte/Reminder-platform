from fastapi import FastAPI

app = FastAPI(title="Reminder Platform API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Reminder Platform API"}
