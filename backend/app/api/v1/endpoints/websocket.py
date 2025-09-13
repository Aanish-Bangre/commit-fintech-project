from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import HTMLResponse
import json
import logging
from app.services.websocket_service import websocket_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time market data"""
    await websocket.accept()
    await websocket_service.register(websocket)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            await websocket_service.handle_message(websocket, data)
            
    except WebSocketDisconnect:
        await websocket_service.unregister(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket_service.unregister(websocket)

@router.get("/ws-test")
async def websocket_test():
    """Test page for WebSocket connection"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>WebSocket Market Data Test</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
            .connected { background-color: #d4edda; color: #155724; }
            .disconnected { background-color: #f8d7da; color: #721c24; }
            .data { background-color: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px; }
            button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; }
            .subscribe { background-color: #007bff; color: white; }
            .unsubscribe { background-color: #dc3545; color: white; }
            input { padding: 8px; margin: 5px; border: 1px solid #ccc; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>WebSocket Market Data Test</h1>
            
            <div id="status" class="status disconnected">Disconnected</div>
            
            <div>
                <input type="text" id="symbolInput" placeholder="Enter symbol (e.g., BHARTIARTL)" value="BHARTIARTL">
                <button class="subscribe" onclick="subscribe()">Subscribe</button>
                <button class="unsubscribe" onclick="unsubscribe()">Unsubscribe</button>
                <button onclick="ping()">Ping</button>
            </div>
            
            <div id="data" class="data">No data received yet...</div>
            
            <div>
                <h3>Subscribed Symbols:</h3>
                <ul id="subscribed"></ul>
            </div>
        </div>

        <script>
            let ws = null;
            let subscribedSymbols = new Set();
            
            function connect() {
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = `${protocol}//${window.location.host}/api/v1/ws`;
                
                ws = new WebSocket(wsUrl);
                
                ws.onopen = function(event) {
                    document.getElementById('status').textContent = 'Connected';
                    document.getElementById('status').className = 'status connected';
                };
                
                ws.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    displayData(data);
                };
                
                ws.onclose = function(event) {
                    document.getElementById('status').textContent = 'Disconnected';
                    document.getElementById('status').className = 'status disconnected';
                    // Reconnect after 3 seconds
                    setTimeout(connect, 3000);
                };
                
                ws.onerror = function(error) {
                    console.error('WebSocket error:', error);
                };
            }
            
            function subscribe() {
                const symbol = document.getElementById('symbolInput').value.toUpperCase();
                if (symbol && ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'subscribe',
                        symbol: symbol
                    }));
                    subscribedSymbols.add(symbol);
                    updateSubscribedList();
                }
            }
            
            function unsubscribe() {
                const symbol = document.getElementById('symbolInput').value.toUpperCase();
                if (symbol && ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'unsubscribe',
                        symbol: symbol
                    }));
                    subscribedSymbols.delete(symbol);
                    updateSubscribedList();
                }
            }
            
            function ping() {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'ping'
                    }));
                }
            }
            
            function displayData(data) {
                const dataDiv = document.getElementById('data');
                const timestamp = new Date(data.timestamp).toLocaleTimeString();
                
                if (data.type === 'market_data') {
                    const marketData = data.data;
                    dataDiv.innerHTML = `
                        <h4>${data.symbol} - ${timestamp}</h4>
                        <p><strong>Price:</strong> ₹${marketData.price.toFixed(2)}</p>
                        <p><strong>Change:</strong> ${marketData.change >= 0 ? '+' : ''}₹${marketData.change.toFixed(2)} (${marketData.change_percent.toFixed(2)}%)</p>
                        <p><strong>Volume:</strong> ${marketData.volume.toLocaleString()}</p>
                        <p><strong>High:</strong> ₹${marketData.high.toFixed(2)} | <strong>Low:</strong> ₹${marketData.low.toFixed(2)}</p>
                        <p><strong>Open:</strong> ₹${marketData.open.toFixed(2)} | <strong>Previous Close:</strong> ₹${marketData.previous_close.toFixed(2)}</p>
                    `;
                } else if (data.type === 'error') {
                    dataDiv.innerHTML = `
                        <h4>Error - ${timestamp}</h4>
                        <p style="color: red;"><strong>${data.symbol}:</strong> ${data.message}</p>
                    `;
                } else if (data.type === 'pong') {
                    dataDiv.innerHTML = `
                        <h4>Pong - ${timestamp}</h4>
                        <p>Server is responding!</p>
                    `;
                }
            }
            
            function updateSubscribedList() {
                const list = document.getElementById('subscribed');
                list.innerHTML = '';
                subscribedSymbols.forEach(symbol => {
                    const li = document.createElement('li');
                    li.textContent = symbol;
                    list.appendChild(li);
                });
            }
            
            // Connect when page loads
            connect();
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html)

@router.get("/ws-status")
async def websocket_status():
    """Get WebSocket service status"""
    return {
        "connections": len(websocket_service.connections),
        "subscribed_symbols": list(websocket_service.subscribed_symbols.keys()),
        "is_running": websocket_service.is_running,
        "update_interval": websocket_service.update_interval
    }
