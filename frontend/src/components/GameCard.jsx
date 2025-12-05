import { Card, CardContent, CardMedia, Typography } from "@mui/material";
export default function GameCard({game}) {
  return (
    <Card sx={{height:'100%'}}>
      <CardMedia component="img" height="140" image={game.background_image || "https://via.placeholder.com/400x200"} alt={game.name} />
      <CardContent>
        <Typography variant="h6">{game.name}</Typography>
        <Typography variant="body2" color="text.secondary">Rating: {game.rating} / {game.rating_top}</Typography>
        <Typography variant="body2" color="text.secondary">Lançamento: {game.released || "Desconhecido"}</Typography>
      </CardContent>
    </Card>
  )
}