import config from "./utils/config.js"
import samplePeopleData from "./data/samplePeopleData.js"
import { addItemToFavorites, removeItemFromFavorites } from './utils/favorite.js';

const resultsContainer = document.querySelector('#results-container')
const showMoreButtonContainer = document.querySelector('#show-more-btn')

let tempResults = []

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
        tempResults = data.results
        const newResults = await getPredisplayData(data.results)
        displayResults(newResults)
        setPagination(data.total_pages)
    }
}

getPeoplePageData()

function displayResults(results) {
    resultsContainer.innerHTML = ''

    const resultsHTML = results.map((result, index) => {
        const imageUrl = result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.profile_path}` : '../images/no-image-1.png'
        return `
            <div class="border">
                <img src="${imageUrl}" alt="${result.name}" class="h-5 w-5">
                ${result.name}
                <button id="favorite-btn" value="${index}" class="bg-red-400">${result.favorite_status ? 'Remove' : 'Add'}</button>
            </div>
        `
    })

    resultsContainer.innerHTML = resultsHTML

    // Re-attach event listeners to the new buttons
    document.querySelectorAll('#favorite-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            if(localStorage.getItem('userInfo')){
                const index = button.value
                const action = button.textContent.trim()

                if(action === 'Add'){
                    addItemToFavorites('person', tempResults[index])
                    button.textContent = "Remove"
                } else if(action === 'Remove'){
                    removeItemFromFavorites('person', tempResults[index].id)
                    button.textContent = "Add"
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
        showMoreButton.addEventListener('click', () => handleShowMore())

        showMoreButtonContainer.appendChild(showMoreButton)
    }
}

async function handleShowMore() {
    page++
    //fetch new data based off of page number and filter and update UI
    getPeoplePageData()
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