import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FrontPage from './components/FrontPage';
import SavedPage from './components/SavedPage';
import { useJokes } from './hooks/useJokes';
import { Container } from '@mui/material';

function App() {

  const { savedJokes, saveJoke, deleteJoke } = useJokes();

  return (
    <>
      <Header />
      <Container>
        <Routes>
          <Route 
            path="/" 
            element={<FrontPage saveJoke={saveJoke} />} 
          />
          <Route 
            path="/saved" 
            element={<SavedPage savedJokes={savedJokes} deleteJoke={deleteJoke} />} 
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
