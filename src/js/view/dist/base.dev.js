"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearLoader = exports.renderLoader = exports.elementStrings = exports.elements = void 0;
var elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResList: document.querySelector('.results__list'),
  searchRes: document.querySelector('.results'),
  searchResPages: document.querySelector('.results__pages')
};
exports.elements = elements;
var elementStrings = {
  loader: 'loader'
};
exports.elementStrings = elementStrings;

var renderLoader = function renderLoader(parent) {
  var loader = "\n        <div class=\"".concat(elementStrings.loader, "\">\n            <svg>\n                <use href=\"img/icons.svg#icon-cw\"></use>\n            </svg>\n        </div>\n    ");
  parent.insertAdjacentHTML('afterbegin', loader);
};

exports.renderLoader = renderLoader;

var clearLoader = function clearLoader() {
  var loader = document.querySelector(".".concat(elementStrings.loader));
  if (loader) loader.parentElement.removeChild(loader);
};

exports.clearLoader = clearLoader;