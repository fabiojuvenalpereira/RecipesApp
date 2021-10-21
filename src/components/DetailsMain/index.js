import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './detailsMain.css';
import Recommendation from '../Recommendation';
import FavButton from '../FavButton';
import RenderCategory from './RenderCategory';
import shareIcon from '../../images/shareIcon.svg';
import Loading from '../Loading';

const copy = require('clipboard-copy');

const DetailsMain = ({ foodType, id, history }) => {
  console.log(foodType);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [recommendation, setRecommendation] = useState({});
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [foodObj, setFoodObj] = useState({});
  const [video, setVideo] = useState('');

  const setFoodState = (res) => {
    const food = res.meals[0];
    const currentFood = {
      id,
      type: foodType,
      area: food.strArea,
      category: food.strCategory,
      alcoholicOrNot: '',
      name: food.strMeal,
      image: food.strMealThumb,
    };
    setFoodObj(currentFood);
    const youtubeLink = food.strYoutube.replace('watch?v=', 'embed/');
    setVideo(youtubeLink);
    const maxIngredients = 20;
    for (let i = 1; i <= maxIngredients; i += 1) {
      const key = `strIngredient${i}`;
      const ingredient = [food[key]];
      const key2 = `strMeasure${i}`;
      const measure = [food[key2]];
      if (ingredient[0] !== '') {
        setIngredients((prevState) => [...prevState, ...ingredient]);
        setMeasures((prevState) => [...prevState, ...measure]);
      }
    }
    setInstructions(food.strInstructions);
  };

  const setDrinkState = (res) => {
    const drink = res.drinks[0];
    const currentDrink = {
      id,
      type: foodType,
      area: '',
      category: drink.strCategory,
      alcoholicOrNot: drink.strAlcoholic,
      name: drink.strDrink,
      image: drink.strDrinkThumb,
    };
    setFoodObj(currentDrink);
    const maxIngredients = 15;
    for (let i = 1; i <= maxIngredients; i += 1) {
      const key = `strIngredient${i}`;
      const ingredient = [drink[key]];
      const key2 = `strMeasure${i}`;
      const measure = [drink[key2]];
      if (ingredient[0] !== null) {
        setIngredients((prevState) => [...prevState, ...ingredient]);
        setMeasures((prevState) => [...prevState, ...measure]);
      }
    }
    setInstructions(drink.strInstructions);
  };

  const fetchDetails = async () => {
    if (foodType === 'comida') {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((r) => r.json());
      const res2 = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
        .then((r) => r.json());
      setFoodState(res);
      const recAmount = 6;
      setRecommendation(res2.drinks.slice(0, recAmount));
    } else {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((r) => r.json());
      const res2 = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
        .then((r) => r.json());
      setDrinkState(res);
      const recAmount = 6;
      setRecommendation(res2.meals.slice(0, recAmount));
    }
    setLoading(false);
  };

  const handleBeginClick = () => {
    const path = `${history.location.pathname}/in-progress`;
    history.push(path);
  };

  const handleShareClick = () => {
    const { pathname } = history.location;
    copy(`http://localhost:3000${pathname}`);
    setLinkCopied(true);
    const TIMER = 1000;
    setTimeout(() => {
      setLinkCopied(false);
    }, TIMER);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  function messageCopy(renderMessage) {
    return (
      renderMessage ? (
        <div className={ linkCopied ? 'show-message' : 'hidden-message' }>
          Link copiado!
        </div>
      ) : '');
  }

  const altText = `Foto do ${foodObj.name}`;
  return (
    <div className="main-recipe">
      <div className="recipe-title">
        <h1 data-testid="recipe-title">{ foodObj.name }</h1>
      </div>
      <div className="category-food">
        <RenderCategory
          foodType={ foodType }
          foodMessage={ foodObj.category }
          drinkMessage={ foodObj.alcoholicOrNot }
        />
      </div>
      <div className="recipe-image">
        <img
          src={ foodObj.image }
          alt={ altText }
          data-testid="recipe-photo"
        />
      </div>
      <div className="recipe-buttons">
        <FavButton id={ id } foodObj={ foodObj } />
        <button
          type="button"
          data-testid="share-btn"
          onClick={ handleShareClick }
        >
          <img
            src={ shareIcon }
            alt="share Icon"
          />
        </button>
      </div>
      <div className="recipe-igredient-list">
        <ul>
          { ingredients.map((ingredient, index) => {
            const testid = `${index}-ingredient-name-and-measure`;
            const ingredientText = `${ingredient} / ${measures[index]}`;
            return (
              <li
                key={ ingredient }
                data-testid={ testid }
              >
                { ingredientText }
              </li>
            );
          })}
        </ul>
      </div>
      <div className="recipe-instructions">
        <p data-testid="instructions">{ instructions }</p>
      </div>
      {foodType === 'comida'
        ? (
          <div className="video-content">
            <iframe
              title="Instruction Video"
              src={ video }
              data-testid="video"
            />
          </div>
        ) : ('') }
      <div className="recomendations">
        <Recommendation foodType={ foodType } recommendation={ recommendation } />
      </div>
      <button
        type="button"
        data-testid="start-recipe-btn"
        onClick={ handleBeginClick }
        className="begin-button"
      >
        Começar Receita
      </button>
      { messageCopy(linkCopied) }
    </div>
  );
};

DetailsMain.propTypes = {
  foodType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DetailsMain;
