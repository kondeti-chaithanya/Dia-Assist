import { Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard/components/Dashboard";
import Predict from "@/pages/predict/components/predictform";
import Diet from "@/pages/diet/components/Diet";
import History from "@/pages/history/components/History";
import Chatbot from "@/global/components/Chat bot/components/Chatbot";
import ProtectedRoute from "@/auth/ProtectedRoute";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/predict"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Predict />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/diet"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Diet />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <History />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <div style={{ minHeight: "100vh", padding: "20px" }}>
                <Chatbot isFullPage={true} />
              </div>
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
