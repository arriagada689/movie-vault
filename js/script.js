import config from '../js/utils/config.js'
import formatDate from './utils/formatDate.js';
import { addItemToFavorites, removeItemFromFavorites } from './utils/favorite.js';
import { Spinner } from './loading-spinner.js';

Spinner()
Spinner.show()

//awake server
const loadingDiv = document.querySelector('#awake')
const mainDiv = document.getElementById('main-div')
const awake = await fetch(`${config.apiBaseUrl}/users/awake`)
if(awake.ok){
    const data = await awake.json()
    if(data === 'awake'){
        loadingDiv.classList.add('hidden')
        mainDiv.className = 'container mx-auto'
        Spinner.hide()
    }
}

const homeSearchForm = document.querySelector('#home-search-form')
const backdropImage = document.getElementById('header-backdrop')

homeSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputField = homeSearchForm.querySelector('input');
    const searchText = inputField.value;

    //re-route to search results page
    window.location.href = `search-results.html?query=${encodeURIComponent(searchText)}`
})

//trending section, day and week filtering
const trendingWrapper = document.querySelector('#trending-wrapper')
let trendingFilter = 'day'

let tempTrendingData = []
let tempPopularData = []

const getTrendingData = async () => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/trending?type=${trendingFilter}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            tempTrendingData = data.results
            const newResults = await getPredisplayData(data.results)
            displayTrending(newResults)
            setBackdropImage(data.results)
        }
    } catch (error) {
        console.log(error);
    }
}

getTrendingData()

//trending cards can be movies, tv shows, and people
function displayTrending(results) {
    // Create a string with all the results' HTML
    const resultsHTML = results.map((result, index) => {
        // console.log(result);
        let link = ''
        if(result.media_type === 'movie'){
            link += `/movie-details.html?id=${result.id}`
        } else if(result.media_type === 'tv'){
            link += `/tv-show-details.html?id=${result.id}`
        } else if(result.media_type === 'person' || result.media_type === 'people'){
            link += `/person-details.html?id=${result.id}`
        }
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png';
       
        let subLabel
        if(result.media_type === 'movie' || result.media_type === 'tv'){
            subLabel = formatDate(result.release_date || result.first_air_date)
        } else {
            subLabel = result.known_for_department
        }

        return `
            <a href="${link}" class="rounded-lg border h-[305px] w-[150px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[225px] w-full rounded-t-lg">
                <div class="p-1 flex flex-col flex-grow">
                    <div class="line-clamp-2 font-semibold">${result.name || result.title}</div>
                    <div class="flex-grow"></div>
                    <div class="text-gray-700">${subLabel}</div>
                    <button id="trending-favorite-btn" data-action="${result.favorite_status ? 'Remove' : 'Add'}" value="${index}" class="bg-red-400 absolute top-2 right-[-100px] transition-all duration-300 group-hover:right-0 p-2">${result.favorite_status ? '<i class="fa-solid fa-heart text-white text-xl"></i>' : '<i class="fa-regular fa-heart text-white text-xl"></i>'}</button>
                </div>
            </a>
        `
    }).join('')

    trendingWrapper.innerHTML = resultsHTML

    // Re-attach event listeners to the new buttons
    document.querySelectorAll('#trending-favorite-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            if(localStorage.getItem('userInfo')){
                const index = button.value
                const action = button.getAttribute('data-action');
                const itemType = tempTrendingData[Number(index)].media_type

                if(action === 'Add'){
                    addItemToFavorites(itemType, tempTrendingData[index])
                    button.setAttribute('data-action', 'Remove');
                    button.innerHTML = '<i class="fa-solid fa-heart text-white text-xl"></i>'
                } else if(action === 'Remove'){
                    removeItemFromFavorites(itemType, tempTrendingData[index].id)
                    button.setAttribute('data-action', 'Add');
                    button.innerHTML = '<i class="fa-regular fa-heart text-white text-xl"></i>'
                }
            } else {
                window.location.href = `/login.html`
            }
        })
    })
}

const todayButton = document.querySelector('#today-button')
const weekButton = document.querySelector('#week-button')
//set bg color of buttons based on selected filter
if(trendingFilter === 'day'){
    // console.log(todayButton);
    todayButton.classList.add('bg-purple-700')
    todayButton.classList.add('text-white')
}

//handle trending filter click
weekButton.addEventListener('click', () => {
    trendingFilter = 'week'
    //update data
    
    getTrendingData()

    todayButton.className = 'p-1 px-2 rounded-full'
    weekButton.className = 'p-1 px-2 rounded-full bg-purple-700 text-white'
})

todayButton.addEventListener('click', () => {
    trendingFilter = 'day'
    //update data
    
    getTrendingData()

    weekButton.className = 'p-1 px-2 rounded-full'
    todayButton.className = 'p-1 px-2 rounded-full bg-purple-700 text-white'
})

//popular section, all, movie, tv, people filtering
const popularWrapper = document.querySelector('#popular-wrapper')
let popularFilter = 'movie'

