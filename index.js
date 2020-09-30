const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.search');
const usersContainer = document.querySelector('.users-container');
const usersStatistics = document.querySelector('.users-statistics');
const loader = document.getElementById("loader");

// Na carga inicial da aplicação, obter os dados da API
let users = [];
let filteredUsers = [];

async function getData() {
    const PROXY = 'https://cors-anywhere.herokuapp.com/';
    const API_URL = 'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';
    let data = [];

    data = await fetch(PROXY + API_URL);
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

// No painel da esquerda, listar os usuários filtrados
function renderUserList() {
    usersContainer.innerHTML = '';

    filteredUsers.forEach(user => {
        let html = `
            <div class="user-card">
                <img src="${user.pictureURL}" alt="">
                <h3>${user.name}</h3>
                <p>${user.age} anos</p>
            </div>
        `;

        usersContainer.insertAdjacentHTML('beforeend', html);
    });
}

// No painel da direita, calcular e mostrar algumas estatísticas sobre esses usuários
function renderStatistics() {
    let maleCount = filteredUsers.reduce((tally, user) => {
        return tally + (user.gender === 'male');
    }, 0);

    let femaleCount = filteredUsers.reduce((tally, user) => {
        return tally + (user.gender === 'female');
    }, 0);

    let ageSum = filteredUsers.reduce((tally, user) => {
        return tally + (user.age);
    }, 0);

    let ageMedian = Number((ageSum / (maleCount + femaleCount)).toFixed(2));

    usersStatistics.innerHTML = `
        <h2>Estatísticas</h2>
        <p>Sexo masculino: <strong>${maleCount || 0}</strong></p>
        <p>Sexo feminino: <strong>${femaleCount || 0}</strong></p>
        <p>Soma das idades: <strong>${ageSum || 0}</strong></p>
        <p>Média das idades: <strong>${ageMedian || 0}</strong></p>
    `;

    console.log(maleCount);
    console.log(femaleCount);
    console.log(ageSum);
    console.log(ageMedian);
}

function init() {
    getData().catch(err => console.log(err));
    renderStatistics();
}

// O usuário poderá filtrar os dados tanto digitando "Enter" quanto clicando no botão correspondente
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    renderUserList();
    renderStatistics();
})

searchInput.addEventListener('keyup', handleKeyUp);

window.addEventListener('load', init);
