import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
import formatDate from './utils/formatDate.js';
import { addItemToFavorites, removeItemFromFavorites } from './utils/favorite.js';
// import sampleSearchResults from './data/sampleSearchResults.js';

const searchResultsWrapper = document.querySelector('#search-results-wrapper')
const homeSearchForm = document.querySelector('#search-form')
const paginationButtonsWrapper = document.querySelector('#pagination-buttons-wrapper')
const typeButtons = document.querySelectorAll('#type-button')

const queryParams = getQueryParams()
const searchQuery = queryParams.query

const page = queryParams && queryParams.page ? queryParams.page : 1
const type = queryParams && queryParams.type ? queryParams.type : ''

let tempResults = []

if(type === 'movie'){
    typeButtons[0].className = 'bg-yellow-600 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'
} else if(type === 'tv'){
    typeButtons[1].className = 'bg-yellow-600 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'
} else if(type === 'person'){
    typeButtons[2].className = 'bg-yellow-600 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'
}

//hit the api with search query
if(searchQuery && searchQuery.length > 0){
    const fetchResultData = async () => {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/search?query=${searchQuery}&page=${page}&type=${type}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            // console.log(data);
            tempResults = data.results
            const newResults = await getPredisplayData(data.results)
            displayResults(newResults)
            setPagination(data.total_pages)
        } else {
            const error = await response.json()
            console.log(error)
        }
    }
    fetchResultData()
}

//display search results
function displayResults(results) {
    // Clear previous results
    searchResultsWrapper.innerHTML = '';

    if (!results || results.length === 0) {
        searchResultsWrapper.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Create a string with all the results' HTML
    const resultsHTML = results.map((result, index) => {
        let link = '', subLabel
        if(type === 'movie' || result.media_type === 'movie'){
            link += `/movie-details.html?id=${result.id}`
            subLabel = formatDate(result.release_date) || ''
        } else if(type === 'tv' || result.media_type === 'tv'){
            link += `/tv-show-details.html?id=${result.id}`
            subLabel = formatDate(result.first_air_date) || ''
        } else if(type === 'person' || result.media_type === 'person'){
            link += `/person-details.html?id=${result.id}`
            subLabel = formatDate(result.known_for_department) || ''
        }
        const imageUrl = result.poster_path || result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path || result.profile_path}` : '../images/no-image-1.png';

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
    }).join('');

    searchResultsWrapper.innerHTML = resultsHTML;

    // Re-attach event listeners to the new buttons
    document.querySelectorAll('#favorite-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            if(localStorage.getItem('userInfo')){
                const index = button.value
                const action = button.getAttribute('data-action');
                const itemType = tempResults[Number(index)].media_type || type

                if(action === 'Add'){
                    addItemToFavorites(itemType, tempResults[index])
                    button.setAttribute('data-action', 'Remove');
                    button.innerHTML = '<i class="fa-solid fa-heart text-white text-xl"></i>'
                } else if(action === 'Remove'){
                    removeItemFromFavorites(itemType, tempResults[index].id)
                    button.setAttribute('data-action', 'Add');
                    button.innerHTML = '<i class="fa-regular fa-heart text-white text-xl"></i>'
                }
            } else {
                window.location.href = `/login.html`
            }
        })
    })
}

//search bar submit
homeSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputField = homeSearchForm.querySelector('input');
    const searchText = inputField.value;

    //re-route to search results page
    window.location.href = `search-results.html?query=${encodeURIComponent(searchText)}`
})

//filter buttons
typeButtons.forEach((typeButton) => {
    typeButton.addEventListener('click', () => {
        //re-route to search results page
        window.location.href = `search-results.html?query=${encodeURIComponent(queryParams.query)}&type=${typeButton.value}`
    })
})

//pagination (create button dynamically and append to wrapper)
function setPagination(num) {
    paginationButtonsWrapper.innerHTML = ''
    if(page < num){
        const showMoreButton = document.createElement('button')
        showMoreButton.textContent = 'Show More'
        showMoreButton.className = "bg-yellow-500 text-white font-semibold py-3 px-4 rounded-3xl"
        showMoreButton.addEventListener('click', () => paginationClick(Number(page) + 1))

        paginationButtonsWrapper.appendChild(showMoreButton)
    }
}

function paginationClick(page){
    window.location.href = `search-results.html?query=${encodeURIComponent(queryParams.query)}${type ? `&type=${type}` : ''}&page=${page}`
}

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

const resultsForDiv = document.getElementById('results-for')
resultsForDiv.textContent = '"'  + searchQuery + '"'