"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Recipe =
/*#__PURE__*/
function () {
  function Recipe(id) {
    _classCallCheck(this, Recipe);

    this.id = id;
  }

  _createClass(Recipe, [{
    key: "getRecipe",
    value: function getRecipe() {
      var res;
      return regeneratorRuntime.async(function getRecipe$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap((0, _axios["default"])("https://forkify-api.herokuapp.com/api/get?rId=".concat(this.id)));

            case 3:
              res = _context.sent;
              //console.log(res);
              this.title = res.data.recipe.title;
              this.author = res.data.recipe.publisher;
              this.img = res.data.recipe.image_url;
              this.url = res.data.recipe.source_url;
              this.ingredients = res.data.recipe.ingredients; //console.log(this.title);

              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              alert(_context.t0);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 11]]);
    }
  }, {
    key: "calcTime",
    value: function calcTime() {
      //Assume we need 15mins for 3 ingredients
      var numIng = this.ingredients.length;
      var periods = Math.ceil(numIng / 3);
      this.time = periods * 15;
    }
  }, {
    key: "calcServings",
    value: function calcServings() {}
  }, {
    key: "parseIngredients",
    value: function parseIngredients() {
      var unitLong = ['tablespoon', 'tablespoons', 'ounce', 'ounces', 'cup', 'cups', 'teaspoon', 'teaspoons', 'pounds'];
      var unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'cup', 'cups', 'tsp', 'tsp', 'pound'];
      var newIngredients = this.ingredients.map(function (el) {
        //1) Uniform units
        var ingredient = el.toLowerCase();
        unitsLong.forEach(function (unit, i) {
          ingredient = ingredient.replace(unit, unitShort[i]);
        }); //2)Remove parenthesis

        ingredient = ingredient.replace(/ *\([^)]*\) */g, ''); //3)Parse ingredient into count, unit and ingredient
      });
      this.ingredients = newIngredients;
    }
  }]);

  return Recipe;
}();

exports["default"] = Recipe;