// DOM Objects
const mainScreen = document.querySelector('.main-screen')
const pokeName = document.querySelector('.poke-name');
const pokeID = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const PokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const searchText = document.getElementById('search_filter');




//constant and variables
const TYPES = [
    'normal', 'fighting', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel',
    'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
]

/* Search Bar */
searchText.addEventListener('keyup', (e) => {
    const search_filter = e.target.value.toLowerCase();

    const filteredPokemon = pokeListItem.filter((dataTypes) =>{
        return (
            dataTypes.type.toLowerCase().includes(search_filter)
        );
    });
    pokeListItems(filteredPokemon);
});


let prevUrl = 'null';
let nextUrl = 'null';

//Functions
const Capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for(const type of TYPES){
        mainScreen.classList.remove(type);
    };
};

/* Right side of the screen */
const fetchPokeList = url => {
fetch(url)
    .then(res => res.json())
    .then( data => {
        const { results, previous, next } = data;
        prevUrl = previous;
        nextUrl = next;

        for (let i = 0; i < pokeListItems.length ; i++){
            const pokeListItem = pokeListItems[i];
            const resultData = results[i];       
        if (resultData) {
          const { name, url } = resultData;
          const urlArray = url.split('/');
          const id = urlArray[urlArray.length - 2];
          pokeListItem.textContent = id + '. ' + Capitalize(name);
       } else {
          pokeListItem.textContent = '';
       };
   };
});
}


/* Left side of the screen */
const fetchPokemonData = id => {
fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then( data => {
        resetScreen();

     const dataTypes = data['types'];
     const dataFirstType = dataTypes[0];
     const dataSecondType = dataTypes[1];
     pokeTypeOne.textContent = Capitalize(dataFirstType['type']['name']);
     if(dataSecondType){
         pokeTypeTwo.classList.remove('hide');
         pokeTypeTwo.textContent = Capitalize(dataSecondType['type']['name']);
     }else{
         pokeTypeTwo.classList.add('hide');
         pokeTypeTwo.textContent = '';
     }
     mainScreen.classList.add(dataFirstType['type']['name']);


     pokeName.textContent = Capitalize(data['name']);
     pokeID.textContent = '#' + data['id'].toString().padStart(3, '0');
     PokeWeight.textContent = data['weight'];
     pokeHeight.textContent = data['height'];


     pokeFrontImage.src = data['sprites']['front_default'] || '';
     pokeBackImage.src = data['sprites']['back_default'] || '';
 });
};


const handleLeftButtonClick = () => {
    if(prevUrl){
        fetchPokeList(prevUrl)
    };
};

const handleRightButtonClick = () => {
    if(nextUrl){
        fetchPokeList(nextUrl);
    };
};

const handleListItemClick = (e) =>{
    if(!e.target) return;

    const listItem = e.target;
    if(!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokemonData(id);
};

//ADDING EVENT LISTENERS
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
for(const pokeListItem of pokeListItems){
    pokeListItem.addEventListener('click', handleListItemClick)
};

//INITIALIZE App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');