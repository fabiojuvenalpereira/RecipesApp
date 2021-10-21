import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FavButton from '../FavButton';
import RenderCategory from './RenderCategory';
import shareIcon from '../../images/shareIcon.svg';

import './inProgressRecipes.css';
import {
  emptyNullKiller,
  getDataFromLocalStorage,
  mealOrCocktail,
  setDataToLocalStorage,
} from '../../services';

const copy = require('clipboard-copy');

const InprogressRecipes = ({ foodType, id, history }) => {
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [foodObj, setFoodObj] = useState({});
  const [ingredientsCheck, setIngredientsCheck] = useState([]);
  const [doneRecipes, setDoneRecipes] = useState();
  const setObjectState = (apiData, typeObj) => {
    const drinkOrFood = {
      comida: apiData.meals,
      bebida: apiData.drinks,
    };
    const obj = drinkOrFood[typeObj][0];
    const currentObj = {
      id,
      type: typeObj,
      area: obj.strArea || '',
      category: obj.strCategory,
      alcoholicOrNot: obj.strAlcoholic || '',
      name: typeObj === 'comida' ? obj.strMeal : obj.strDrink,
      image: typeObj === 'comida' ? obj.strMealThumb : obj.strDrinkThumb,
    };
    setFoodObj(currentObj);
    const ingredient = emptyNullKiller('strIngredient', obj);
    const measure = emptyNullKiller('strMeasure', obj);
    setIngredients((prevState) => [...prevState, ...ingredient]);
    setMeasures((prevState) => [...prevState, ...measure]);
    setInstructions(obj.strInstructions);
  };

  const fetchDetails = async () => {
    if (foodType === 'comida') {
      setLoading(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      ).then((r) => r.json());
      setObjectState(res, 'comida');
    } else {
      setLoading(true);
      const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`,
      ).then((r) => r.json());
      setObjectState(res, 'bebida');
    }
    setLoading(false);
  };

  const handleCheckClick = ({ target }) => {
    const isChecked = target.checked;
    if (isChecked) {
      setIngredientsCheck([...ingredientsCheck, target.id]);
    } else {
      setIngredientsCheck(
        ingredientsCheck.filter((ingredient) => ingredient !== target.id),
      );
    }
  };

  const handleDoneClick = () => {
    const data = new Date();
    const dia = data.getDate();
    const mes = data.getMonth();
    const ano = data.getYear();
    const full = `${dia}/${mes}/${ano}`;
    const newArr = { ...foodObj, doneDate: full };
    const recipesDone = [...doneRecipes, newArr];
    localStorage.setItem('doneRecipes', JSON.stringify(recipesDone));
    history.push('/receitas-feitas');
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
    const inProgressRecipes = getDataFromLocalStorage();
    const dataFromLocalStorage = inProgressRecipes[mealOrCocktail(foodType)][id] || [];
    setIngredientsCheck(dataFromLocalStorage);

    const doneRecipesStorage = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    setDoneRecipes(doneRecipesStorage);
  }, []);

  useEffect(() => {
    const inProgressRecipes = getDataFromLocalStorage();
    inProgressRecipes[mealOrCocktail(foodType)][id] = ingredientsCheck;
    setDataToLocalStorage(inProgressRecipes);
  }, [foodType, id, ingredientsCheck]);

  if (loading) {
    return <div>loading...</div>;
  }

  const altText = `Foto do ${foodObj.name}`;

  function messageCopy(renderMessage) {
    return (
      renderMessage ? (
        <div className={ linkCopied ? 'show-message' : 'hidden-message' }>
          Link copiado!
        </div>
      ) : '');
  }

  return (
    <div className="main-progress">
      <div className="recipe-title-in-progress">
        <h1 data-testid="recipe-title">{foodObj.name}</h1>
      </div>
      <div className="recipe-category">
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
          className="img"
        />
      </div>
      <div className="buttons">
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
      <div className="ingredients">
        {ingredients.map((ingredient, index) => {
          const testid = `${index}-ingredient-step`;
          const ingredientText = `${ingredient} - ${measures[index]}`;
          const isChecked = ingredientsCheck.includes(`${index}`);
          return (
            <div key={ index } data-testid={ testid } className="check">
              <label
                htmlFor={ index }
                id={ index }
                className={ isChecked ? 'checked' : '' }
              >
                <input
                  type="checkbox"
                  id={ index }
                  name={ `ingredient${index}` }
                  onChange={ handleCheckClick }
                  checked={ isChecked }
                />
                <span className={ isChecked ? 'checked' : '' } />
                <div>{ingredientText}</div>
              </label>
            </div>
          );
        })}
      </div>
      <div className="instructions-area">
        <h3>Instructions</h3>
        <p data-testid="instructions">{instructions}</p>
      </div>
      <div className="finish-recipe-btn">
        <button
          type="button"
          data-testid="finish-recipe-btn"
          onClick={ handleDoneClick }
          className="begin-button"
          disabled={ ingredients.length !== ingredientsCheck.length }
        >
          Finalizar Receita
        </button>
      </div>
      { messageCopy(linkCopied) }
    </div>
  );
};

InprogressRecipes.propTypes = {
  foodType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default InprogressRecipes;
