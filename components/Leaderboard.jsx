'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);

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
        .from('leaderboard_with_nfts') 
        .select('wallet, total_eth, nfts')
        .order('total_eth', { ascending: false });

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

  const maskWallet = (wallet) => {
    if (!wallet || wallet.length <= 10) return wallet;
    return wallet.slice(0, 5) + '...' + wallet.slice(-5);
  };

  return (
    <div className="w-full overflow-auto">
      <table className="table-fixed w-full mx-auto border border-[#22d3ee] rounded-xl text-sm md:text-base">
        <thead className="bg-[#0b0f19] text-[#22d3ee]">
          <tr>
            <th className="border border-[#22d3ee] px-4 py-2 text-left font-mono">
              Wallet
            </th>
            <th className="border border-[#22d3ee] px-4 py-2 text-right font-mono">
              MM3
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
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs">{maskWallet(entry.wallet)}</span>
                    {entry.nfts?.map((nft) => (
                      <a
                        href={`/nft/${nft.slug}`}
                        key={nft.slug}
                        title={nft.name}
                      >
                        <img
                          src={nft.image_url}
                          alt={nft.slug}
                          className="h-5 w-5 rounded-sm ml-1 hover:scale-105 transition"
                        />
                      </a>
                    ))}
                  </div>
                </td>
                <td className="border border-[#22d3ee] px-4 py-2 font-mono text-right">
                  {entry.total_eth}
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
    </div>
  );
}
