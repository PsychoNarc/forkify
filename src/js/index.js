import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import {elements, renderLoader, clearLoader} from './view/base';

/**Global State of the app
 * -Search object
 * -Current recipe object
 * -Shopping List
 * -Like recipes
 */
const state={};
/**
 * SEARCH CONTROLLER
 */
const controlSearch=async ()=>{
    //1) Get query from view
    const query=searchView.getInput();

    if(query){
        //2) New search object and add to state
        state.search=new Search(query);

        //3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
            //4) Search for recipes
            await state.search.getResults();

            //5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch(err){
            alert(err);
            clearLoader();
        }
    }
}
elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});
elements.searchResPages.addEventListener('click', e=>{
    const btn=e.target.closest('.btn-inline');
    if(btn){
        const goToPage=parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe=async ()=>{
    //Get id from url
    const id=window.location.hash.replace('#', '');
    
    if(id){
        //Prepeare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //Highlight selected item
        if(state.search) searchView.highlightSelected(id);
        //Create new recipe object
        state.recipe= new Recipe(id);
        try{
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            //Calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        }
        catch(err){
            alert(err);
        }
    }
};
['hashchange', 'load'].forEach(event=>window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList=()=>{
    //create new list if there is none yet
    if(!state.list) state.list =new List();

    //add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el=>{
        const item=state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

//Handle delete and update list item events
elements.shopping.addEventListener('click', e=>{
    const id=e.target.closest('.shopping__item').dataset.itemid;
    //handle delete event from list
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);

        //delete from user interface
        listView.deleteItem(id);
    }
    //handle the count update
    else if(e.target.matches('.shopping__count-value')){
        const val=parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
 * LIKE CONTROLLER
 */
const controlLike=()=>{
    if(!state.likes) state.likes=new Likes();
    const currentID=state.recipe.id;
    //user has NOT yet liked the recipe
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike=state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //toggle the like button
        likesView.toggleLikeBtn(true);
        //Add like to UI list
        likesView.renderLike(newLike);
        console.log(state.likes);
    }
    //user has likes the recipe
    else{
        //remove like from state
        state.likes.deleteLike(currentID);

        //toggle the like button
        likesView.toggleLikeBtn(false);
        //remove like from UI list
        likesView.deleteLike(currentID);
        console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//handling recipe button clics
elements.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    //console.log(state.recipe);
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        //like controller
        controlLike();
    }
});

//restore likes recipes on page load
window.addEventListener('load', ()=>{
    state.likes=new Likes();
    
    //restore likes
    state.likes.readStorage();

    //toggle like button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render existing likes
    state.likes.likes.forEach(like=>likesView.renderLike(like));
});
