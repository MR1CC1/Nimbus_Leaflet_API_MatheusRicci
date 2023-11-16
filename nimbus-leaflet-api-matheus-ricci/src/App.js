import './App.css';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import React from 'react'
import Gerenciamento from './components/Pages/Gerenciamento/Gerenciamento';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Visualizacao from './components/Pages/Visualizacao/Visualizacao';

function App() {

  return(
    <Router>
    <Routes>
      <Route path="/" element={<Gerenciamento />} />
      <Route path="/visualizacao" element={<Visualizacao />} />
    </Routes>
  </Router>
  )
}

export default App;



