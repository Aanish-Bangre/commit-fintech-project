from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
import asyncio

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="QuantEase - Algorithmic Trading Platform Backend API",
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to QuantEase API",
        "version": settings.app_version,
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": settings.app_version}


# WebSocket service startup (disabled for now)
# @app.on_event("startup")
# async def startup_event():
#     """Start WebSocket service on startup"""
#     from app.services.websocket_service import websocket_service
#     # Start the market data update loop
#     asyncio.create_task(websocket_service.start_market_data_updates())

# @app.on_event("shutdown")
# async def shutdown_event():
#     """Stop WebSocket service on shutdown"""
#     from app.services.websocket_service import websocket_service
#     await websocket_service.stop_market_data_updates()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
