import React from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card'; // Using shadcn Card component

const CommunityFeedPage = () => {
  // Hardcoded counts for now, will integrate with Supabase later
  const pendingCount = 3;
  const inProgressCount = 3;
  const resolvedCount = 2;

  return (
    <div className="min-h-screen flex flex-col bg-urban-eye-pink text-white"> {/* Changed background here */}
      <Header />
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="w-full max-w-md text-center mb-8">
          <div className="bg-urban-eye-pink p-6 rounded-lg shadow-lg mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Community Feed</h1>
            <p className="text-gray-600">See what's happening in your neighborhood.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
          <Card className="bg-red-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2">Pending</h2>
            <p className="text-5xl font-bold">{pendingCount}</p>
          </Card>
          <Card className="bg-blue-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2">In Progress</h2>
            <p className="text-5xl font-bold">{inProgressCount}</p>
          </Card>
          <Card className="bg-green-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2">Resolved</h2>
            <p className="text-5xl font-bold">{resolvedCount}</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CommunityFeedPage;