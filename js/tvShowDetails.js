import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
import sampleTvShowDetails from './data/sampleTvShowDetails.js'

const queryParams = getQueryParams()
const tvShowId = queryParams.id
let tvShowData = ''
let favoriteStatus = false

//fetch initial data
async function getTvShowDetails(){
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/tv_show_details?id=${tvShowId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            // console.log(data);
            tvShowData = data.tv_data
            displayData(data.tv_data)
            displayCast(data.credits.cast)
            favoriteStatus = checkFavoriteStatus()
            getUserList()
        }
    } catch (error) {
        console.log(error);
    }
}

const image = document.querySelector('#main-img')
const name = document.querySelector('#name')
const releaseDate = document.querySelector('#release_date')
const genres = document.querySelector('#genres')
const overview = document.querySelector('#overview')

function displayData(data){
    image.src = data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : '../images/no-image-1.png'
    image.alt = data.name
    name.textContent = data.name
    releaseDate.textContent = data.first_air_date.substring(0, 4)
    genres.textContent = genreString(data.genres)
    overview.textContent = data.overview
}

const castCardContainer = document.querySelector('#cast-card-container')

function displayCast(arr){
    castCardContainer.innerHTML = ''
    
    const html = arr.map((castMember) => {
        const imageUrl = castMember.profile_path ? `https://image.tmdb.org/t/p/w500/${castMember.profile_path}` : '../images/no-image-1.png'
        return `
            <a href="/person-details.html?id=${castMember.id}" class="border">
                <img src="${imageUrl}" alt="${castMember.name}" class="h-[100px] w-[100px]">
                <div>${castMember.name}</div>
            </a>
        `
    }).join('')

    castCardContainer.innerHTML = html
}

getTvShowDetails()
// displayData(sampleTvShowDetails.tv_data)
// displayCast(sampleTvShowDetails.credits.cast)

function genreString(genres){
    let str = ''
    for(const genre of genres){
        str += genre.name
    }
    return str
}

//add to favorites section
const favoriteButton = document.querySelector('#favorite-btn')

const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

favoriteButton.addEventListener('click', async () => {
    if(localStorage.getItem('userInfo') && !favoriteStatus){
        const response = await fetch(`${config.apiBaseUrl}/users/add_tv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: tvShowData.name,
                id: tvShowData.id,
                image: tvShowData.poster_path,
                genres: tvShowData.genres,
                first_air_date: tvShowData.first_air_date
            })
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = true
            setFavoriteButton()
            // console.log(data);
        } else {
            const error = await response.json()
            console.log(error);
        }
    } else if(localStorage.getItem('userInfo') && favoriteStatus){
        //remove from favorites
        const response = await fetch(`${config.apiBaseUrl}/users/delete_item?type=tv&id=${tvShowData.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = false
            setFavoriteButton()
        } else {
            const error = await response.json()
            console.log(error);
        }
    } else {
        window.location.href = `/login.html`
    }
})

async function checkFavoriteStatus() {
    if(localStorage.getItem('userInfo') && token){
        const response = await fetch(`${config.apiBaseUrl}/users/favorite_status?type=tv&id=${tvShowData.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = data.status
            setFavoriteButton()
        }
    }
    setFavoriteButton()
    return false
}

//change the button in the frontend based on favorite status
function setFavoriteButton(){
    if(favoriteStatus){
        favoriteButton.textContent = 'Remove from Favorites'
    } else {
        favoriteButton.textContent = 'Add to Favorites'
    }
}

//fetch users lists
async function getUserList(){
    if(localStorage.getItem('userInfo') && token){
        const response = await fetch(`${config.apiBaseUrl}/users/list_data/${tvShowData.id}/tv`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            displayUserLists(data)
        }
    }
}

const userListsContainer = document.querySelector('#user-list-container')

function displayUserLists(lists){
    userListsContainer.innerHTML = ''

    userListsContainer.innerHTML = lists.map((list, index) => {
        return `
            <button id="list-btn" value="${index}" class="w-full flex justify-between p-2 border">
                <div>${list.name}</div>
                <div>${list.status}</div>
            </button>
        `
    }).join('')

    document.querySelectorAll('#list-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            const index = button.value
            if(!lists[index].status){
                addTvShowToList(lists[index]._id)
            } else {
                removeTvShowFromList(lists[index]._id)
            }
            lists[index].status = lists[index].status ? false : true
            button.childNodes[3].textContent = lists[index].status
        })
    })
}

async function addTvShowToList(list_id){
    const response = await fetch(`${config.apiBaseUrl}/users/list_add_tv`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            name: tvShowData.name,
            id: tvShowData.id,
            image: tvShowData.poster_path,
            genres: tvShowData.genres,
            first_air_date: tvShowData.first_air_date
        })
    })
    if(response.ok){
        const data = await response.json()
    } else {
        const error = await response.json()
        console.log(error);
    }
}

async function removeTvShowFromList(list_id){
    const response = await fetch(`${config.apiBaseUrl}/users/list_remove_item`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            id: tvShowData.id,
            type: 'tv'
        })
    })
    if(response.ok){
        const data = await response.json()
        
    } else {
        const error = await response.json()
        console.log(error);
    }
}