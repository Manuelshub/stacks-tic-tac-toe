"use client";

import { getPlayerStats } from "@/lib/contract";
import { useStacks } from "@/hooks/use-stacks";
import { useEffect, useState } from "react";

type PlayerStats = {
  wins: number;
  losses: number;
  draws: number;
  "total-games": number;
};

export function PlayerStats() {
  const { userData } = useStacks();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      const address = userData.profile.stxAddress.testnet;
      getPlayerStats(address)
        .then((playerStats) => {
          setStats(playerStats);
        })
        .catch((error) => {
          console.error("Error fetching player stats:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (!userData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Your Statistics</h3>
        <p className="text-gray-500">Connect your wallet to view your game statistics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Your Statistics</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Your Statistics</h3>
        <p className="text-gray-500">Failed to load statistics</p>
      </div>
    );
  }

  const winRate = stats["total-games"] > 0 
    ? ((stats.wins / stats["total-games"]) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Your Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{stats.wins}</div>
          <div className="text-sm text-gray-400">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{stats.losses}</div>
          <div className="text-sm text-gray-400">Losses</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.draws}</div>
          <div className="text-sm text-gray-400">Draws</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{stats["total-games"]}</div>
          <div className="text-sm text-gray-400">Total Games</div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-lg font-bold text-purple-500">{winRate}%</div>
          <div className="text-sm text-gray-400">Win Rate</div>
        </div>
      </div>
    </div>
  );
}