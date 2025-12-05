// frontend/src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Card, 
    CardContent, 
    Alert, 
    CircularProgress 
} from "@mui/material";

const BACKEND_URL = "http://localhost:3000"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Validação simples no Frontend (complementa a validação do servidor)
    if (!username.trim() || !password.trim()) {
        setError("Por favor, preencha todos os campos.");
        setLoading(false);
        return;
    }

    try {
      // 2. Requisição para o Backend (Login)
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 3. Sucesso: Salva o token JWT e redireciona
        localStorage.setItem("authToken", data.token);
        navigate("/"); // Redireciona para a página principal
      } else {
        // 4. Falha: Exibe a mensagem do servidor
        setError(data.message || "Falha no login. Verifique suas credenciais.");
      }
    } catch (err) {
      setError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 3, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            🔒 Acesso Restrito
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            A busca e inserção de conteúdo requerem autenticação.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Usuário"
              variant="outlined"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}