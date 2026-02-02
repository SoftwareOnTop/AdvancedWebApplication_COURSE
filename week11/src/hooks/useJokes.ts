import { useState } from 'react';
import type { Joke } from '../types/types';

export const useJokes = () => {
  const [savedJokes, setSavedJokes] = useState<Joke[]>([]);

 
  const saveJoke = (joke: Joke) => {
  
    if (!savedJokes.find((j) => j.id === joke.id)) {
      setSavedJokes([...savedJokes, joke]);
    }
  };


  const deleteJoke = (id: number) => {
    setSavedJokes(savedJokes.filter((joke) => joke.id !== id));
  };

  return { savedJokes, saveJoke, deleteJoke };
};
