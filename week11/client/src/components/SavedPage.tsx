import { Card, CardContent, Typography, Button, Box, Grid } from '@mui/material';
import type { Joke } from '../types/types';



interface SavedPageProps {
  savedJokes: Joke[];

  
  deleteJoke: (id: number) => void;
}





export default function SavedPage({ savedJokes, deleteJoke }: SavedPageProps) {
  if (savedJokes.length === 0) {
    return <Typography>No saved jokes yet.</Typography>;
  }




  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {savedJokes.map((joke) => (
          <Grid size={{ xs: 12, md: 6 }} key={joke.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{joke.setup}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  {joke.punchline}
                </Typography>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={() => deleteJoke(joke.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}