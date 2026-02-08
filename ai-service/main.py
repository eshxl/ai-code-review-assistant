from fastapi import FastAPI
from app.routers import review

app = FastAPI(title="AI Review Service")

app.include_router(review.router)