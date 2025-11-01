import { MadeWithDyad } from "@/components/made-with-dyad";
import ActionCard from "@/components/ActionCard";
import { Plus, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <> {/* Use a fragment as the main card is now in Layout */}
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Welcome to Urban Eye</h2> {/* Changed to h2 as h1 is in Layout */}
      <p className="text-md md:text-lg text-gray-600 mb-8">Your platform for community reporting and engagement.</p>

      <div className="space-y-4">
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <ActionCard
            icon={Plus}
            title="New Complaint"
            description="Report an issue in your area."
            onClick={() => navigate("/new-complaint-category")}
            backgroundColorClass="bg-action-blue" // Specific background color
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ActionCard
            icon={Users}
            title="Community Feed"
            description="See reported issues and their status."
            onClick={() => console.log("Community Feed clicked")}
            backgroundColorClass="bg-action-green" // Specific background color
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <ActionCard
            icon={Trophy}
            title="View Leaderboard"
            description="Check out top community contributors."
            onClick={() => console.log("View Leaderboard clicked")}
            backgroundColorClass="bg-action-red" // Specific background color
          />
        </div>
      </div>
      <MadeWithDyad />
    </>
  );
};

export default Index;