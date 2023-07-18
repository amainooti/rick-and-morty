const apiUrl = "https://rickandmortyapi.com/api";
const characters = "character";

const cardContainer = document.querySelector(".c-card_container");
const searchInput = document.querySelector(".c-search");
const searchResultsContainer = document.querySelector(".c-search-scroll");
const searchIcon = document.querySelector(".ri-search-line");

let isSearchIconClicked = false;

 searchIcon.addEventListener("click", () => {
   if (isSearchIconClicked) {
     searchInput.style.display = "block";
     isSearchIconClicked = false
   }
   else {
     searchInput.style.display = "none";
    isSearchIconClicked = true
   }

} )
const getAPI = async (apiUrl) => {
  const response = await fetch(apiUrl + `/${characters}`);
  const data = await response.json();
  const allCharacters = data.results;
  allCharacters.forEach((character) => {
    const cardItem = createCardItem(character);
    cardContainer.innerHTML += cardItem;
  });
};

const searchItems = (name, image) => {
  return `
    <li class="c-search-item">
      <img src="${image}" alt="Character Image" class="c-search-item-image">
      <p class="c-search-name">${name}</p>
    </li>
  `;
};

const createCardItem = (characterDetails) => {
  const healthCondition = characterDetails.status === "Dead" ? "status-dot-bad" : "status-dot-good";
  const card = `
    <div class="c-card">
      <div class="c-image-container">
        <img src="${characterDetails.image}" alt="">
      </div>
      <div class="c-text-container">
        <h1>${characterDetails.name}</h1>
        <p><span class="${healthCondition}"></span> ${characterDetails.status} - ${characterDetails.species} </p>
        <p class="sub-heads"> last known location: </p>
        <p>${characterDetails.location.name}</p>
        <p class="sub-heads"> episodes seen: </p>
        <p>${characterDetails.episode.length}</p>
        <p class="sub-heads"> origin: </p>
        <p>${characterDetails.origin.name}</p>
      </div>
    </div>
  `;

  return card;
};

const searchCharacter = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm === "") {
    const allCards = document.querySelectorAll(".c-card");
    allCards.forEach((card) => {
      card.style.display = "flex";
    });
    searchResultsContainer.innerHTML = "";
    searchResultsContainer.style.display = "none";
  } else {
    const matchingItems = [];
    const allCards = document.querySelectorAll(".c-card");
    allCards.forEach((card) => {
      const characterName = card.querySelector("h1").textContent.toLowerCase();
      if (characterName.includes(searchTerm)) {
        card.style.display = "flex";
        matchingItems.push({
          name: characterName,
          image: card.querySelector("img").src
        });
      } else {
        card.style.display = "none";
      }
    });
    updateSearchResults(matchingItems);
  }
};

const updateSearchResults = (matchingItems) => {
  if (matchingItems.length > 0) {
    const searchItemsHTML = matchingItems
      .map(({ name, image }) => searchItems(name, image))
      .join("");
    searchResultsContainer.innerHTML = `
      <ul>
        ${searchItemsHTML}
      </ul>
    `;
    searchResultsContainer.style.display = "block";
  } else {
    const errorMessage = document.createElement("h1");
    const linkBack = document.createElement("a");
    errorMessage.textContent = "No matching names found. ";
    errorMessage.style.marginLeft = "50px";
    errorMessage.style.fontSize = "1rem";
    linkBack.textContent = "Go back";
    linkBack.style.fontSize = "0.9rem";
    linkBack.style.textDecoration = "none";
    linkBack.href = "/";
    errorMessage.appendChild(linkBack);
    errorMessage.classList.add("error-message");
    cardContainer.innerHTML = "";
    cardContainer.appendChild(errorMessage);
  }
};

searchInput.addEventListener("input", searchCharacter);
searchInput.addEventListener("blur", () => {
  if (searchInput.value.trim() === "") {
    const allCards = document.querySelectorAll(".c-card");
    allCards.forEach((card) => {
      card.style.display = "flex";
    });
  }
  searchResultsContainer.innerHTML = "";
  searchResultsContainer.style.display = "none";
});


searchInput.addEventListener("focus", () => {
  searchResultsContainer.style.display = "block";
});

searchInput.addEventListener("blur", () => {
  searchResultsContainer.style.display = "none";
});

getAPI(apiUrl);
