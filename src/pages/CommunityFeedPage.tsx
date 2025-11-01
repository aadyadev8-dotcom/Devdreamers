import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

const CommunityFeedPage = () => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [inProgressCount, setInProgressCount] = useState<number>(0);
  const [resolvedCount, setResolvedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComplaintCounts = async () => {
      setLoading(true);
      try {
        // Fetch Pending count
        const { count: pending, error: pendingError } = await supabase
          .from('complaints')
          .select('*', { count: 'exact' })
          .eq('status', 'Pending');
        if (pendingError) throw pendingError;
        setPendingCount(pending || 0);

        // Fetch In Progress count
        const { count: inProgress, error: inProgressError } = await supabase
          .from('complaints')
          .select('*', { count: 'exact' })
          .eq('status', 'In Progress');
        if (inProgressError) throw inProgressError;
        setInProgressCount(inProgress || 0);

        // Fetch Resolved count
        const { count: resolved, error: resolvedError } = await supabase
          .from('complaints')
          .select('*', { count: 'exact' })
          .eq('status', 'Resolved');
        if (resolvedError) throw resolvedError;
        setResolvedCount(resolved || 0);

      } catch (error: any) {
        console.error('Error fetching complaint counts:', error.message);
        showError('Failed to load complaint counts.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintCounts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-urban-eye-pink text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-gray-800">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Community Feed</h1>
          <p className="text-gray-600 mb-8">See what's happening in your neighborhood.</p>

          {loading ? (
            <p className="text-gray-600">Loading counts...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 w-full">
              <Link to="/pending-complaints" className="block h-full">
                <Card className="bg-red-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-red-700 transition-colors h-full">
                  <h2 className="text-xl font-semibold mb-2">Pending</h2>
                  <p className="text-5xl font-bold">{pendingCount}</p>
                </Card>
              </Link>
              <Card className="bg-blue-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold mb-2">In Progress</h2>
                <p className="text-5xl font-bold">{inProgressCount}</p>
              </Card>
              <Card className="bg-green-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold mb-2">Resolved</h2>
                <p className="text-5xl font-bold">{resolvedCount}</p>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityFeedPage;