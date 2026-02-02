import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import type { Joke } from '../types/types';

interface FrontPageProps {
  saveJoke?: (joke: Joke) => void; 
}

export default function FrontPage({ saveJoke }: FrontPageProps) {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJoke = () => {
    setLoading(true);

    const controller = new AbortController();
    const signal = controller.signal;

    fetch('https://official-joke-api.appspot.com/random_joke', { signal })
      .then((response) => response.json())
      .then((data) => {
        setJoke(data);


        setLoading(false);

      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching joke:', error);


          setLoading(false);
        }
      });

    return () => controller.abort();
  };

  useEffect(() => {
    const cleanup = fetchJoke();




    return cleanup;
  }, []);




  if (loading) return <Typography>Loading a joke...</Typography>;




  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {joke && (
        <Card sx={{ minWidth: 275, maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {joke.setup}
            </Typography>


            <Typography sx={{ mb: 1.5, mt: 2 }} color="text.secondary">
              {joke.punchline}

            </Typography>
          </CardContent>
        </Card>
      )}
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={fetchJoke}>
          New Joke
        </Button>
        

        
        {}
        {saveJoke && joke && (
          <Button variant="outlined" onClick={() => saveJoke(joke)}>
            Save Joke
          </Button>
        )}
      </Box>
    </Box>
  );
}