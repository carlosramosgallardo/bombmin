'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);

  // Cache the leaderboard data for 60 seconds
  const cacheDuration = 60 * 1000; // 60 seconds
  const cacheKey = 'leaderboard_data';
  const lastFetchTimeKey = 'leaderboard_last_fetch_time';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Check if cached data is available and valid
      const lastFetchTime = localStorage.getItem(lastFetchTimeKey);
      const currentTime = Date.now();

      if (lastFetchTime && currentTime - lastFetchTime < cacheDuration) {
        // If the data is cached and it's still valid, use the cached data
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData) {
          setLeaderboard(cachedData);
          setIsLoading(false);
          return;
        }
      }

      // Fetch the leaderboard data from the API if not cached or cache expired
      const { data, error } = await supabase
        .from('leaderboard')
        .select('wallet, total_eth')
        .order('total_eth', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Failed to load leaderboard:', error);
        setLeaderboard([]);
      } else {
        // Cache the response and set the fetch time
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
    <div className="mt-8 w-full max-w-3xl mx-auto">

      <div className="overflow-x-auto">
        <table className="w-full border border-white text-sm md:text-base">
          <thead className="bg-black text-white">
            <tr>
              <th className="border border-white px-4 py-2 text-left">Wallet</th>
              <th className="border border-white px-4 py-2 text-right">ETH</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="2" className="border border-white px-4 py-2 text-center text-gray-400">
                  Loading leaderboard...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-800 transition">
                  <td className="border border-white px-4 py-2 font-mono break-all">
                    {entry.wallet}
                  </td>
                  <td className="border border-white px-4 py-2 font-mono text-right">
                    {Number(entry.total_eth).toFixed(6)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border border-white px-4 py-2 text-center text-gray-400">
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
              className={`px-3 py-1 border rounded ${currentPage === i + 1
                ? 'bg-white text-black font-bold'
                : 'border-white text-white hover:bg-white hover:text-black transition'
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
