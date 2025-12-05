// frontend/src/components/App.jsx (Atualizado)
import React from "react";
import banner from '../assets/Banner.png';
import { GameProvider } from "../contexts/GameContext.jsx";
import SearchBar from "./SearchBar.jsx";
import GameList from "./GameList.jsx";
import { Container, Typography, Box, keyframes, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

// Animação suave do banner (fade + zoom leve)
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Lógica de autenticação no cliente
const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  
  const loggedIn = isAuthenticated();

  return (
    <GameProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Banner animado */}
        <Box
          component="header"
          sx={{
            width: "100%",
            height: { xs: 150, md: 400 },
            backgroundImage: `url(${banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "0 0 12px 12px",
            animation: `${fadeIn} 1.2s ease-in-out`,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            position: 'relative',
          }}
        >
          {/* Botões de Ação no Banner/Header */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
            {loggedIn ? (
              <>
                <Button 
                  variant="contained" 
                  color="success" 
                  component={Link} 
                  to="/insert"
                  sx={{ py: 1 }}
                >
                  ➕ Inserir
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleLogout}
                  sx={{ py: 1 }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/login"
                sx={{ py: 1 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        {/* Conteúdo principal */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            mt: 4,
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            🎮 Buscador de Jogos
          </Typography>

          {/* A Busca e Listagem são visíveis para todos, mas a requisição de busca
              só funcionará se o token for enviado (ver SearchBar.jsx) */}
          <SearchBar />
          <GameList />
        </Container>

        {/* Rodapé */}
        <Box
          component="footer"
          sx={{
            width: "100%",
            background: "linear-gradient(90deg, #111 0%, #222 50%, #111 100%)",
            color: "#fff",
            textAlign: "center",
            py: 2,
            mt: "auto",
            borderTop: "2px solid #00bcd4",
            boxShadow: "0 -2px 10px rgba(0,188,212,0.2)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              textShadow: "0 0 8px rgba(0,188,212,0.8)",
              letterSpacing: 0.5,
            }}
          >
            Powered By Danilo Augusto Martins Frazon
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            UTFPR - Cornélio Procópio
          </Typography>
        </Box>
      </Box>
    </GameProvider>
  );
}

export default App;