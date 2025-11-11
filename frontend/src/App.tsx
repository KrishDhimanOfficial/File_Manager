import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FileManagerLayout } from "@/components/FileManager/FileManagerLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Files from "./pages/Files";
import Folders from "./pages/Folders";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Trash from "./pages/Trash";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/files",
      element: (
        <ProtectedRoute>
          <FileManagerLayout>
            <Files />
          </FileManagerLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/folders",
      element: (
        <ProtectedRoute>
          <FileManagerLayout>
            <Folders />
          </FileManagerLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/analytics",
      element: (
        <ProtectedRoute>
          <FileManagerLayout>
            <Analytics />
          </FileManagerLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <FileManagerLayout>
            <Profile />
          </FileManagerLayout>
        </ProtectedRoute>
      )
    },
    {
      path: '/trash',
      element: (
        <ProtectedRoute>
          <FileManagerLayout>
            <Trash />
          </FileManagerLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/settings",
      element: (
        <ProtectedRoute>
          <FileManagerLayout>
            <Settings />
          </FileManagerLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ])
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          < RouterProvider router={routes} future={{ v7_startTransition: true }} />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App