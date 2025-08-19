// src/App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ExitInterviewForm from "./pages/ExitInterviewForm";
import PracticeEvaluationForm from "./pages/PracticeEvaluationForm"; // Tu componente de formulario
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Si ExitInterviewForm SÍ necesita un token para identificar la entrevista a rellenar, mantenlo así. */}
            <Route path="/entrevista-salida/:token" element={<ExitInterviewForm />} />
            
            {/* CAMBIO CLAVE AQUÍ: La ruta para la valoración de prácticas ya NO necesita un token */}
            {/* Ahora será una URL fija para crear una nueva valoración */}
            <Route path="/crear-valoracion-practicas" element={<PracticeEvaluationForm />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;