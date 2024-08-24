import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
// import sampleMovieDetails from './data/sampleMovieDetails.js'
import formatTime from './utils/formatTime.js'

const queryParams = getQueryParams()
const movieId = queryParams.id
let movieData = ''
let creditData = ''
let favoriteStatus = false
let userListDropdown = false
let creditsDropdown = false
let seeAllCast = false
let seeAllCredits = false

const image = document.getElementById('main-img')
const name = document.querySelector('#name')
const releaseDate = document.querySelector('#release_date')
const runtime = document.querySelector('#runtime')
const genres = document.querySelector('#genres')
const overview = document.querySelector('#overview')
const castCardContainer = document.querySelector('#cast-card-container')
const creditsCardContainer = document.querySelector('#credits-card-container')
const favoriteButton = document.querySelector('#favorite-btn')
const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
const userListsContainer = document.querySelector('#user-list-container')
const listButton = document.getElementById('add-to-list-btn')
const showAllCastButton = document.getElementById('show-all-cast-button')
const showAllCreditsButton = document.getElementById('show-all-credits-button')

showAllCastButton.addEventListener('click', () => {
    //change wrapper classes
    seeAllCast = !seeAllCast
    if(seeAllCast){
        castCardContainer.className = 'flex gap-3 flex-wrap justify-around md:justify-start mt-3'
    } else {
        castCardContainer.className = "flex overflow-x-auto gap-x-3 pb-1"
    }
    //change button text
    showAllCastButton.textContent = seeAllCast ? 'Close' : 'Show All Cast'

    //run display function again with new condition (slice array)
    displayCast(creditData.cast)
})

showAllCreditsButton.addEventListener('click', () => {
    //change wrapper classes
    seeAllCredits = !seeAllCredits
    if(seeAllCredits){
        creditsCardContainer.className = 'flex gap-3 flex-wrap justify-around md:justify-start mt-3'
    } else {
        creditsCardContainer.className = "flex overflow-x-auto gap-x-3 pb-1"
    }
    //change button text
    showAllCreditsButton.textContent = seeAllCredits ? 'Close' : 'Show All Cast'

    //run display function again with new condition (slice array)
    displayCredits(creditData.crew)
})

//toggle cast dropdown
listButton.addEventListener('click', () => {
    userListDropdown = !userListDropdown
    if(userListDropdown){
        userListsContainer.classList.remove('hidden')
        userListsContainer.classList.add('flex')
    } else {
        userListsContainer.classList.remove('flex')
        userListsContainer.classList.add('hidden')
    }
})

//fetch initial data
async function getMovieDetails(){
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/movie_details?id=${movieId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            movieData = data.movie_data
            creditData = data.credits
            displayData(data.movie_data)
            displayCast(data.credits.cast)
            displayCredits(data.credits.crew)
            favoriteStatus = checkFavoriteStatus()
            getUserList()
        }
    } catch (error) {
        console.log(error);
    }
}

getMovieDetails()

function displayData(data){
    image.src = data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : '../images/no-image-1.png'
    image.alt = data.title
    name.textContent = data.title
    releaseDate.textContent = data.release_date
    runtime.textContent = formatTime(data.runtime)
    genres.innerHTML = ''
    genres.innerHTML = data.genres.map((genre, index) => {
        if(index === data.genres.length - 1){
            return `
                <div>${genre.name}</div>
            `
        } else {
            return `
                <div>${genre.name}</div>
                <i class="fa-solid fa-circle text-xs"></i>
            `
        }
    }).join('')
    overview.textContent = data.overview
}

function displayCast(arr){
    castCardContainer.innerHTML = ''

    if(arr.length <= 12){
        showAllCastButton.classList.add('hidden')
    }

    let tempArr = seeAllCast ? arr : arr.slice(0, 12)
    
    castCardContainer.innerHTML = tempArr.map((castMember) => {
        const imageUrl = castMember.profile_path ? `https://image.tmdb.org/t/p/w500/${castMember.profile_path}` : '../images/no-image-1.png'
        return `
            <a href="/person-details.html?id=${castMember.id}" class="rounded-lg border h-[320px] w-[160px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${castMember.name}" class="h-[225px] w-full rounded-t-lg">
                <div class="line-clamp-2 font-semibold">${castMember.name}</div>
                <div class="flex-grow"></div>
                <div class="text-gray-700 line-clamp-2">${castMember.character}</div>
            </a>
        `
    }).join('')
}

