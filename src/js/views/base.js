export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResList: document.querySelector(".results__list"),
  searchRes: document.querySelector(".results"),
  shopping: document.querySelector(".shopping__list"),
  searchResPager: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list")
};
export const elementStrings = {
  loader: "loader"
};
export const renderLoader = (parent) => {
  const loader = `
<div class="${elementStrings.loader}">
    <svg>
    <use href="img/icons.svg#icon-cw"></use> 
    </svg>
</div>
   `;
  parent.insertAdjacentHTML("afterbegin", loader);
};
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
}; /* we cannot select it from elements because by the time we the code runs  loader is not their on page the yet*/
