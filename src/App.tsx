import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import BusinessCard from "./components/BusinessCard";
import InterfaceOverlay from "./components/InterfaceOverlay";
import { useInterfaceManager } from "./hooks/useInterfaceManager";
import { UserProvider } from "./contexts/UserContext";
import LoginPage from "./pages/LoginPage";
import CreateCardPage from "./pages/CreateCardPage";
import "./App.css";

function HomePage() {
  const { isActive, isVisible, handleInteraction } = useInterfaceManager();

  return (
    <div
      className="app-container"
      onMouseMove={handleInteraction}
      onTouchMove={handleInteraction}
    >
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <BusinessCard />
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(Math.PI * 3) / 4}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
      <InterfaceOverlay isActive={isActive} isVisible={isVisible} />
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-card" element={<CreateCardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
