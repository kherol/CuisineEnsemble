from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.core.config import settings
from app.database import Base, engine
from app.routers import admin, auth, chat, meals, reports, reservations, reviews

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST de la plateforme CuisineEnsemble",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(meals.router, prefix="/api")
app.include_router(reservations.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

Instrumentator().instrument(app).expose(app, endpoint="/metrics")


@app.get("/api/health", tags=["Health"])
def health():
    return {"status": "ok", "service": "cuisineensemble-api"}
