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
    <div className="mt-8 mx-auto p-4 bg-[#0b0f19] rounded-xl shadow-lg">
      <div className="overflow-x-auto">
        <table className="table-auto w-auto border border-[#22d3ee] border-dotted text-sm md:text-base">
          <thead className="bg-black text-[#22d3ee]">
            <tr>
              <th className="border border-[#22d3ee] border-dotted px-4 py-2 text-left font-mono">
                Wallet
              </th>
              <th className="border border-[#22d3ee] border-dotted px-4 py-2 text-right font-mono">
                ETH
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#0b0f19] text-[#22d3ee]">
            {isLoading ? (
              <tr>
                <td colSpan="2" className="border border-[#22d3ee] border-dotted px-4 py-2 text-center">
                  Loading leaderboard...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((entry, index) => (
                <tr key={index} className="hover:bg-[#1e293b] transition">
                  <td className="border border-[#22d3ee] border-dotted px-4 py-2 font-mono">
                    {entry.wallet}
                  </td>
                  <td className="border border-[#22d3ee] border-dotted px-4 py-2 font-mono text-right">
                    {Number(entry.total_eth).toFixed(6)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border border-[#22d3ee] border-dotted px-4 py-2 text-center">
                  No leaderboard data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border border-[#22d3ee] rounded font-mono transition ${
                currentPage === i + 1
                  ? 'bg-[#22d3ee] text-black font-bold'
                  : 'bg-black text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black'
              }`}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
