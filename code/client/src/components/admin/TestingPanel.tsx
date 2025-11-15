import React, { useState } from 'react';
import { Users, Play, Trash2, UserPlus, Check, X } from 'lucide-react';
import { api } from '../../services/api';

interface TestingPanelProps {
  leagueNightId: number;
  leagueId: number;
  onRefresh: () => void;
}

const TestingPanel: React.FC<TestingPanelProps> = ({ leagueNightId, leagueId, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [botCount, setBotCount] = useState(4);

  // Simulate bot check-ins
  const simulateCheckIns = async () => {
    setLoading(true);
    try {
      await api.dev.simulateCheckIns(leagueNightId, botCount);
      onRefresh();
    } catch (error) {
      console.error('Failed to simulate check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulate bot partnerships
  const simulatePartnerships = async () => {
    setLoading(true);
    try {
      await api.dev.simulatePartnerships(leagueNightId);
      onRefresh();
    } catch (error) {
      console.error('Failed to simulate partnerships:', error);
    } finally {
      setLoading(false);
    }
  };

  // Complete a random match
  const completeRandomMatch = async () => {
    setLoading(true);
    try {
      await api.dev.completeRandomMatch(leagueNightId);
      onRefresh();
    } catch (error) {
      console.error('Failed to complete match:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset league night
  const resetLeagueNight = async () => {
    if (!confirm('Reset this league night? This will delete all check-ins, partnerships, and matches.')) {
      return;
    }
    
    setLoading(true);
    try {
      await api.dev.resetLeagueNight(leagueNightId);
      onRefresh();
    } catch (error) {
      console.error('Failed to reset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-orange-500 text-white p-6 rounded-lg shadow-2xl border-4 border-orange-600 max-w-sm z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center">
          <Users className="h-5 w-5 mr-2" />
          🧪 Testing Panel
        </h3>
        <span className="text-xs bg-orange-700 px-2 py-1 rounded">DEV ONLY</span>
      </div>

      <div className="space-y-3">
        {/* Check-in Bots */}
        <div className="bg-white/10 p-3 rounded">
          <label className="block text-sm font-medium mb-2">
            Check In Bot Players
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="20"
              value={botCount}
              onChange={(e) => setBotCount(parseInt(e.target.value))}
              className="flex-1 px-3 py-2 bg-white/20 rounded text-white placeholder-white/50"
            />
            <button
              onClick={simulateCheckIns}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium flex items-center disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
        </div>

        {/* Create Partnerships */}
        <button
          onClick={simulatePartnerships}
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium flex items-center justify-center disabled:opacity-50"
        >
          <Check className="h-4 w-4 mr-2" />
          Auto-Pair All Players
        </button>

        {/* Complete Match */}
        <button
          onClick={completeRandomMatch}
          disabled={loading}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded font-medium flex items-center justify-center disabled:opacity-50"
        >
          <Play className="h-4 w-4 mr-2" />
          Complete Random Match
        </button>

        {/* Reset */}
        <button
          onClick={resetLeagueNight}
          disabled={loading}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded font-medium flex items-center justify-center disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Reset League Night
        </button>
      </div>

      <p className="text-xs mt-4 opacity-75 text-center">
        Only visible in development mode
      </p>
    </div>
  );
};

export default TestingPanel;
