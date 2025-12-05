// frontend/src/components/GameDetails.jsx (Atualizado)

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";

// URL base do SEU backend (O backend agora é responsável por buscar os dados)
const BACKEND_URL = "http://localhost:3000"; 

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError(null);
      setAuthError(null);
      
      const token = localStorage.getItem('authToken'); // Recupera o token do login

      if (!token) {
        setAuthError("Você precisa estar logado para ver os detalhes do jogo.");
        setLoading(false);
        return;
      }
      
      try {
        // Rota RESTful: GET /api/games/:id
        const res = await fetch(`${BACKEND_URL}/api/games/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Envia o token para autorização
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401 || res.status === 403) {
            setAuthError("Sessão expirada. Por favor, faça login novamente.");
            return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || "Erro ao carregar os detalhes do jogo.");
          return;
        }

        const data = await res.json();
        setGame(data);
        
      } catch (err) {
        console.error("Erro na requisição ao backend:", err);
        setError("Não foi possível conectar ao servidor backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  
  if (authError) return (
      <Alert severity="error" sx={{ my: 3 }}>
        {authError}
        <Button variant="contained" sx={{ ml: 2 }} component={Link} to="/login">
            Ir para Login
        </Button>
      </Alert>
  );

  if (error || !game) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error || "Jogo não encontrado."}</Alert>
      <Button variant="contained" component={Link} to="/">Voltar</Button>
    </Box>
  );

  // Note: O backend deve retornar um objeto similar ao da RAWG, ou o Frontend pode falhar
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>{game.name}</Typography>
      <img
        src={game.background_image}
        alt={game.name}
        style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
      />
      {/* Assumindo que seu backend ainda retorna 'description_raw' para jogos RAWG */}
      <Typography variant="body1" gutterBottom>{game.description_raw || game.description || "Descrição não disponível."}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        🏆 Avaliação: {game.rating} / 5
      </Typography>
      <Typography variant="body2" color="text.secondary">
        📅 Lançamento: {game.released}
      </Typography>

      <Button variant="contained" sx={{ mt: 3 }} component={Link} to="/">
        Voltar
      </Button>
    </Box>
  );
}