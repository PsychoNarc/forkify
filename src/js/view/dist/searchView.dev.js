"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderResults = exports.clearResults = exports.clearInput = exports.getInput = void 0;

var _base = require("./base");

var getInput = function getInput() {
  return _base.elements.searchInput.value;
};

exports.getInput = getInput;

var clearInput = function clearInput() {
  _base.elements.searchInput.value = '';
};

exports.clearInput = clearInput;

var clearResults = function clearResults() {
  _base.elements.searchResList.innerHTML = '';
  _base.elements.searchResPages.innerHTML = '';
};

exports.clearResults = clearResults;

var renderResults = function renderResults(recipes) {
  var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var resPerPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  //render results of current page
  var start = (page - 1) * resPerPage;
  var end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe); //render pagination buttons

  renderButtons(page, recipes.length, resPerPage);
};

exports.renderResults = renderResults;

var limitRecipeTitle = function limitRecipeTitle(title) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 17;
  var newTitle = [];

  if (title.length > limit) {
    title.split(' ').reduce(function (acc, cur) {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }

      return acc + cur.length;
    }, 0); //Return the result

    return "".concat(newTitle.join(' '), "...");
  }

  return title;
};

var renderRecipe = function renderRecipe(recipe) {
  var markup = "\n        <li>\n            <a class=\"results__link\" href=\"#".concat(recipe.recipe_id, "\">\n                <figure class=\"results__fig\">\n                    <img src=\"").concat(recipe.image_url, "\" alt=\"").concat(recipe.title, "\">\n                </figure>\n                <div class=\"results__data\">\n                    <h4 class=\"results__name\">").concat(limitRecipeTitle(recipe.title), "</h4>\n                    <p class=\"results__author\">").concat(recipe.publisher, "</p>\n                </div>\n            </a>\n        </li>\n    ");

  _base.elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

var createButton = function createButton(page, type) {
  return "\n    <button class=\"btn-inline results__btn--".concat(type, "\" data-goto=").concat(type === 'prev' ? page - 1 : page + 1, ">\n        <svg class=\"search__icon\">\n            <use href=\"img/icons.svg#icon-triangle-").concat(type === 'prev' ? 'left' : 'right', "\"></use>\n        </svg>\n        <span>Page ").concat(type === 'prev' ? page - 1 : page + 1, "</span>\n    </button>\n");
};

var renderButtons = function renderButtons(page, numResults, resPerPage) {
  var pages = Math.ceil(numResults / resPerPage);
  var button;

  if (page === 1 && pages > 1) {
    //only button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    //button to go to both pages
    button = "\n            ".concat(createButton(page, 'prev'), "\n            ").concat(createButton(page, 'next'), "\n        ");
  } else if (page === pages && pages > 1) {
    //button to go only prev page
    button = createButton(page, 'prev');
  }

  _base.elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};