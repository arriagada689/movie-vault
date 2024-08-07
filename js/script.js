import config from '../js/utils/config.js'

const homeSearchForm = document.querySelector('#home-search-form')
const rightSideNav = document.querySelector('#right-side-nav')

homeSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputField = homeSearchForm.querySelector('input');
    const searchText = inputField.value;

    //re-route to search results page
    window.location.href = `search-results.html?query=${encodeURIComponent(searchText)}`
})

//handle dynamic navbar
if(localStorage.getItem('userInfo')){
    rightSideNav.innerHTML = ''
    
    //create log out button
    const logoutButton = document.createElement('button')
    logoutButton.innerText = 'Log Out'
    logoutButton.addEventListener('click', logout)

    rightSideNav.innerHTML = `
        <a href="profile.html">Profile</a>
    `
    rightSideNav.appendChild(logoutButton)
}

function logout() {
    localStorage.removeItem('userInfo')
    rightSideNav.innerHTML = ''
    rightSideNav.innerHTML = `
        <a href="login.html">Log In</a>
        <a href="register.html">Register</a>
    `
}

//trending section, day and week filtering
const trendingWrapper = document.querySelector('#trending-wrapper')
let trendingFilter = 'day'

const getTrendingData = async () => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/trending?type=${trendingFilter}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            displayTrending(data.results)
        }
    } catch (error) {
        console.log(error);
    }
}

import {dayTrendingData, weekTrendingData} from './data/trendingData.js';
displayTrending(dayTrendingData.results)
// if(trendingWrapper.childNodes.length === 0){
//     getTrendingData()
// }

//trending cards can be movies, tv shows, and people
function displayTrending(results) {
    // Create a string with all the results' HTML
    const resultsHTML = results.map(result => {
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png';
        return `
            <div>
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[50px] w-[50px]">
                ${result.name || result.title}
            </div>
        `
    }).join('')

    trendingWrapper.innerHTML = resultsHTML
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
            // console.log(data);
            displayPopular(data.results)
        }
    } catch (error) {
        console.log(error);
    }
}

import { popularMovieData, popularTvData, popularPeopleData } from './data/popularData.js';
displayPopular(popularMovieData.results)
// if(popularWrapper.childNodes.length === 0){
//     getPopularData()
// }

//popular cards
function displayPopular(results) {
    // Create a string with all the results' HTML
    const resultsHTML = results.map(result => {
        let imageUrl = ''
        if(popularFilter === 'person'){
            imageUrl = result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.profile_path}` : '../images/no-image-1.png'
        } else {
            imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png';
        }
        
        return `
            <div>
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[50px] w-[50px]">
                ${result.name || result.title}
            </div>
        `
    }).join('')

    popularWrapper.innerHTML = resultsHTML
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
