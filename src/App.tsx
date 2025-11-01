import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewComplaintCategoryPage from "./pages/NewComplaintCategoryPage";
import AddComplaintMediaPage from "./pages/AddComplaintMediaPage";
import SplashPage from "./pages/SplashPage";
import NewComplaintLocationPage from "./pages/NewComplaintLocationPage";
import CommunityFeedPage from "./pages/CommunityFeedPage"; // Import the new page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/new-complaint-category" element={<NewComplaintCategoryPage />} />
          <Route path="/new-complaint-media" element={<AddComplaintMediaPage />} />
          <Route path="/new-complaint-location" element={<NewComplaintLocationPage />} />
          <Route path="/community-feed" element={<CommunityFeedPage />} /> {/* New route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;