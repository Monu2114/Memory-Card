import { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [cardsClicked, setCardsClicked] = useState([]);

  const handleClick = (card) => {
    if (cardsClicked.includes(card)) {
      setScore(0);
      setCardsClicked([]);
    } else {
      console.log(score);
      setScore((score) => score + 1); // Use functional update to ensure correct score update
      setCardsClicked([...cardsClicked, card]);
    }
    console.log(score);

    // Use functional update to ensure highScore reflects the latest score
    setHighScore((highScore) => Math.max(highScore, score));
  };

  useEffect(() => {
    const randomOffset = Math.floor(Math.random() * (1302 - 8)); // Generate a random offset

    async function fetchData() {
      try {
        // Fetch initial list of Pokémon with a limit of 8
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?offset=${randomOffset}&limit=8`
        );
        const data = await response.json();

        // Map over results to fetch detailed data for each Pokémon
        const promises = data.results.map(async (poke) => {
          const pokeData = await fetch(poke.url).then((res) => res.json());
          return {
            name: poke.name,
            sprites: pokeData.sprites.other["official-artwork"].front_default,
            // Extract high-resolution sprites
          };
        });

        // Wait for all promises to resolve
        const pokemonDetails = await Promise.all(promises);

        // Update state with fetched Pokémon details
        setPokemon(pokemonDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [cardsClicked]);

  return (
    <>
      <div className="header">
        <h1>Memory Game</h1>
        <p>Don't Click a card more than once !!</p>
        <div className="score">
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
        </div>
      </div>
      <div className="container">
        {pokemon.map((poke, index) => (
          <Card
            key={index}
            image={poke.sprites}
            name={poke.name}
            onClick={handleClick}
          />
        ))}
      </div>
    </>
  );
}

export default App;
