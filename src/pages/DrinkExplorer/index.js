import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './DrinkExplorer.css';

export default function DrinkExplorer() {
  const [randomCockTail, setRandomCocktail] = useState(0);

  useEffect(() => {
    const fetchRandomCocktail = async () => {
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then((result) => result.json());
      return setRandomCocktail(response.drinks[0].idDrink);
    };
    fetchRandomCocktail();
  }, []);

  const randomCocktailID = randomCockTail;

  return (
    <div className="main-drink-explorer">
      <Header searchRender={ false } titlePage="Explorar Bebidas" />
      <div className="buttons-drink-explorer">
        <Link to="/explorar/bebidas/ingredientes">
          <button
            type="button"
            data-testid="explore-by-ingredient"
          >
            Por Ingredientes
          </button>
        </Link>
        <Link to={ `/bebidas/${randomCocktailID}` }>
          <button type="button" data-testid="explore-surprise">Me Surpreenda!</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
