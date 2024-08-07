import config from "./utils/config.js"
import { sortTvResults } from "./utils/sorting.js"

const filterButtons = document.querySelectorAll('#filter-btn')
const resultsContainer = document.querySelector('#results-container')
const showMoreButtonContainer = document.querySelector('#show-more-btn')
const sortingMetricDropdown = document.querySelector('#sorting-metric-dropdown')

let typeFilter = 'airing_today'
let page = 1
let sortingMetric = sortingMetricDropdown.value
let tempResults = []

//load initial data
async function getTvPageData() {
    const response = await fetch(`${config.apiBaseUrl}/tmdb/tv_page?type=${typeFilter}&page=${page}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        const arr = sortTvResults(sortingMetric, data.results)
        displayResults(arr)
        setPagination(data.total_pages)
        tempResults = arr
    }
}

getTvPageData()

filterButtons.forEach(filterButton => {
    filterButton.addEventListener('click', () => {
        typeFilter = filterButton.value
        getTvPageData()
    })
})

function displayResults(results) {
    resultsContainer.innerHTML = ''

    const resultsHTML = results.map(result => {
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png'
        return `
            <div class="border">
                <img src="${imageUrl}" alt="${result.name}" class="h-5 w-5">
                ${result.name}
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
    getTvPageData()
}

sortingMetricDropdown.addEventListener('change', () => {
    sortingMetric = sortingMetricDropdown.value
    const sortedResults = sortTvResults(sortingMetric, tempResults)
    displayResults(sortedResults)
})

