document.getElementById("error-message").style.display = "none";
document.getElementById("loader-display").style.display = "none";

// using api to find meals according to given search text
const searchFood = (searchText) => {
  document.getElementById("error-message").style.display = "none";
  if (searchText == "") {
    displayError();
  } else {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => displaySearchResult(data.meals));
  }
};

const displayError = () => {
  document.getElementById("error-message").style.display = "block";
};

const displayLoader = () => {
  document.getElementById("loader").style.display = "flex";
};

// event Handling and invoking
const eventHandler = () => {
  const searchField = document.getElementById("search-field");
  const searchText = searchField.value;
  searchField.value = ""; // Clear the search field
  searchFood(searchText); // Call searchFood function with the search text
};

//button event
const button = document.getElementById("button-addon2");
button.addEventListener("click", eventHandler);

//submit/enter event
const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  eventHandler();
});

// displaying found items according to search
const displaySearchResult = (meals) => {
  const searchResult = document.getElementById("search-result");
  searchResult.textContent = "";

  if (meals == null || meals.length == 0) {
    alert("No result found!, try western dishes");
    return;
  }

  // creating card for each and every separate dish
  meals.forEach((meal) => {
    const div = document.createElement("div");
    div.classList.add("col");
    div.innerHTML = `
            <div onclick="loadMealDetail(${meal.idMeal})" class="card h-100">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="Meal">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">${meal.strInstructions.slice(
                      0,
                      205
                    )}</p>
                </div>
            </div>
            `;
    searchResult.appendChild(div);
  });
};

// creating card for selected dish
const loadMealDetail = (mealId) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayMealDetail(data.meals[0]));
};

document.getElementById("meal-details").style.display = "none";
const displayMealDetail = (meal) => {
  console.log(meal);
  document.getElementById("meal-details").style.display = "block";
  const mealDetails = document.getElementById("meal-details");
  mealDetails.textContent = "";
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
    <div class="row g-0">
        <div class="col-md-4">
            <img src="${
              meal.strMealThumb
            }" class="img-fluid rounded-start" alt="Meal">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <p class="card-text">${meal.strInstructions.slice(0, 800)}</p>
                <a href="${
                  meal.strYoutube
                }" class="btn btn-primary">Watch the video</a>
                <ul id="ingredient-list">
                <!-- Ingredient list will be displayed here -->
            </ul>
            </div>
        </div>
    </div>
    `;
  mealDetails.appendChild(div);

  //loop to show add ingredients to list
  const ingredientList = document.getElementById("ingredient-list");
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      const listItem = document.createElement("li");
      listItem.textContent = `${ingredient} - ${measure}`;
      ingredientList.appendChild(listItem);
    }
  }
};
