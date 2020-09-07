"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _Search = _interopRequireDefault(require("./models/Search"));

var _Recipe = _interopRequireDefault(require("./models/Recipe"));

var searchView = _interopRequireWildcard(require("./view/searchView"));

var _base = require("./view/base");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**Global State of the app
 * -Search object
 * -Current recipe object
 * -Shopping List
 * -Like recipes
 */
var state = {};
/**
 * SEARCH CONTROLLER
 */

var controlSearch = function controlSearch() {
  var query;
  return regeneratorRuntime.async(function controlSearch$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //1) Get query from view
          query = searchView.getInput();

          if (!query) {
            _context.next = 17;
            break;
          }

          //2) New search object and add to state
          state.search = new _Search["default"](query); //3) Prepare UI for results

          searchView.clearInput();
          searchView.clearResults();
          (0, _base.renderLoader)(_base.elements.searchRes);
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(state.search.getResults());

        case 9:
          //5) Render results on UI
          (0, _base.clearLoader)();
          searchView.renderResults(state.search.result);
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](6);
          alert('Something went wrong.', _context.t0);
          (0, _base.clearLoader)();

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 13]]);
};

_base.elements.searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  controlSearch();
});

_base.elements.searchResPages.addEventListener('click', function (e) {
  var btn = e.target.closest('.btn-inline');

  if (btn) {
    var goToPage = parseInt(btn.dataset["goto"], 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});
/**
 * RECIPE CONTROLLER
 */


var controlRecipe = function controlRecipe() {
  var id;
  return regeneratorRuntime.async(function controlRecipe$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          //Get id from url
          id = window.location.hash.replace('#', '');
          console.log(id);

          if (!id) {
            _context2.next = 15;
            break;
          }

          //Prepeare UI for changes
          //Create new recipe object
          state.recipe = new _Recipe["default"](id);
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(state.recipe.getRecipe());

        case 7:
          //Calc servings and time
          state.recipe.calcTime();
          state.recipe.calcServings(); //Render the recipe

          console.log(state.recipe);
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](4);
          alert('Error Processing Recipe.', _context2.t0);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 12]]);
};

['hashchange', 'load'].forEach(function (event) {
  return window.addEventListener(event, controlRecipe);
});