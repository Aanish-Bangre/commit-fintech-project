import asyncio
import json
import logging
from typing import Dict, Set, List
from datetime import datetime, timedelta
import websockets
from websockets.server import WebSocketServerProtocol
from app.services.market_data import market_data_service

logger = logging.getLogger(__name__)

class WebSocketService:
    """WebSocket service for real-time market data updates"""
    
    def __init__(self):
        self.connections: Set[WebSocketServerProtocol] = set()
        self.subscribed_symbols: Dict[str, Set[WebSocketServerProtocol]] = {}
        self.update_interval = 5  # Update every 5 seconds
        self.is_running = False
        self.update_task = None
    
    async def register(self, websocket: WebSocketServerProtocol):
        """Register a new WebSocket connection"""
        self.connections.add(websocket)
        logger.info(f"New WebSocket connection registered. Total connections: {len(self.connections)}")
    
    async def unregister(self, websocket: WebSocketServerProtocol):
        """Unregister a WebSocket connection"""
        self.connections.discard(websocket)
        
        # Remove from all symbol subscriptions
        for symbol, connections in self.subscribed_symbols.items():
            connections.discard(websocket)
        
        logger.info(f"WebSocket connection unregistered. Total connections: {len(self.connections)}")
    
    async def subscribe_to_symbol(self, websocket: WebSocketServerProtocol, symbol: str):
        """Subscribe a connection to updates for a specific symbol"""
        if symbol not in self.subscribed_symbols:
            self.subscribed_symbols[symbol] = set()
        
        self.subscribed_symbols[symbol].add(websocket)
        logger.info(f"Connection subscribed to {symbol}. Total subscribers: {len(self.subscribed_symbols[symbol])}")
    
    async def unsubscribe_from_symbol(self, websocket: WebSocketServerProtocol, symbol: str):
        """Unsubscribe a connection from updates for a specific symbol"""
        if symbol in self.subscribed_symbols:
            self.subscribed_symbols[symbol].discard(websocket)
            if not self.subscribed_symbols[symbol]:
                del self.subscribed_symbols[symbol]
            logger.info(f"Connection unsubscribed from {symbol}")
    
    async def broadcast_to_subscribers(self, symbol: str, data: Dict):
        """Broadcast market data to all subscribers of a symbol"""
        if symbol not in self.subscribed_symbols:
            return
        
        message = json.dumps({
            "type": "market_data",
            "symbol": symbol,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Send to all subscribers
        disconnected = set()
        for websocket in self.subscribed_symbols[symbol]:
            try:
                await websocket.send(message)
            except websockets.exceptions.ConnectionClosed:
                disconnected.add(websocket)
        
        # Clean up disconnected connections
        for websocket in disconnected:
            await self.unregister(websocket)
    
    async def broadcast_to_all(self, message: Dict):
        """Broadcast a message to all connected clients"""
        if not self.connections:
            return
        
        message_str = json.dumps(message)
        disconnected = set()
        
        for websocket in self.connections:
            try:
                await websocket.send(message_str)
            except websockets.exceptions.ConnectionClosed:
                disconnected.add(websocket)
        
        # Clean up disconnected connections
        for websocket in disconnected:
            await self.unregister(websocket)
    
    async def start_market_data_updates(self):
        """Start the market data update loop"""
        if self.is_running:
            return
        
        self.is_running = True
        logger.info("Starting market data update loop...")
        
        while self.is_running:
            try:
                # Update all subscribed symbols
                for symbol in list(self.subscribed_symbols.keys()):
                    try:
                        market_data = await market_data_service.get_market_data(symbol)
                        await self.broadcast_to_subscribers(symbol, market_data)
                    except Exception as e:
                        logger.error(f"Error updating market data for {symbol}: {e}")
                        # Send error message to subscribers
                        error_message = {
                            "type": "error",
                            "symbol": symbol,
                            "message": f"Failed to fetch market data: {str(e)}",
                            "timestamp": datetime.utcnow().isoformat()
                        }
                        await self.broadcast_to_subscribers(symbol, error_message)
                
                # Wait before next update
                await asyncio.sleep(self.update_interval)
                
            except Exception as e:
                logger.error(f"Error in market data update loop: {e}")
                await asyncio.sleep(self.update_interval)
    
    async def stop_market_data_updates(self):
        """Stop the market data update loop"""
        self.is_running = False
        logger.info("Stopping market data update loop...")
    
    async def handle_message(self, websocket: WebSocketServerProtocol, message: str):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(message)
            message_type = data.get("type")
            
            if message_type == "subscribe":
                symbol = data.get("symbol")
                if symbol:
                    await self.subscribe_to_symbol(websocket, symbol)
                    # Send current market data immediately
                    try:
                        market_data = await market_data_service.get_market_data(symbol)
                        await websocket.send(json.dumps({
                            "type": "market_data",
                            "symbol": symbol,
                            "data": market_data,
                            "timestamp": datetime.utcnow().isoformat()
                        }))
                    except Exception as e:
                        await websocket.send(json.dumps({
                            "type": "error",
                            "symbol": symbol,
                            "message": f"Failed to fetch market data: {str(e)}",
                            "timestamp": datetime.utcnow().isoformat()
                        }))
            
            elif message_type == "unsubscribe":
                symbol = data.get("symbol")
                if symbol:
                    await self.unsubscribe_from_symbol(websocket, symbol)
            
            elif message_type == "ping":
                await websocket.send(json.dumps({
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat()
                }))
            
            else:
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": f"Unknown message type: {message_type}",
                    "timestamp": datetime.utcnow().isoformat()
                }))
                
        except json.JSONDecodeError:
            await websocket.send(json.dumps({
                "type": "error",
                "message": "Invalid JSON message",
                "timestamp": datetime.utcnow().isoformat()
            }))
        except Exception as e:
            logger.error(f"Error handling WebSocket message: {e}")
            await websocket.send(json.dumps({
                "type": "error",
                "message": f"Internal server error: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }))

# Global WebSocket service instance
websocket_service = WebSocketService()

async def websocket_handler(websocket: WebSocketServerProtocol, path: str):
    """WebSocket connection handler"""
    await websocket_service.register(websocket)
    
    try:
        async for message in websocket:
            await websocket_service.handle_message(websocket, message)
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        await websocket_service.unregister(websocket)

async def start_websocket_server(host: str = "localhost", port: int = 8765):
    """Start the WebSocket server"""
    logger.info(f"Starting WebSocket server on {host}:{port}")
    
    # Start market data update loop
    asyncio.create_task(websocket_service.start_market_data_updates())
    
    # Start WebSocket server
    async with websockets.serve(websocket_handler, host, port):
        logger.info(f"WebSocket server started on {host}:{port}")
        await asyncio.Future()  # Run forever
