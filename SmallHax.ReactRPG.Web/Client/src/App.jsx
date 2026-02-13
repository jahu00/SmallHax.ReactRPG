import React from "react";
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router";
import { Home } from './pages/home';
import { AdventurePage } from "./pages/adventure-page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/adventure" element={<AdventurePage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
