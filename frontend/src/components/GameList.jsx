import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext.jsx";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Alert,
  Skeleton,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function GameList() {
  const { state } = useContext(GameContext);
  const { games, loading, error } = state;

  // Quando estiver carregando, mostra skeletons bonitos
  if (loading) {
    return (
      <Grid container spacing={2}>
        {[...Array(8)].map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ height: "100%" }}>
              <Skeleton variant="rectangular" height={160} />
              <CardContent>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Mensagem de erro
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Caso não tenha resultados
  if (!games || games.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Nenhum jogo encontrado. Tente buscar outro nome 🎮
        </Typography>
      </Box>
    );
  }

  // Exibe a lista normalmente
  return (
    <Grid container spacing={2}>
      {games.map((game) => (
        <Grid item xs={12} sm={6} md={3} key={game.id}>
          <Card
            component={Link}
            to={`/game/${game.id}`}
            sx={{
              textDecoration: "none",
              color: "inherit",
              height: "100%",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              },
            }}
          >
            <CardMedia
              component="img"
              image={game.background_image}
              alt={game.name}
              height="160"
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {game.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ⭐ {game.rating || "N/A"} | 📅 {game.released || "?"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
