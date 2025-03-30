'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);

  // Cache settings: 60 segundos
  const cacheDuration = 60 * 1000;
  const cacheKey = 'leaderboard_data';
  const lastFetchTimeKey = 'leaderboard_last_fetch_time';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const lastFetchTime = localStorage.getItem(lastFetchTimeKey);
      const currentTime = Date.now();

      if (lastFetchTime && currentTime - lastFetchTime < cacheDuration) {
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData) {
          setLeaderboard(cachedData);
          setIsLoading(false);
          return;
        }
      }

      const { data, error } = await supabase
        .from('leaderboard')
        .select('wallet, total_eth')
        .order('total_eth', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Failed to load leaderboard:', error);
        setLeaderboard([]);
      } else {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(lastFetchTimeKey, currentTime.toString());
        setLeaderboard(data);
      }
      setIsLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboard.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);

  return (
    <table className="table-fixed w-full mx-auto border border-[#22d3ee] rounded-xl text-sm md:text-base">
      <thead className="bg-[#0b0f19] text-[#22d3ee]">
        <tr>
          <th className="border border-[#22d3ee] px-4 py-2 text-left font-mono">
            Wallet
          </th>
          <th className="border border-[#22d3ee] px-4 py-2 text-right font-mono">
            ETH
          </th>
        </tr>
      </thead>
      <tbody className="bg-[#0b0f19] text-[#22d3ee]">
        {isLoading ? (
          <tr>
            <td colSpan="2" className="border border-[#22d3ee] px-4 py-2 text-center">
              Loading leaderboard...
            </td>
          </tr>
        ) : currentItems.length > 0 ? (
          currentItems.map((entry, index) => (
            <tr key={index} className="hover:bg-[#1e293b] transition">
              <td className="border border-[#22d3ee] px-4 py-2 font-mono whitespace-normal break-words">
                {entry.wallet}
              </td>
              <td className="border border-[#22d3ee] px-4 py-2 font-mono text-right">
                {Number(entry.total_eth).toFixed(6)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2" className="border border-[#22d3ee] px-4 py-2 text-center">
              No leaderboard data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
