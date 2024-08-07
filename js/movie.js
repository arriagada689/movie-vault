import config from "./utils/config.js"
import sampleMovieData from "./data/sampleMovieData.js"
import { sortResults } from "./utils/sorting.js"

const filterButtons = document.querySelectorAll('#filter-btn')
const resultsContainer = document.querySelector('#results-container')
const showMoreButtonContainer = document.querySelector('#show-more-btn')
const sortingMetricDropdown = document.querySelector('#sorting-metric-dropdown')

let typeFilter = 'now_playing'
let page = 1
let sortingMetric = sortingMetricDropdown.value
let tempResults = []

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
        displayResults(arr)
        setPagination(data.total_pages)
        tempResults = arr
    }
}

getMoviePageData()

filterButtons.forEach(filterButton => {
    filterButton.addEventListener('click', () => {
        typeFilter = filterButton.value
        getMoviePageData()
    })
})

//display results
function displayResults(results){
    resultsContainer.innerHTML = ''

    const resultsHTML = results.map(result => {
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png'
        return `
            <div class="border">
                <img src="${imageUrl}" alt="${result.title}" class="h-5 w-5">
                ${result.title}
            </div>
        `
    }).join('')

    resultsContainer.innerHTML = resultsHTML
}

function setPagination(num) {
    showMoreButtonContainer.innerHTML = ''
    if(page < num){
        const showMoreButton = document.createElement('button')
        showMoreButton.textContent = 'Show More'
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