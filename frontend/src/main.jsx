// frontend/src/main.jsx (Atualizado com Roteamento)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App.jsx"; // Layout principal com SearchBar e GameList
import Login from "./components/Login.jsx"; // Novo componente de Login
import ContentInsertion from "./components/ContentInsertion.jsx"; // Novo componente de Inserção
import GameDetails from "./components/GameDetails.jsx"; // Componente existente para detalhes

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota principal (Busca e Listagem) */}
        <Route path="/" element={<App />} />
        
        {/* Novas Rotas Funcionais */}
        <Route path="/login" element={<Login />} />
        <Route path="/insert" element={<ContentInsertion />} />
        
        {/* Rota de Detalhes (já existente) */}
        <Route path="/game/:id" element={<GameDetails />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);