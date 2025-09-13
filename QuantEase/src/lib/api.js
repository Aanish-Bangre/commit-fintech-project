// API client for QuantEase backend
import { API_CONFIG } from '@/config/api'

const API_BASE = API_CONFIG.BASE_URL

class QuantEaseAPI {
  constructor() {
    this.baseURL = API_BASE
  }

  async getAuthHeaders() {
    const { data: { session } } = await import('./supabase').then(m => m.supabase.auth.getSession())
    if (!session?.access_token) {
      throw new Error('No authentication token found')
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = await this.getAuthHeaders()
    
    const config = {
      headers,
      ...options
    }
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API Error: ${response.status}`)
    }
    
    return response.json()
  }

  // Strategies
  async createStrategy(strategy) {
    return this.request('/strategies', {
      method: 'POST',
      body: JSON.stringify(strategy)
    })
  }

  async getStrategies() {
    return this.request('/strategies')
  }

  async getStrategy(id) {
    return this.request(`/strategies/${id}`)
  }

  async updateStrategy(id, strategy) {
    return this.request(`/strategies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(strategy)
    })
  }

  async deleteStrategy(id) {
    return this.request(`/strategies/${id}`, {
      method: 'DELETE'
    })
  }

  async generateCode(config) {
    return this.request('/strategies/generate-code', {
      method: 'POST',
      body: JSON.stringify(config)
    })
  }

  // Backtests
  async runBacktest(backtestConfig) {
    return this.request('/backtests', {
      method: 'POST',
      body: JSON.stringify(backtestConfig)
    })
  }

  async getBacktests() {
    return this.request('/backtests')
  }

  async getBacktest(id) {
    return this.request(`/backtests/${id}`)
  }

  async getStrategyBacktests(strategyId) {
    return this.request(`/backtests/strategy/${strategyId}`)
  }

  // Risk Reports
  async getRiskReport(backtestId) {
    return this.request(`/risk-reports/${backtestId}`)
  }

  // Paper Trading
  async createPaperTrade(trade) {
    return this.request('/paper-trades', {
      method: 'POST',
      body: JSON.stringify(trade)
    })
  }

  async getPaperTrades() {
    return this.request('/paper-trades')
  }

  // Marketplace
  async getMarketplaceStrategies() {
    return this.request('/marketplace')
  }

  async addToMarketplace(strategyId) {
    return this.request('/marketplace', {
      method: 'POST',
      body: JSON.stringify({ strategy_id: strategyId })
    })
  }

  async likeStrategy(marketplaceId) {
    return this.request(`/marketplace/${marketplaceId}/like`, {
      method: 'POST'
    })
  }

  async forkStrategy(marketplaceId) {
    return this.request(`/marketplace/${marketplaceId}/fork`, {
      method: 'POST'
    })
  }
}

export const api = new QuantEaseAPI()
