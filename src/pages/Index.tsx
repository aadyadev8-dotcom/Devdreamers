import { MadeWithDyad } from "@/components/made-with-dyad";
import ActionCard from "@/components/ActionCard";
import { Plus, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Index = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-app-background">
      <div className="bg-urban-card-background p-8 md:p-12 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Welcome to Urban Eye</h1>
        <p className="text-md md:text-lg text-gray-600 mb-8">Your platform for community reporting and engagement.</p>

        <div className="space-y-4">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ActionCard
              icon={Plus}
              title="New Complaint"
              description="Report an issue in your area."
              bgColor="bg-action-blue"
              onClick={() => navigate("/new-complaint-category")} // Navigate to the new page
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ActionCard
              icon={Users}
              title="Community Feed"
              description="See reported issues and their status."
              bgColor="bg-action-green"
              onClick={() => console.log("Community Feed clicked")}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <ActionCard
              icon={Trophy}
              title="View Leaderboard"
              description="Check out top community contributors."
              bgColor="bg-action-red"
              onClick={() => console.log("View Leaderboard clicked")}
            />
          </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;