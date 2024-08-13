import config from '../js/utils/config.js'
import { addItemToFavorites, removeItemFromFavorites } from './utils/favorite.js';

const homeSearchForm = document.querySelector('#home-search-form')

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
        }
    } catch (error) {
        console.log(error);
    }
}

import {dayTrendingData, weekTrendingData} from './data/trendingData.js';
const newResults2 = await getPredisplayData(dayTrendingData.results)
displayTrending(newResults2)
tempTrendingData = dayTrendingData.results
// if(trendingWrapper.childNodes.length === 0){
//     getTrendingData()
// }

//trending cards can be movies, tv shows, and people
function displayTrending(results) {
    // Create a string with all the results' HTML
    const resultsHTML = results.map((result, index) => {
        let link = ''
        if(result.media_type === 'movie'){
            link += `/movie-details.html?id=${result.id}`
        } else if(result.media_type === 'tv'){
            link += `/tv-show-details.html?id=${result.id}`
        } else if(result.media_type === 'person' || result.media_type === 'people'){
            link += `/person-details.html?id=${result.id}`
        }
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png';
        return `
            <a href="${link}">
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[50px] w-[50px]">
                ${result.name || result.title}
                <button id="trending-favorite-btn" value="${index}" class="bg-red-400">${result.favorite_status ? 'Remove' : 'Add'}</button>
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
                const action = button.textContent.trim()
                const itemType = tempTrendingData[Number(index)].media_type

                if(action === 'Add'){
                    addItemToFavorites(itemType, tempTrendingData[index])
                    button.textContent = "Remove"
                } else if(action === 'Remove'){
                    removeItemFromFavorites(itemType, tempTrendingData[index].id)
                    button.textContent = "Add"
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
    todayButton.classList.add('bg-blue-300')
} else {
    weekButton.classList.add('bg-blue-300')
}

//handle trending filter click
weekButton.addEventListener('click', () => {
    trendingFilter = 'week'
    //update data
    displayTrending(weekTrendingData.results)
    // getTrendingData()

    //update bg color for button
    todayButton.classList.remove('bg-blue-300')
    weekButton.classList.add('bg-blue-300')
})

todayButton.addEventListener('click', () => {
    trendingFilter = 'day'
    //update data
    displayTrending(dayTrendingData.results)
    // getTrendingData()

    //update bg color for button
    weekButton.classList.remove('bg-blue-300')
    todayButton.classList.add('bg-blue-300')
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

import { popularMovieData, popularTvData, popularPeopleData } from './data/popularData.js';
const newResults = await getPredisplayData(popularMovieData.results)
displayPopular(newResults)
tempPopularData = popularMovieData.results
//getPopularData()

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
        
        return `
            <a href="${link}">
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[50px] w-[50px]">
                ${result.name || result.title}
                <button id="favorite-btn" value="${index}" class="bg-red-400">${result.favorite_status ? 'Remove' : 'Add'}</button>
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
                const action = button.textContent.trim()
                if(action === 'Add'){
                    addItemToFavorites(popularFilter, tempPopularData[index])
                    button.textContent = "Remove"
                } else if(action === 'Remove'){
                    removeItemFromFavorites(popularFilter, tempPopularData[index].id)
                    button.textContent = "Add"
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
    movieButton.classList.add('bg-blue-300')
} else if(popularFilter === 'tv'){
    tvButton.classList.add('bg-blue-300')
} else if(popularFilter === 'person'){
    peopleButton.classList.add('bg-blue-300')
}

//handle popular filter button click
tvButton.addEventListener('click', () => {
    popularFilter = 'tv'

    // displayPopular(popularTvData.results)
    getPopularData()

    movieButton.classList.remove('bg-blue-300')
    peopleButton.classList.remove('bg-blue-300')
    tvButton.classList.add('bg-blue-300')
})

peopleButton.addEventListener('click', () => {
    popularFilter = 'person'

    // displayPopular(popularPeopleData.results)
    getPopularData()

    movieButton.classList.remove('bg-blue-300')
    tvButton.classList.remove('bg-blue-300')
    peopleButton.classList.add('bg-blue-300')
})

movieButton.addEventListener('click', () => {
    popularFilter = 'movie'

    // displayPopular(popularMovieData.results)
    getPopularData()

    tvButton.classList.remove('bg-blue-300')
    peopleButton.classList.remove('bg-blue-300')
    movieButton.classList.add('bg-blue-300')
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