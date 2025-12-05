import React, { useContext, useState } from "react";
import { GameContext } from "../contexts/GameContext.jsx";
import { TextField, Button, MenuItem, Grid, Alert } from "@mui/material";

// URL base do SEU backend (onde o servidor Express está rodando - HTTP)
const BACKEND_URL = "http://localhost:3000";

// As listas de plataformas e gêneros (ajuste conforme seu projeto)
const platforms = [
    { label: "Todos", value: "" },
    { label: "PC", value: "4" },
    { label: "PlayStation", value: "18" },
    { label: "Xbox", value: "1" },
    { label: "Nintendo", value: "7" }
];

const genres = [
    { label: "Todos", value: "" },
    { label: "Ação", value: "action" },
    { label: "Aventura", value: "adventure" },
    { label: "RPG", value: "role-playing-games-rpg" },
    { label: "Estratégia", value: "strategy" }
];

export default function SearchBar() {
    const { state, dispatch } = useContext(GameContext);
    // Estados locais para controle de erros de formulário e autenticação
    const [validationError, setValidationError] = useState("");
    const [authError, setAuthError] = useState("");

    const handleChange = (field, value) => {
        dispatch({ type: "SET_FILTERS", payload: { [field]: value } });
        if (validationError) setValidationError("");
        if (authError) setAuthError("");
    };

    // 🚀 FUNÇÃO DE BUSCA COMPLETA (resolve o erro de parâmetro 'q' e a autenticação)
    const handleSearch = async () => {
        // 1. Validação de campos no cliente
        if (!state.filters.query.trim()) {
            setValidationError("Por favor, digite o nome de um jogo para buscar.");
            return;
        }

        // 2. Verifica autenticação
        const token = localStorage.getItem('authToken');

        if (!token) {
            setAuthError("Você precisa estar logado para realizar buscas.");
            return;
        }

        dispatch({ type: "FETCH_START" });
        setValidationError("");
        setAuthError("");

        const { query, platform, genre, year } = state.filters;

        // Constrói os parâmetros de busca, garantindo que 'q' seja passado.
        const searchParams = new URLSearchParams({
            q: query, // A chave 'q' é obrigatória!
            platform,
            genre,
            year
        }).toString();

        let url = `${BACKEND_URL}/api/games/search?${searchParams}`;

        try {
            // 3. Requisição para o Backend com o Token JWT
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 401 || res.status === 403) {
                setAuthError("Sessão expirada. Por favor, faça login novamente.");
                dispatch({ type: "FETCH_ERROR", payload: null });
                return;
            }

            const data = await res.json();

            if (res.ok) {
                // CORRIGIDO: Usa data.results (o nome correto do campo vindo do Backend)
                const gamesList = data.results || [];

                if (gamesList.length === 0) {
                    dispatch({ type: "FETCH_ERROR", payload: "Nenhum jogo encontrado." });
                } else {
                    dispatch({ type: "FETCH_SUCCESS", payload: gamesList });
                }
            } else {
                // Trata erros de validação do servidor
                const errorMessage = data.message || "Erro desconhecido ao buscar jogos no servidor.";
                dispatch({ type: "FETCH_ERROR", payload: errorMessage });
            }

        } catch (err) {
            dispatch({ type: "FETCH_ERROR", payload: "Não foi possível conectar ao servidor backend." });
        }
    };
    // ------------------------------------

    return (
        <>
            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Buscar jogo"
                        fullWidth
                        value={state.filters.query}
                        onChange={(e) => handleChange("query", e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        select
                        label="Plataforma"
                        fullWidth
                        value={state.filters.platform}
                        onChange={(e) => handleChange("platform", e.target.value)}
                    >
                        {platforms.map((p) => (
                            <MenuItem key={p.value} value={p.value}>
                                {p.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        select
                        label="Gênero"
                        fullWidth
                        value={state.filters.genre}
                        onChange={(e) => handleChange("genre", e.target.value)}
                    >
                        {genres.map((g) => (
                            <MenuItem key={g.value} value={g.value}>
                                {g.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        label="Ano"
                        type="number"
                        fullWidth
                        value={state.filters.year}
                        onChange={(e) => handleChange("year", e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" onClick={handleSearch} fullWidth>
                        Buscar
                    </Button>
                </Grid>
            </Grid>

            {validationError && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {validationError}
                </Alert>
            )}
            {authError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {authError}
                </Alert>
            )}
        </>
    );
}