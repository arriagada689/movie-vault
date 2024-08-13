import config from './utils/config.js'

const userListsContainer = document.querySelector('#user-lists-container')
const favoritesContainer = document.querySelector('#favorites-container')
const username = document.querySelector('#username')
username.textContent = JSON.parse(localStorage.getItem('userInfo')).username

const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

//fetch profile data
async function getProfileData(){
    const response = await fetch(`${config.apiBaseUrl}/users/profile`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if(response.ok){
        const data = await response.json()
        console.log(data);
        displayFavorites(data.favorites)
        displayLists(data.lists)
    } else {
        const error = await response.json()
        console.log(error);
    }
}

function displayLists(lists){
    userListsContainer.innerHTML = ''

    userListsContainer.innerHTML = lists.map(list => {
        return `
            <a href="/list.html?id=${list._id}">
                ${list.name}
            </a>
        `
    }).join('')
}

function displayFavorites(favorites){
    favoritesContainer.innerHTML = ''

    favoritesContainer.innerHTML = favorites.map(item => {
        let link = ''
        if(item.type === 'Movie'){
            link += `/movie-details.html?id=${item.id}`
        } else if(item.type === 'TV'){
            link += `/tv-show-details.html?id=${item.id}`
        } else if(item.type === 'Person'){
            link += `/person-details.html?id=${item.id}`
        }
        const imageUrl = item.image ? `https://image.tmdb.org/t/p/w500/${item.image}` : '../images/no-image-1.png';
        return `
            <a href="${link}" class="border">
                <img src="${imageUrl}" alt="${item.name || item.title}" class="w-[50px] h-[50px]">
                ${item.name || item.title}
            </a>
        `
    }).join('')
}

getProfileData()