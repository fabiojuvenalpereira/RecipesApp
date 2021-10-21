import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from '../../context/AppContext';
import CategoryButton from '../CategoryButton';
import Menu from '../../images/menu.svg';
import Close from '../../images/close.svg';

import './CategoriesFilterBar.css';

export default function CategoriesFilterBar({ categories }) {
  const { setCurrentFoodFilter,
    setCurrentDrinkFilter, page,
    setFoodIngredientSituation, setDrinkIngredientSituation } = useContext(AppContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [buttonAnim, setButtonAnim] = useState('');

  function menuChange() {
    if (buttonAnim === '') {
      setButtonAnim('opening');
    } else if (buttonAnim === 'opening') {
      setButtonAnim('closing');
    } else {
      setButtonAnim('opening');
    }
    setOpenMenu(!openMenu);
  }

  return (
    <div>
      <div className={ openMenu ? `button-menu ${buttonAnim}` : `button-menu ${buttonAnim}` }>
        <button
          type="button"
          onClick={ menuChange }
        >
          { openMenu
            ? (<img src={ Close } alt="Close" />)
            : (<img src={ Menu } alt="menu" />)}
        </button>
      </div>

      <div className={ openMenu ? 'filter-bar open' : 'filter-bar closed' }>
        {categories.map((category) => (<CategoryButton
          key={ category.strCategory }
          category={ category }
        />))}
        <button
          className="btn-selector"
          data-testid="All-category-filter"
          type="button"
          onClick={ () => {
            if (page === 'Comidas') {
              setCurrentFoodFilter('');
              setFoodIngredientSituation(false);
            }
            if (page === 'Bebidas') {
              setCurrentDrinkFilter('');
              setDrinkIngredientSituation(false);
            }
          } }
        >
          All
        </button>
      </div>
    </div>
  );
}

CategoriesFilterBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
};
