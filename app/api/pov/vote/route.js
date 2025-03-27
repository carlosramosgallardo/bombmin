import { createClient } from '@supabase/supabase-js';
import { checkContributorEligibility } from '../../../pov/lib/contributors';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const { poll_id, wallet_address, vote } = await req.json();
  const wallet = wallet_address?.toLowerCase();

  // 🛡️ Validación básica
  if (!poll_id || !wallet || !vote) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), {
      status: 400,
    });
  }

  // ✅ Verificar elegibilidad usando la vista `leaderboard`
  const eligible = await checkContributorEligibility(wallet);
  if (!eligible) {
    return new Response(JSON.stringify({ error: 'Wallet not eligible to vote (must have ≥ 0.00001 ETH)' }), {
      status: 403,
    });
  }

  // ✅ Intentar insertar el voto
  const { error } = await supabase
    .from('poll_votes')
    .insert([{ poll_id, wallet_address: wallet, vote }]);

  // ⚠️ Ya votó
  if (error?.code === '23505') {
    return new Response(JSON.stringify({ error: 'You have already voted in this poll' }), {
      status: 409,
    });
  }

  // ⚠️ Otro error
  if (error) {
    console.error('❌ Vote insert error:', error.message);
    return new Response(JSON.stringify({ error: 'Unexpected database error' }), {
      status: 500,
    });
  }

  // ✅ Éxito
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
