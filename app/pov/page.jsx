import { WagmiConfig, createConfig } from 'wagmi';
import { useAccount } from 'wagmi';
import supabase from '@/lib/supabaseClient';
import { mainnet } from 'wagmi/chains';
import { http } from 'wagmi';

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

export default function PoVPage() {
  const { address, isConnected } = useAccount();
  const [pollData, setPollData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [votedPollId, setVotedPollId] = useState(null);
  const [voteResults, setVoteResults] = useState({});

  useEffect(() => {
    async function fetchPolls() {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select('id, question, created_at')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setPollData(data);
      } catch (error) {
        console.error('Error fetching polls', error);
      }
    }

    fetchPolls();
  }, []);

  const handleVote = async (pollId, vote) => {
    if (!isConnected || !address) {
      setStatusMessage('Please connect your wallet first.');
      return;
    }

    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert([{ poll_id: pollId, wallet_address: address, vote }]);

      if (error) {
        setStatusMessage('Error submitting your vote.');
        console.error(error);
        return;
      }

      setStatusMessage('Vote submitted successfully!');
      setVotedPollId(pollId);
      fetchVoteResults(pollId);
    } catch (err) {
      console.error('Unexpected error:', err);
      setStatusMessage('An error occurred. Please try again.');
    }
  };

  const fetchVoteResults = async (pollId) => {
    const { data, error } = await supabase
      .from('poll_votes')
      .select('vote')
      .eq('poll_id', pollId);

    if (error) {
      console.error('Error fetching results:', error);
      return;
    }

    const yesVotes = data.filter(v => v.vote === 'yes').length;
    const noVotes = data.filter(v => v.vote === 'no').length;
    const total = data.length;

    setVoteResults({ yes: yesVotes, no: noVotes, total });
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="flex flex-col items-center min-h-screen justify-center bg-black text-white p-4">
        <h1 className="text-3xl font-bold mb-6">Proof of Vote (PoV)</h1>

        {pollData.length === 0 ? (
          <p>Loading poll data...</p>
        ) : (
          pollData.map((poll) => (
            <div key={poll.id} className="mb-8 w-full max-w-md text-center">
              <h2 className="text-xl font-semibold mb-4">{poll.question}</h2>
              {votedPollId === poll.id ? (
                <div className="mt-4">
                  <p className="text-green-400 mb-2">✅ Thanks for voting!</p>
                  <div className="w-full bg-gray-700 rounded overflow-hidden h-6 mb-2">
                    <div
                      className="bg-green-500 h-full text-sm text-black text-center"
                      style={{ width: `${(voteResults.yes / voteResults.total) * 100 || 0}%` }}
                    >
                      Yes ({voteResults.yes})
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded overflow-hidden h-6">
                    <div
                      className="bg-red-500 h-full text-sm text-black text-center"
                      style={{ width: `${(voteResults.no / voteResults.total) * 100 || 0}%` }}
                    >
                      No ({voteResults.no})
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Total votes: {voteResults.total}</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleVote(poll.id, 'yes')}
                    className="px-4 py-2 bg-green-600 rounded mr-2 hover:bg-green-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleVote(poll.id, 'no')}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    No
                  </button>
                </>
              )}
            </div>
          ))
        )}

        {statusMessage && <p className="text-yellow-400 mt-4">{statusMessage}</p>}
      </div>
    </WagmiConfig>
  );
}
