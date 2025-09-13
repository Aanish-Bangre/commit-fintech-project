// WebSocket service for real-time market data
class MarketDataWebSocket {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
    this.reconnectDelay = 3000
    this.subscribedSymbols = new Set()
    this.pendingSubscriptions = new Set()
    this.listeners = new Map()
    this.isConnected = false
    this.reconnectTimeout = null
    this.pingInterval = null
    this.lastPong = null
  }

  connect() {
    // Clear any existing connection
    this.disconnect()
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    // Use backend port (8000) for WebSocket connection
    const wsUrl = `${protocol}//${window.location.hostname}:8000/api/v1/ws`
    
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
        
        // Process any pending subscriptions
        this.pendingSubscriptions.forEach(symbol => {
          this.subscribe(symbol)
        })
        this.pendingSubscriptions.clear()
        
        this.notifyListeners('connected', {})
        
        // Start ping-pong to keep connection alive
        this.startPing()
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          // Handle ping-pong
          if (data.type === 'pong') {
            return
          }
          this.handleMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error, event.data)
        }
      }
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.isConnected = false
        this.notifyListeners('disconnected', { code: event.code, reason: event.reason })
        this.stopPing()
        
        // Clear any pending reconnect
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout)
        }
        
        // Don't attempt to reconnect if closed normally
        if (event.code === 1000) {
          console.log('WebSocket closed normally')
          return
        }
        
        // Attempt to reconnect with exponential backoff
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(
            this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts),
            30000 // Max 30s delay
          )
          
          this.reconnectAttempts++
          console.log(`Attempting to reconnect in ${delay}ms... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
          
          this.reconnectTimeout = setTimeout(() => {
            this.connect()
          }, delay)
        } else {
          console.error('Max reconnection attempts reached')
          this.notifyListeners('reconnect_failed', { attempts: this.reconnectAttempts })
        }
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.notifyListeners('error', { error })
      }
      
    } catch (error) {
      console.error('Error creating WebSocket:', error)
      this.notifyListeners('error', { error })
      
      // Schedule reconnection attempt
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        console.log(`Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`)
        this.reconnectTimeout = setTimeout(() => this.connect(), this.reconnectDelay)
      }
    }
  }

  disconnect() {
    this.stopPing()
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    
    if (this.ws) {
      try {
        // Close with normal closure
        this.ws.close(1000, 'User initiated disconnect')
      } catch (e) {
        console.error('Error closing WebSocket:', e)
      }
      this.ws = null
    }
    
    this.isConnected = false
  }

  subscribe(symbol) {
    if (!symbol || typeof symbol !== 'string') {
      console.warn('Invalid symbol for subscription:', symbol)
      return
    }
    
    symbol = symbol.trim().toUpperCase()
    
    if (this.subscribedSymbols.has(symbol)) {
      return // Already subscribed
    }
    
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, queueing subscription to', symbol)
      this.pendingSubscriptions.add(symbol)
      
      // Try to reconnect if not already attempting to
      if (!this.reconnectTimeout && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.connect()
      }
      return
    }

    try {
      this.subscribedSymbols.add(symbol)
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        symbol: symbol,
        timestamp: Date.now()
      }))
      
      console.log(`Subscribed to ${symbol}`)
      
      // Remove from pending if it was there
      this.pendingSubscriptions.delete(symbol)
      
    } catch (error) {
      console.error('Error subscribing to symbol:', symbol, error)
      // Add to pending to retry later
      this.pendingSubscriptions.add(symbol)
    }
  }

  unsubscribe(symbol) {
    if (!symbol || typeof symbol !== 'string') {
      return
    }
    
    symbol = symbol.trim().toUpperCase()
    
    // Remove from pending subscriptions
    this.pendingSubscriptions.delete(symbol)
    
    // If not connected, just remove from our tracking
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.subscribedSymbols.delete(symbol)
      return
    }
    
    try {
      this.subscribedSymbols.delete(symbol)
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        symbol: symbol,
        timestamp: Date.now()
      }))
      
      console.log(`Unsubscribed from ${symbol}`)
    } catch (error) {
      console.error('Error unsubscribing from symbol:', symbol, error)
    }
  }

  handleMessage(data) {
    if (!data || typeof data !== 'object') {
      console.warn('Received invalid message data:', data)
      return
    }
    
    // Notify all listeners of the raw message
    this.notifyListeners('message', data)
    
    // Handle specific message types
    switch (data.type) {
      case 'market_data':
        if (data.symbol && data.data) {
          this.notifyListeners('market_data', {
            symbol: data.symbol,
            ...data.data
          })
        } else {
          console.warn('Invalid market_data message format:', data)
        }
        break
        
      case 'error':
        console.error('WebSocket server error:', data.message || data.error || 'Unknown error')
        this.notifyListeners('error', { 
          message: data.message || data.error || 'Unknown error',
          code: data.code,
          details: data.details
        })
        break
        
      case 'pong':
        // Update last pong time for connection health tracking
        this.lastPong = Date.now()
        break
        
      case 'subscribed':
        if (data.symbol) {
          console.log(`Successfully subscribed to ${data.symbol}`)
          this.notifyListeners('subscribed', { symbol: data.symbol })
        }
        break
        
      case 'unsubscribed':
        if (data.symbol) {
          console.log(`Successfully unsubscribed from ${data.symbol}`)
          this.notifyListeners('unsubscribed', { symbol: data.symbol })
        }
        break
        
      default:
        // Forward any other message types to specific listeners
        if (data.type && typeof data.type === 'string') {
          this.notifyListeners(data.type, data)
        } else {
          console.log('Received message with no or invalid type:', data)
        }
    }
  }

  startPing() {
    // Clear any existing interval
    this.stopPing()
    
    // Send ping every 30 seconds to keep connection alive
    this.pingInterval = setInterval(() => {
      if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({
            type: 'ping',
            timestamp: Date.now()
          }))
        } catch (error) {
          console.error('Error sending ping:', error)
        }
      }
    }, 30000) // 30 seconds
  }
  
  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
    
    // Return a cleanup function
    return () => this.removeListener(event, callback)
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      callbacks.delete(callback)
      
      // Clean up empty sets
      if (callbacks.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  notifyListeners(event, data) {
    if (!event || typeof event !== 'string') {
      console.warn('Invalid event type:', event)
      return
    }
    
    if (this.listeners.has(event)) {
      // Create a copy of the callbacks to avoid issues if they're modified during iteration
      const callbacks = Array.from(this.listeners.get(event))
      
      for (const callback of callbacks) {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} listener:`, error)
        }
      }
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