const getPopularData = async () => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/popular?type=${popularFilter}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            tempPopularData = data.results
            const newResults = await getPredisplayData(data.results)
            displayPopular(newResults)
        }
    } catch (error) {
        console.log(error);
    }
}

getPopularData()

//popular cards
function displayPopular(results) {
    // Create a string with all the results' HTML
    const resultsHTML = results.map((result, index) => {
        let link = ''
        if(popularFilter === 'movie'){
            link += `/movie-details.html?id=${result.id}`
        } else if(popularFilter === 'tv'){
            link += `/tv-show-details.html?id=${result.id}`
        } else if(popularFilter === 'person'){
            link += `/person-details.html?id=${result.id}`
        }
        let imageUrl = ''
        if(popularFilter === 'person'){
            imageUrl = result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.profile_path}` : '../images/no-image-1.png'
        } else {
            imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png';
        }
        
        let subLabel
        if(popularFilter === 'movie' || popularFilter === 'tv'){
            subLabel = formatDate(result.release_date || result.first_air_date)
        } else {
            subLabel = result.known_for_department
        }
        
        return `
            <a href="${link}" class="rounded-lg border h-[305px] w-[150px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[225px] w-full rounded-t-lg">
                <div class="p-1 flex flex-col flex-grow">
                    <div class="line-clamp-2 font-semibold">${result.name || result.title}</div>
                    <div class="flex-grow"></div>
                    <div class="text-gray-700">${subLabel}</div>
                    <button id="favorite-btn" data-action="${result.favorite_status ? 'Remove' : 'Add'}" value="${index}" class="bg-red-400 absolute top-2 right-[-100px] transition-all duration-300 group-hover:right-0 p-2">${result.favorite_status ? '<i class="fa-solid fa-heart text-white text-xl"></i>' : '<i class="fa-regular fa-heart text-white text-xl"></i>'}</button>
                </div>
            </a>
        `
    }).join('')

    popularWrapper.innerHTML = resultsHTML

    // Re-attach event listeners to the new buttons
    document.querySelectorAll('#favorite-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            if(localStorage.getItem('userInfo')){
                const index = button.value
                const action = button.getAttribute('data-action');
                if(action === 'Add'){
                    addItemToFavorites(popularFilter, tempPopularData[index])
                    button.setAttribute('data-action', 'Remove');
                    button.innerHTML = '<i class="fa-solid fa-heart text-white text-xl"></i>'
                } else if(action === 'Remove'){
                    removeItemFromFavorites(popularFilter, tempPopularData[index].id)
                    button.setAttribute('data-action', 'Add');
                    button.innerHTML = '<i class="fa-regular fa-heart text-white text-xl"></i>'
                }
            } else {
                window.location.href = `/login.html`
            }
        })
    })
}

const movieButton = document.querySelector('#movie-button')
const tvButton = document.querySelector('#tv-button')
const peopleButton = document.querySelector('#people-button')
if(popularFilter === 'movie'){
    movieButton.classList.add('bg-purple-700')
    movieButton.classList.add('text-white')
}

//handle popular filter button click
tvButton.addEventListener('click', () => {
    popularFilter = 'tv'

    getPopularData()

    movieButton.className = 'p-1 px-2 rounded-full'
    peopleButton.className = 'p-1 px-2 rounded-full'
    tvButton.className = 'p-1 px-2 rounded-full bg-purple-700 text-white'
})

peopleButton.addEventListener('click', () => {
    popularFilter = 'person'

    getPopularData()

    movieButton.className = 'p-1 px-2 rounded-full'
    tvButton.className = 'p-1 px-2 rounded-full'
    peopleButton.className = 'p-1 px-2 rounded-full bg-purple-700 text-white'
})

movieButton.addEventListener('click', () => {
    popularFilter = 'movie'

    getPopularData()

    tvButton.className = 'p-1 px-2 rounded-full'
    peopleButton.className = 'p-1 px-2 rounded-full'
    movieButton.className = 'p-1 px-2 rounded-full bg-purple-700 text-white'
})

async function getPredisplayData(results){
    if(localStorage.getItem('userInfo')){
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const response = await fetch(`${config.apiBaseUrl}/users/predisplay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                results: results
            })
        })
        if(response.ok){
            const data = await response.json()
            return data
        }
    }
    return results
}

function setBackdropImage(results) {
    //randomly choose backdrop image from results
    const randomNumber = Math.floor(Math.random() * 20);
    const randomImage = results[randomNumber].backdrop_path
    //set src to image
    backdropImage.src = randomImage ? `https://image.tmdb.org/t/p/w500/${randomImage}` : '../images/no-image-1.png'
}

const mainSearchBar = document.getElementById('main-search-bar')
mainSearchBar.addEventListener('focus', () => {
    mainSearchBar.placeholder = ''
})
mainSearchBar.addEventListener('blur', () => {
    mainSearchBar.placeholder = 'Search ...'
})