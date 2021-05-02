import Search from "./models/Search";
import Recipe from "./models/recipe";
import List from "./models/list";
import Likes from "./models/likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
/** global state of app
 * search resul
 * current recipe obj
 * shopping lis obj
 * liked obj
 *
 */

const state = {};
// window.state = state;
/*
---------SEARCH----------  
*/
const controlSearch = async () => {
  //1-GET QUERY FROM VIEW
  const query = searchView.getInput();
  // const query = "pizza";

  //const query = document.querySelector("search__field").value;
  console.log(query);

  if (query) {
    //2-new search object and add to state
    state.search = new Search(query); //store it into our global state object
    // 3-  prepare ui for results
    searchView.claearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      //4- search for recipes
      await state.search.getResults();
      //5- render results on UI(and we want to display result only when we receive data from api)
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("something went wrong in search ");
      clearLoader(); //we want the loader to go away if there is an err
    }
  }
};
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); //stops reloading of page
  controlSearch();
});
//testing-------------------------------------------
// window.addEventListener("load", (e) => {
//   e.preventDefault(); //stops reloading of page
//   controlSearch();
// });
elements.searchResPager.addEventListener("click", (e) => {
  //using event degration!!
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});
/*
------RECIPE----------  
*/
// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r); for testing purposes
const controlRecipe = async () => {
  //get the hash location
  const id = window.location.hash.replace("#", "");
  //we can use replace since it(hash_id) is a string
  if (id) {
    //prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //highlight selected search item
    if (state.search) searchView.highlightSelected(id);
    //create new recipe object
    state.recipe = new Recipe(id);
    //-----------testing---------------------------------
    // window.r = state.recipe;

    //get recipe data and parse ingrediends
    try {
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      //calc. serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      //render recipe
      //console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); //state.likes.isLiked(id) will return T/F
    } catch (err) {
      console.log(err);
      alert("error processing recipe");
    }
  }
};
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load",controlRecipe)//if we reload the page then nothing happens since it
//only works when hash changes but what if the user save it as a bookmark for that we have load eventlistr on controlRecipe
//-------------------add two event_list in one---------------------
["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, controlRecipe);
});
// event delegation for increase decrese button since the page has not loaded yet we need to attach
// the event to the recipe elements--------->handleing recipe button clicks
/*
------LIST CONTROLER----------  
*/
const controlList = () => {
  //create a new liast if there is none
  if (!state.list) state.list = new List();
  //Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient); //since it returns an item
    listView.renderItem(item); //prints it to the user interface
  });
};
// Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10); //read the value of the element which was just clicked
    state.list.updateCount(id, val);
  }
});
/*
------LIke CONTROLER----------  
*/
//---------test------------

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  //user has not yet liked the current recipe
  if (!state.likes.isLiked(currentID)) {
    //Add like to the state
    const newlike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //toggle the like button
    likesView.toggleLikeBtn(true);
    //add to ui list
    likesView.renderLike(newlike);
    // console.log(state.likes);
  }
  //user has liked the current recipe
  else {
    //Remove like to the state
    state.likes.deleteLike(currentID);
    //toggle the like button
    likesView.toggleLikeBtn(false);
    //REmove like from ui list
    likesView.deleteLike(currentID);
    // console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};
//restore liked recipe on page load
window.addEventListener("load", () => {
  state.likes = new Likes();
  //Rstore likes
  state.likes.readStorage();

  //toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

//handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // * i.e any child element of btn decrease
    //decrease btn is clickd
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    //increase btn is clickd
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add,.recipe__btn--add *")) {
    //Add ingredient to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love,.recipe__love *")) {
    //LIKE CONTROLLER
    controlLike();
  }
  // console.log(state.recipe);
});
