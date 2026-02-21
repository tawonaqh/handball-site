const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Live Match Service
 * Handles all API calls related to live match tracking
 */

export const liveMatchService = {
  /**
   * Get current live match data (public endpoint)
   */
  async getLiveMatchData(gameId) {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}/live`);
      if (!response.ok) {
        throw new Error('Failed to fetch live match data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching live match data:', error);
      throw error;
    }
  },

  /**
   * Update live match state (admin endpoint)
   */
  async updateLiveMatch(gameId, matchState, token) {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}/live-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(matchState)
      });

      if (!response.ok) {
        throw new Error('Failed to update live match');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating live match:', error);
      throw error;
    }
  },

  /**
   * Finalize match and update all stats (admin endpoint)
   */
  async finalizeMatch(gameId, finalData, token) {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}/finalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to finalize match');
      }

      return await response.json();
    } catch (error) {
      console.error('Error finalizing match:', error);
      throw error;
    }
  },

  /**
   * Get team standings for a league
   */
  async getLeagueStandings(leagueId) {
    try {
      const response = await fetch(`${API_URL}/leagues/${leagueId}/standings`);
      if (!response.ok) {
        throw new Error('Failed to fetch league standings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching league standings:', error);
      throw error;
    }
  },

  /**
   * Get player rankings
   */
  async getPlayerRankings(seasonId, category = 'top_scorer') {
    try {
      const response = await fetch(`${API_URL}/rankings/players?season=${seasonId}&category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch player rankings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching player rankings:', error);
      throw error;
    }
  },

  /**
   * Get player statistics
   */
  async getPlayerStats(playerId, seasonId) {
    try {
      const response = await fetch(`${API_URL}/players/${playerId}/stats?season=${seasonId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch player stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  }
};

/**
 * WebSocket connection for real-time updates (optional, more advanced)
 */
export class LiveMatchWebSocket {
  constructor(gameId, onMessage, onError) {
    this.gameId = gameId;
    this.onMessage = onMessage;
    this.onError = onError;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
    
    try {
      this.ws = new WebSocket(`${wsUrl}/games/${this.gameId}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.onError) {
          this.onError(error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      if (this.onError) {
        this.onError(new Error('Failed to reconnect'));
      }
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default liveMatchService;
