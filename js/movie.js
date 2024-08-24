import config from "./utils/config.js"
import formatDate from "./utils/formatDate.js";
// import sampleMovieData from "./data/sampleMovieData.js"
import { sortResults } from "./utils/sorting.js"
import { addItemToFavorites, removeItemFromFavorites } from './utils/favorite.js';

const filterButtons = document.querySelectorAll('#filter-btn')
const resultsContainer = document.querySelector('#results-container')
const showMoreButtonContainer = document.querySelector('#show-more-btn')
const sortingMetricDropdown = document.querySelector('#sorting-metric-dropdown')

let typeFilter = 'now_playing'
let page = 1
let sortingMetric = sortingMetricDropdown.value
let tempResults = []

//set header text
const headerDiv = document.getElementById('header-div')
headerDiv.textContent = 'Now Playing'

//set initial selected button bg color
filterButtons[0].className = 'bg-yellow-600 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'

//load initial data
async function getMoviePageData() {
    const response = await fetch(`${config.apiBaseUrl}/tmdb/movie_page?type=${typeFilter}&page=${page}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        const arr = sortResults(sortingMetric, data.results)
        const newResults = await getPredisplayData(arr)
        displayResults(newResults)
        setPagination(data.total_pages)
        tempResults = arr
    }
}

getMoviePageData()

filterButtons.forEach(filterButton => {
    filterButton.addEventListener('click', () => {
        typeFilter = filterButton.value
        page = 1
        getMoviePageData()

        //change header text
        setHeaderText(typeFilter)

        //handle button bg colors
        filterButtons.forEach(button => {
            if(button.value === typeFilter){
                button.className = 'bg-yellow-600 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'
            } else {
                button.className = 'bg-yellow-400 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'
            }   
        })
    })
})

//display results
function displayResults(results){
    resultsContainer.innerHTML = ''

    const resultsHTML = results.map((result, index) => {
        const link = `/movie-details.html?id=${result.id}`
        const subLabel = formatDate(result.release_date) || ''
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png'
        return `
            <a href="${link}" class="rounded-lg border h-[305px] w-[150px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${result.title}" class="h-[225px] w-full rounded-t-lg">
                <div class="p-1 flex flex-col flex-grow">
                    <div class="line-clamp-2 font-semibold">${result.title}</div>
                    <div class="flex-grow"></div>
                    <div class="text-gray-700">${subLabel}</div>
                </div>
                <button id="favorite-btn" data-action="${result.favorite_status ? 'Remove' : 'Add'}" value="${index}" class="bg-red-400 absolute top-2 right-[-100px] transition-all duration-300 group-hover:right-0 p-2">${result.favorite_status ? '<i class="fa-solid fa-heart text-white text-xl"></i>' : '<i class="fa-regular fa-heart text-white text-xl"></i>'}</button>
            </a>
        `
    }).join('')

    resultsContainer.innerHTML = resultsHTML

    // Re-attach event listeners to the new buttons
    document.querySelectorAll('#favorite-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            if(localStorage.getItem('userInfo')){
                const index = button.value
                const action = button.getAttribute('data-action');

                if(action === 'Add'){
                    addItemToFavorites('movie', tempResults[index])
                    button.setAttribute('data-action', 'Remove');
                    button.innerHTML = '<i class="fa-solid fa-heart text-white text-xl"></i>'
                } else if(action === 'Remove'){
                    removeItemFromFavorites('movie', tempResults[index].id)
                    button.setAttribute('data-action', 'Add');
                    button.innerHTML = '<i class="fa-regular fa-heart text-white text-xl"></i>'
                }
            } else {
                window.location.href = `/login.html`
            }
        })
    })
}

function setPagination(num) {
    showMoreButtonContainer.innerHTML = ''
    if(page < num){
        const showMoreButton = document.createElement('button')
        showMoreButton.textContent = 'Show More'
        showMoreButton.className = "bg-yellow-500 text-white font-semibold py-3 px-4 rounded-3xl"
        showMoreButton.addEventListener('click', () => handleShowMore())

        showMoreButtonContainer.appendChild(showMoreButton)
    }
}

async function handleShowMore() {
    page++
    //fetch new data based off of page number and filter and update UI
    getMoviePageData()
}

sortingMetricDropdown.addEventListener('change', () => {
    sortingMetric = sortingMetricDropdown.value
    const sortedResults = sortResults(sortingMetric, tempResults)
    displayResults(sortedResults)
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

function setHeaderText(typeFilter){
    if(typeFilter === 'now_playing'){
        headerDiv.textContent = 'Now Playing'
    } else if(typeFilter === 'popular'){
        headerDiv.textContent = 'Popular'
    } else if(typeFilter === 'top_rated'){
        headerDiv.textContent = 'Top Rated'
    } else if(typeFilter === 'upcoming'){
        headerDiv.textContent = 'Upcoming'
    }
}