import config from "./utils/config.js"
// import samplePeopleData from "./data/samplePeopleData.js"
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
        const link = `/person-details.html?id=${result.id}`
        const subLabel = result.known_for_department || ''
        const imageUrl = result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.profile_path}` : '../images/no-image-1.png'
        return `
            <a href="${link}" class="rounded-lg border h-[305px] w-[150px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${result.name}" class="h-[225px] w-full rounded-t-lg">
                <div class="p-1 flex flex-col flex-grow">
                    <div class="line-clamp-2 font-semibold">${result.name}</div>
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
                    addItemToFavorites('person', tempResults[index])
                    button.setAttribute('data-action', 'Remove');
                    button.innerHTML = '<i class="fa-solid fa-heart text-white text-xl"></i>'
                } else if(action === 'Remove'){
                    removeItemFromFavorites('person', tempResults[index].id)
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