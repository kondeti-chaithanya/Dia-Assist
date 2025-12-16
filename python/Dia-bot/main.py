from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chat_router import router
import os

from services.ingest_service import ingest_pdf


app = FastAPI(title="Diabetes RAG Chatbot")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



if not os.path.exists("vector_index/store.pkl"):
    print(" Ingesting diabetes textbook...")
    ingest_pdf("data/dia-textbook.pdf")
    print(" Ingestion complete!")




app.include_router(router, prefix="/chat", tags=["Chatbot"])



@app.get("/")
def home():
    return {"message": "Diabetes RAG Chatbot is running!"}
