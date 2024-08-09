import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'

const searchResultsWrapper = document.querySelector('#search-results-wrapper')
const homeSearchForm = document.querySelector('#search-form')
const paginationButtonsWrapper = document.querySelector('#pagination-buttons-wrapper')
const typeButtons = document.querySelectorAll('#type-button')

const queryParams = getQueryParams()
const searchQuery = queryParams.query

const page = queryParams && queryParams.page ? queryParams.page : 1
const type = queryParams && queryParams.type ? queryParams.type : ''

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
            displayResults(data.results)
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
    const resultsHTML = results.map(result => {
        let link = ''
        if(type === 'movie' || result.media_type === 'movie'){
            link += `/movie-details.html?id=${result.id}`
        } else if(type === 'tv' || result.media_type === 'tv'){
            link += `/tv-show-details.html?id=${result.id}`
        } else if(type === 'person' || type === 'people' || result.media_type === 'person' || result.media_type === 'people'){
            link += `/person-details.html?id=${result.id}`
        }
        const imageUrl = result.poster_path || result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path || result.profile_path}` : '../images/no-image-1.png';
        return `
            <a href="${link}">
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[50px] w-[50px]">
                ${result.name || result.title}
            </a>
        `
    }).join('');

    searchResultsWrapper.innerHTML = resultsHTML;
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
        showMoreButton.addEventListener('click', () => paginationClick(Number(page) + 1))

        paginationButtonsWrapper.appendChild(showMoreButton)
    }
}

function paginationClick(page){
    window.location.href = `search-results.html?query=${encodeURIComponent(queryParams.query)}${type ? `&type=${type}` : ''}&page=${page}`
}

