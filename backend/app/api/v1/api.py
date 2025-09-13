from fastapi import APIRouter
from app.api.v1.endpoints import strategies, backtests, paper_trades, risk_reports, marketplace, comments, education, user_progress, compliance

api_router = APIRouter()

api_router.include_router(strategies.router, prefix="/strategies", tags=["strategies"])
api_router.include_router(backtests.router, prefix="/backtests", tags=["backtests"])
api_router.include_router(paper_trades.router, prefix="/paper-trades", tags=["paper-trades"])
api_router.include_router(risk_reports.router, prefix="/risk-reports", tags=["risk-reports"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["marketplace"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(education.router, prefix="/education", tags=["education"])
api_router.include_router(user_progress.router, prefix="/user-progress", tags=["user-progress"])
api_router.include_router(compliance.router, prefix="/compliance", tags=["compliance"])
