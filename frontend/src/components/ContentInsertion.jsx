// frontend/src/components/ContentInsertion.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Grid, 
    Alert, 
    CircularProgress 
} from '@mui/material';

const BACKEND_URL = "http://localhost:3000"; 

export default function ContentInsertion() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        released: new Date().toISOString().slice(0, 10), // Data atual no formato YYYY-MM-DD
        rating: 0,
        description: '',
        background_image: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: null, text: '' });

    // Função para tratar mudanças nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: null, text: '' });

        const token = localStorage.getItem('authToken');

        if (!token) {
            setMessage({ type: 'error', text: 'Sessão expirada. Faça login novamente.' });
            setLoading(false);
            navigate('/login');
            return;
        }

        try {
            // Requisição POST para o backend (Inserção de Conteúdo)
            const res = await fetch(`${BACKEND_URL}/api/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Envia o token para a rota protegida
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            
            if (res.ok) {
                setMessage({ type: 'success', text: `Jogo "${data.game.name}" inserido com sucesso! O cache foi invalidado.` });
                setFormData({ // Limpa o formulário
                    name: '',
                    released: new Date().toISOString().slice(0, 10),
                    rating: 0,
                    description: '',
                    background_image: '',
                });
            } else if (res.status === 401 || res.status === 403) {
                 setMessage({ type: 'error', text: 'Não autorizado. Por favor, faça login.' });
                 navigate('/login');
            }
            else {
                // Erro de Validação de Campos no Servidor (Funcionalidade 4)
                const errorText = data.message || (data.errors && data.errors[0].msg) || "Erro ao salvar o jogo.";
                setMessage({ type: 'error', text: `Erro: ${errorText}` });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Não foi possível conectar ao servidor backend.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                ➕ Inserir Novo Jogo (Customizado)
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                Insira conteúdo no banco de dados customizado. Isso acionará a invalidação do cache!
            </Typography>

            {message.type && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            label="Nome do Jogo"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Lançamento"
                            name="released"
                            type="date"
                            value={formData.released}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Avaliação (0 a 5)"
                            name="rating"
                            type="number"
                            inputProps={{ step: 0.1, min: 0, max: 5 }}
                            value={formData.rating}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            label="URL da Imagem de Fundo (Banner)"
                            name="background_image"
                            value={formData.background_image}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Descrição (Markdown/Texto Simples)"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="success" 
                            fullWidth 
                            disabled={loading}
                            sx={{ py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Salvar Jogo"}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" fullWidth onClick={() => navigate('/')}>
                            Voltar para a Busca
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}