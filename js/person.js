import config from "./utils/config.js"
import samplePeopleData from "./data/samplePeopleData.js"

const resultsContainer = document.querySelector('#results-container')
const showMoreButtonContainer = document.querySelector('#show-more-btn')

let page = 1

//load initial data
async function getPeoplePageData() {
    const response = await fetch(`${config.apiBaseUrl}/tmdb/people_page?page=${page}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        displayResults(data.results)
        setPagination(data.total_pages)
    }
}

getPeoplePageData()

function displayResults(results) {
    resultsContainer.innerHTML = ''

    const resultsHTML = results.map(result => {
        const imageUrl = result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.profile_path}` : '../images/no-image-1.png'
        return `
            <div class="border">
                <img src="${imageUrl}" alt="${result.name}" class="h-5 w-5">
                ${result.name}
            </div>
        `
    })

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
    getPeoplePageData()
}
