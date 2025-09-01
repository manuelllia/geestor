
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useHeaderAdjustments } from "./hooks/useHeaderAdjustments";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExitInterviewForm from "./pages/ExitInterviewForm";
import PracticeEvaluationForm from "./pages/PracticeEvaluationForm";

const queryClient = new QueryClient();

function AppContent() {
  useHeaderAdjustments();
  
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/exit-interview/:token" element={<ExitInterviewForm />} />
        <Route path="/practice-evaluation/:token" element={<PracticeEvaluationForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
