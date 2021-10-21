import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import './Recomendation.css';

export default function Recommendation({ foodType, recommendation }) {
  const history = useHistory();

  function handleClick(item, type) {
    if (type === 'drink') {
      history.push(`/bebidas/${item}`);
    } else {
      history.push(`/comidas/${item}`);
    }
    window.location.reload();
  }

  const renderRecommendation = (item, index) => {
    console.log(item.idDrink);
    const dataTestId = `${index}-recomendation-card`;
    const dataTestId2 = `${index}-recomendation-title`;
    const { strMeal } = item;
    if (foodType === 'comida') {
      const { strDrink } = item;
      return (
        <div
          data-testid={ dataTestId }
          key={ item.idDrink }
          className="recommendation-box"
          onClick={ () => { handleClick(item.idDrink, 'drink'); } }
          aria-hidden="true"
        >
          <img
            alt="recomendação"
            src={ item.strDrinkThumb }
            className="recommendation-image"
          />
          <p data-testid={ dataTestId2 }>{ `${strDrink}` }</p>
        </div>
      );
    }
    return (
      <div
        data-testid={ dataTestId }
        key={ item.idMeal }
        className="recommendation-box"
        onClick={ () => { handleClick(item.idMeal, 'food'); } }
        aria-hidden="true"
      >
        <img
          alt="recomendação"
          src={ item.strMealThumb }
          className="recommendation-image"
        />
        <p data-testid={ dataTestId2 }>{ `${strMeal}` }</p>
      </div>
    );
  };
  return (
    <div className="recommendation-area">
      { recommendation.map(renderRecommendation) }
    </div>
  );
}

Recommendation.propTypes = {
  foodType: PropTypes.string.isRequired,
  recommendation: PropTypes.arrayOf(PropTypes.object).isRequired,
};