//check favorite status for movie
async function checkFavoriteStatus(){
    if(localStorage.getItem('userInfo') && token){
        const response = await fetch(`${config.apiBaseUrl}/users/favorite_status?type=movie&id=${movieData.id}`, {
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

favoriteButton.addEventListener('click', async () => {
    if(localStorage.getItem('userInfo') && !favoriteStatus){
        
        const response = await fetch(`${config.apiBaseUrl}/users/add_movie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: movieData.title,
                id: movieData.id,
                image: movieData.poster_path,
                genres: movieData.genres,
                release_date: movieData.release_date
            })
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = true
            setFavoriteButton()
        } else {
            const error = await response.json()
            console.log(error);
        }
    } else if(localStorage.getItem('userInfo') && favoriteStatus) {
        //remove from favorites
        const response = await fetch(`${config.apiBaseUrl}/users/delete_item?type=movie&id=${movieData.id}`, {
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

//change the button in the frontend based on favorite status
function setFavoriteButton(){
    if(favoriteStatus){
        favoriteButton.innerHTML = `<i class="fa-solid fa-heart text-lg"></i>
                                    <span class="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-sm p-1 rounded font-semibold text-nowrap">
                                        Add to favorites
                                    </span>`
    } else {
        favoriteButton.innerHTML = `<i class="fa-regular fa-heart text-lg"></i>
                                    <span class="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-sm p-1 rounded font-semibold text-nowrap">
                                        Remove from favorites
                                    </span>`
    }
}

//fetch users lists
async function getUserList(){
    if(localStorage.getItem('userInfo') && token){
        const response = await fetch(`${config.apiBaseUrl}/users/list_data/${movieData.id}/movie`, {
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

function displayUserLists(lists){
    userListsContainer.innerHTML = ''

    let htmlContent = `
        <a href="create-list.html" class="w-full flex justify-between p-2 ${lists.length > 0 ? 'border-b' : ''}">Create List</a>
    `;

    htmlContent += lists.map((list, index) => {
        return `
            <button id="list-btn" value="${index}" class="w-full flex justify-between p-2 ${index !== lists.length - 1 ? 'border-b' : ''}">
                <div>${list.name}</div>
                <div>${list.status ? 'Remove' : 'Add'}</div>
            </button>
        `
    }).join('')

    userListsContainer.innerHTML = htmlContent;

    document.querySelectorAll('#list-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            const index = button.value
            if(!lists[index].status){
                addMovieToList(lists[index]._id)
            } else {
                removeMovieFromList(lists[index]._id)
            }
            lists[index].status = lists[index].status ? false : true
            button.childNodes[3].textContent = lists[index].status ? 'Remove' : 'Add'
        })
    })
}

async function addMovieToList(list_id) {
    const response = await fetch(`${config.apiBaseUrl}/users/list_add_movie`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            title: movieData.title,
            id: movieData.id,
            image: movieData.poster_path,
            genres: movieData.genres,
            release_date: movieData.release_date
        })
    })
    if(response.ok){
        const data = await response.json()
        
    } else {
        const error = await response.json()
        console.log(error);
    }
}

async function removeMovieFromList(list_id) {
    const response = await fetch(`${config.apiBaseUrl}/users/list_remove_item`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            id: movieData.id,
            type: 'movie'
        })
    })
    if(response.ok){
        const data = await response.json()
        
    } else {
        const error = await response.json()
        console.log(error);
    }
}

function displayCredits(arr){
    creditsCardContainer.innerHTML = ''

    if(arr.length <= 12){
        showAllCreditsButton.classList.add('hidden')
    }

    let tempArr = seeAllCredits ? arr : arr.slice(0, 12)
    
    creditsCardContainer.innerHTML = tempArr.map((castMember) => {
        const imageUrl = castMember.profile_path ? `https://image.tmdb.org/t/p/w500/${castMember.profile_path}` : '../images/no-image-1.png'
        return `
            <a href="/person-details.html?id=${castMember.id}" class="rounded-lg border h-[320px] w-[160px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${castMember.name}" class="h-[225px] w-full rounded-t-lg">
                <div class="line-clamp-2 font-semibold">${castMember.name}</div>
                <div class="flex-grow"></div>
                <div class="text-gray-700 line-clamp-2">${castMember.department}</div>
            </a>
        `
    }).join('')
}
