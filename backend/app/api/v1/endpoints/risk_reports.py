import uuid
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.database import supabase
from app.models.risk_report import RiskReportOut
from app.services.auth import get_current_user

router = APIRouter()


@router.get("/{backtest_id}", response_model=RiskReportOut)
async def get_risk_report(backtest_id: UUID, user=Depends(get_current_user)):
    """Get or generate a risk report for a backtest"""
    # First check if a risk report already exists
    resp = await run_in_threadpool(
        supabase.table("risk_reports")
        .select("*")
        .eq("backtest_id", str(backtest_id))
        .single
    )
    
    if getattr(resp, "data", None):
        # Return existing report
        d = resp.data
        return RiskReportOut(
            id=UUID(d["id"]),
            backtest_id=UUID(d["backtest_id"]),
            risk_level=d["risk_level"],
            max_drawdown=float(d["max_drawdown"]),
            sharpe=float(d["sharpe"]),
            volatility=float(d["volatility"]),
            recommendations=d.get("recommendations", {}),
            created_at=datetime.fromisoformat(d["created_at"]),
        )

    # If no report exists, verify backtest belongs to user and generate one
    bresp = await run_in_threadpool(
        supabase.table("backtests")
        .select("strategy_id, metrics_json")
        .eq("id", str(backtest_id))
        .single
    )
    
    if not getattr(bresp, "data", None):
        raise HTTPException(status_code=404, detail="Backtest not found")
    
    # Verify strategy belongs to user
    strategy_resp = await run_in_threadpool(
        supabase.table("strategies")
        .select("id")
        .eq("id", bresp.data["strategy_id"])
        .eq("user_id", user["id"])
        .single
    )
    
    if not strategy_resp.data:
        raise HTTPException(status_code=403, detail="Access denied")

    # Generate risk report from backtest metrics
    metrics = bresp.data.get("metrics_json", {})
    sharpe = metrics.get("sharpe", 0.0)
    max_dd = metrics.get("max_drawdown", -1.0)
    volatility = metrics.get("volatility", 0.0)

    # Determine risk level based on metrics
    if sharpe >= 1.5 and max_dd > -0.2:
        risk_level = "low"
    elif 1.0 <= sharpe < 1.5 or max_dd <= -0.2:
        risk_level = "moderate"
    else:
        risk_level = "high"

    # Generate recommendations
    recommendations = {
        "risk_level": risk_level,
        "notes": []
    }
    
    if max_dd < -0.3:
        recommendations["notes"].append("High maximum drawdown detected. Consider reducing position size.")
    
    if sharpe < 1.0:
        recommendations["notes"].append("Low Sharpe ratio. Strategy may need optimization.")
    
    if volatility > 0.3:
        recommendations["notes"].append("High volatility detected. Consider risk management measures.")
    
    if not recommendations["notes"]:
        recommendations["notes"].append("Strategy shows good risk-adjusted returns.")

    # Save the generated report
    report_id = uuid.uuid4()
    now = datetime.utcnow().isoformat()
    row = {
        "id": str(report_id),
        "backtest_id": str(backtest_id),
        "risk_level": risk_level,
        "max_drawdown": max_dd,
        "sharpe": sharpe,
        "volatility": volatility,
        "recommendations": recommendations,
        "created_at": now,
    }
    
    res = await run_in_threadpool(supabase.table("risk_reports").insert, row)
    
    if res.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create risk report: {res.error}"
        )
    
    return RiskReportOut(
        id=report_id,
        backtest_id=backtest_id,
        risk_level=risk_level,
        max_drawdown=max_dd,
        sharpe=sharpe,
        volatility=volatility,
        recommendations=recommendations,
        created_at=datetime.fromisoformat(now),
    )
