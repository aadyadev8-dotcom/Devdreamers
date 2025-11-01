import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Still imported, but not used for fetching in this version
import { showError } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  issues_resolved: number;
  unlocked_badges: string[];
  avatar_url?: string;
}

// Static list of fake contributors
const mockLeaderboardData: Profile[] = [
  { id: '1', first_name: 'Aisha', last_name: 'Patel', issues_resolved: 980, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: '2', first_name: 'Rohan', last_name: 'Sharma', issues_resolved: 940, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { id: '3', first_name: 'Priya', last_name: 'Mehta', issues_resolved: 900, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/women/20.jpg' },
  { id: '4', first_name: 'Aarav', last_name: 'Iyer', issues_resolved: 860, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/men/19.jpg' },
  { id: '5', first_name: 'Zara', last_name: 'Khan', issues_resolved: 830, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/women/14.jpg' },
  { id: '6', first_name: 'Vikram', last_name: 'Singh', issues_resolved: 790, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '7', first_name: 'Diya', last_name: 'Gupta', issues_resolved: 750, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/women/55.jpg' },
  { id: '8', first_name: 'Kabir', last_name: 'Reddy', issues_resolved: 710, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/men/71.jpg' },
  { id: '9', first_name: 'Sana', last_name: 'Malik', issues_resolved: 680, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/women/88.jpg' },
  { id: '10', first_name: 'Arjun', last_name: 'Kumar', issues_resolved: 650, unlocked_badges: [], avatar_url: 'https://randomuser.me/api/portraits/men/25.jpg' },
];

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In this version, we are using static mock data instead of fetching from Supabase.
    // If you want to switch back to Supabase, uncomment the fetchLeaderboard function
    // and call it here.
    setLoading(true);
    // Simulate a network delay
    const timer = setTimeout(() => {
      setLeaderboard(mockLeaderboardData);
      setLoading(false);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, []);

  const getCrownEmoji = (index: number) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  // This function is no longer strictly needed if all mock data has avatar_url,
  // but kept for consistency or if you decide to mix with dynamic data later.
  const getRandomAvatar = (id: string) => {
    const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    const gender = seed % 2 === 0 ? 'men' : 'women';
    const number = (seed % 99) + 1;
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