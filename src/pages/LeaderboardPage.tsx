import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  issues_resolved: number;
  unlocked_badges: string[];
  avatar_url?: string; // Added avatar_url to the interface
}

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, issues_resolved, unlocked_badges, avatar_url') // Select avatar_url
        .order('issues_resolved', { ascending: false })
        .limit(10); // Limit to top 10 for the leaderboard

      if (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard.');
        showError('Failed to load leaderboard.');
      } else {
        setLeaderboard(data || []);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getCrownEmoji = (index: number) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  const getRandomAvatar = (id: string) => {
    // Use a consistent random avatar based on user ID for a stable look
    const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    const gender = seed % 2 === 0 ? 'men' : 'women';
    const number = (seed % 99) + 1; // 1 to 99
    return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <Card className="bg-urban-eye-pink p-8 rounded-lg shadow-lg max-w-md w-full text-gray-800">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-3xl font-bold mb-2">🏆 Community Leaderboard</CardTitle>
            <p className="text-gray-600">Top contributors making a difference!</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <p className="text-gray-600">Loading leaderboard...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : leaderboard.length === 0 ? (
              <p className="text-gray-600">No contributors yet. Be the first!</p>
            ) : (
              <section className="leaderboard grid gap-3 w-full" role="list">
                {leaderboard.map((profile, index) => (
                  <article
                    key={profile.id}
                    className="card bg-white rounded-xl shadow-md flex items-center justify-between p-3 transition-transform duration-100 ease-in-out hover:translate-y-[-2px] hover:shadow-lg focus-within:translate-y-[-2px] focus-within:shadow-lg"
                    tabIndex={0}
                    role="listitem"
                  >
                    <div className="left flex items-center gap-3">
                      <div className="rank font-semibold w-6 text-center">
                        {getCrownEmoji(index)} {index + 1}
                      </div>
                      <img
                        src={profile.avatar_url || getRandomAvatar(profile.id)}
                        alt={`${profile.first_name} ${profile.last_name} profile picture`}
                        className="avatar w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="info flex flex-col text-left">
                        <span className="name font-semibold text-base">
                          {profile.first_name} {profile.last_name}
                        </span>
                        {/* Removed role as it's not in the current schema */}
                      </div>
                    </div>
                    <div className="points font-medium text-blue-600 text-lg">
                      {profile.issues_resolved} pts
                    </div>
                  </article>
                ))}
              </section>
            )}
            <Link to="/new-complaint-category">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold mt-6">
                Back to Categories
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LeaderboardPage;