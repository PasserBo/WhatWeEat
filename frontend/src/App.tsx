import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from '@/components/ui/button'
import './App.css'
import JoinRoom from "@/pages/JoinRoom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/join" element={<JoinRoom />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
