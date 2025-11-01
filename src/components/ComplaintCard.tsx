import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { format } from 'date-fns';

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    status: string;
    created_at: string;
    description: string;
    image_url?: string;
    video_url?: string;
    upvotes: number;
  };
  onViewDetails: (complaintId: string) => void;
  onUpvote: (complaintId: string) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onViewDetails, onUpvote }) => {
  const reportedDate = format(new Date(complaint.created_at), 'dd/MM/yyyy');

  return (
    <Card className="bg-white text-gray-800 p-4 rounded-lg shadow-lg mb-4">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-bold mb-1">{complaint.title}</CardTitle>
        <p className="text-sm text-red-600 font-semibold">Status: {complaint.status}</p>
        <p className="text-sm text-gray-600">Reported on: {reportedDate}</p>
      </CardHeader>
      <CardContent className="p-0">
        {(complaint.image_url || complaint.video_url) && (
          <div className="mb-4 rounded-md overflow-hidden">
            {complaint.image_url && (
              <img src={complaint.image_url} alt={complaint.title} className="w-full h-auto object-cover" />
            )}
            {complaint.video_url && (
              <video src={complaint.video_url} controls className="w-full h-auto object-cover" />
            )}
          </div>
        )}
        <p className="text-gray-700 mb-4 text-left">{complaint.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onUpvote(complaint.id)} className="text-gray-600 hover:text-blue-600">
              <ArrowUp className="h-4 w-4 mr-1" /> {complaint.upvotes}
            </Button>
          </div>
          <Button onClick={() => onViewDetails(complaint.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;