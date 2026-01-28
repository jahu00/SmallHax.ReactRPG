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
import { Adventure } from "./pages/adventure";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/adventure" element={<Adventure/>}/>
      </Routes>
    </Router>
  );
}

export default App;
