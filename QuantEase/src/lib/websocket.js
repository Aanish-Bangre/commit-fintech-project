// WebSocket service for real-time market data
class MarketDataWebSocket {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.subscribedSymbols = new Set()
    this.listeners = new Map()
    this.isConnected = false
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    // Use backend port (8000) for WebSocket connection
    const wsUrl = `${protocol}//localhost:8000/api/v1/ws`
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnected = true
        this.reconnectAttempts = 0
        
        // Re-subscribe to all symbols
        this.subscribedSymbols.forEach(symbol => {
          this.subscribe(symbol)
        })
        
        this.notifyListeners('connected', {})
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.isConnected = false
        this.notifyListeners('disconnected', {})
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
          setTimeout(() => this.connect(), this.reconnectDelay)
        }
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.notifyListeners('error', { error })
      }
      
    } catch (error) {
      console.error('Error creating WebSocket:', error)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
  }

  subscribe(symbol) {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket not connected, cannot subscribe to', symbol)
      return
    }

    this.subscribedSymbols.add(symbol)
    this.ws.send(JSON.stringify({
      type: 'subscribe',
      symbol: symbol
    }))
    
    console.log(`Subscribed to ${symbol}`)
  }

  unsubscribe(symbol) {
    if (!this.isConnected || !this.ws) {
      return
    }

    this.subscribedSymbols.delete(symbol)
    this.ws.send(JSON.stringify({
      type: 'unsubscribe',
      symbol: symbol
    }))
    
    console.log(`Unsubscribed from ${symbol}`)
  }

  handleMessage(data) {
    switch (data.type) {
      case 'market_data':
        this.notifyListeners('market_data', {
          symbol: data.symbol,
          data: data.data,
          timestamp: data.timestamp
        })
        break
        
      case 'error':
        this.notifyListeners('error', {
          symbol: data.symbol,
          message: data.message,
          timestamp: data.timestamp
        })
        break
        
      case 'pong':
        this.notifyListeners('pong', {
          timestamp: data.timestamp
        })
        break
        
      default:
        console.log('Unknown message type:', data.type)
    }
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback)
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in WebSocket listener:', error)
        }
      })
    }
  }

  ping() {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify({
        type: 'ping'
      }))
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      subscribedSymbols: Array.from(this.subscribedSymbols),
      reconnectAttempts: this.reconnectAttempts
    }
  }
}

// Create a singleton instance
const marketDataWebSocket = new MarketDataWebSocket()

// Auto-connect when the module is imported (disabled for now)
// if (typeof window !== 'undefined') {
//   marketDataWebSocket.connect()
// }

export default marketDataWebSocket
