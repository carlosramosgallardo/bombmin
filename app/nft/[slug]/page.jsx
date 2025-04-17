import supabase from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic'; // Necesario para SSR en App Router

export default async function NFTPage({ params }) {
  const { slug } = params;

  const { data, error } = await supabase
    .from('computed_user_nfts')
    .select('nft_slug, name, description, image_url, rarity, wallet')
    .eq('nft_slug', slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return (
      <div className="text-center mt-20 text-[#e11d48] font-mono">
        NFT not found or currently unassigned.
      </div>
    );
  }

  const maskWallet = (wallet) =>
    wallet ? `${wallet.slice(0, 5)}...${wallet.slice(-5)}` : '—';

  return (
    <main className="flex flex-col items-center w-full pt-10 pb-20 text-sm font-mono text-gray-200 bg-black">
      <div className="w-full max-w-3xl px-4">
        <div className="p-6 bg-[#0b0f19] border border-[#22d3ee] rounded-lg shadow-lg animate-fade-in text-center">
          <img
            src={data.image_url}
            alt={data.nft_slug}
            className="w-48 h-48 mx-auto mb-4 rounded-lg"
          />
          <h1 className="text-2xl font-bold mb-2 text-white">{data.name}</h1>
          <p className="text-sm text-gray-300 mb-4">{data.description}</p>
          <div className="text-sm font-mono">
            <span className="text-gray-400">Rarity:</span> {data.rarity}
          </div>
          <div className="text-sm font-mono mt-1">
            <span className="text-gray-400">Owner:</span>{' '}
            {data.wallet ? maskWallet(data.wallet) : 'Unassigned'}
          </div>
        </div>
      </div>
    </main>
  );
}
