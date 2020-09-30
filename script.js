const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.search');
const usersContainer = document.querySelector('.users-container');
const usersStatistics = document.querySelector('.users-statistics');
const loader = document.getElementById("loader");

// Na carga inicial da aplicação, obter os dados da API
let users = [];
let filteredUsers = [];

async function getData() {
    // const PROXY = 'https://cors-anywhere.herokuapp.com/';
    const API_URL = 'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';
    let data = [];

    data = await fetch(API_URL);
    dataJSON = await data.json();

    // Carregar os dados dos usuários em um array
    users = [...dataJSON.results]
    .map(user => {
        return {
            name: `${user.name.first} ${user.name.last}`,
            age: user.dob.age,
            gender: user.gender,
            pictureURL: user.picture.large
        }
    })
    .sort((a, b) => (a.name.localeCompare(b.name)));

    loader.hidden = true;
}

// Permitir a filtragem de usuários através de um input com interação do usuário
// O usuário poderá filtrar dados quando digitar pelo menos um caractere no input
function handleKeyUp() {
    let query = searchInput.value.toLowerCase();
    console.log(query);
    filteredUsers = users.filter(user => user.name.toLowerCase().includes(query));
}