import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
import samplePersonDetails from './data/samplePersonDetails.js'

const image = document.querySelector('#main-img')
const name = document.querySelector('#name')
const biography = document.querySelector('#biography')
const actorContainer = document.querySelector('#actor-container')
const productionContainer = document.querySelector('#production-container')
const writingContainer = document.querySelector('#writing-container')
const favoriteButton = document.querySelector('#favorite-btn')
const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
const userListsContainer = document.querySelector('#user-list-container')
const listButton = document.getElementById('add-to-list-btn')

const queryParams = getQueryParams()
const personId = queryParams.id
let userListDropdown = false
let personData = ''
let favoriteStatus = false

//toggle user list dropdown
listButton.addEventListener('click', () => {
    userListDropdown = !userListDropdown
    if(userListDropdown){
        userListsContainer.classList.remove('hidden')
        userListsContainer.classList.add('flex')
    } else {
        userListsContainer.classList.remove('flex')
        userListsContainer.classList.add('hidden')
    }
})

//fetch initial data
async function getPersonDetails(){
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/person_details?id=${personId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            // console.log(data);
            personData = data.person_data
            displayData(data.person_data)
            displayCredits(data.credits_data)
            favoriteStatus = checkFavoriteStatus()
            getUserList()
        }
    } catch (error) {
        console.log(error);
    }
}

getPersonDetails()

function displayData(data){
    image.src = data.profile_path ? `https://image.tmdb.org/t/p/w500/${data.profile_path}` : '../images/no-image-1.png'
    image.alt = data.name
    name.textContent = data.name
    biography.textContent = data.biography
}

function displayCredits(results){
    actorContainer.innerHTML = ''
    productionContainer.innerHTML = ''

    //sort cast array based on date
    const actorSortedArray = sortByDate(results.cast)

    actorContainer.innerHTML = actorSortedArray.slice(0, 10).map((result) => {
        const link = result.media_type === 'movie' ? `/movie-details.html?id=${result.id}` : `/tv-show-details.html?id=${result.id}`
        let year
        if(result.release_date) year = result.release_date.substring(0, 4)
        if(result.first_air_date) year = result.first_air_date.substring(0, 4)
        return `
            <div class="flex border-b border-gray-500 w-full h-[60px]">
                <div class="w-[60px]">${year}</div>
                <div class="w-screen">
                    <a href="${link}" class="font-bold hover:text-blue-700 line-clamp-1">${cutOffTitle(result.title || result.name)}</a>
                    <div class="text-gray-600 line-clamp-1">${result.character ? `as <span class="text-black">${result.character}</span>` : ''}</div>
                </div>          
            </div>
        `
    }).join('')

    if(actorSortedArray.length === 0) actorContainer.innerHTML = '<div>No data to display</div>'

    const productionArray = results.crew.filter(item => item.department === 'Production');
    const writingArray = results.crew.filter(item => item.department === 'Writing');
    const productionSortedArray = sortByDate(productionArray)
    const writingSortedArray = sortByDate(writingArray)

    productionContainer.innerHTML = productionSortedArray.slice(0, 10).map((result) => {
        const link = result.media_type === 'movie' ? `/movie-details.html?id=${result.id}` : `/tv-show-details.html?id=${result.id}`
        let year
        if(result.release_date) year = result.release_date.substring(0, 4)
        if(result.first_air_date) year = result.first_air_date.substring(0, 4)
        // console.log(result);
        return `
            <div class="flex border-b border-gray-500 h-[60px]">
                <div class="w-[60px]">${year}</div>
                <div>
                    <a href="${link}" class="font-bold hover:text-blue-700 line-clamp-1">${cutOffTitle(result.title || result.name)}</a>
                    <div class="text-gray-600 line-clamp-1">${result.job ? `as <span class="text-black">${result.job}</span>` : ''}</div>
                </div>
            </div>
        `
    }).join('')

    if(productionSortedArray.length === 0) productionContainer.innerHTML = '<div>No data to display</div>'

    writingContainer.innerHTML = writingSortedArray.slice(0, 10).map((result) => {
        const link = result.media_type === 'movie' ? `/movie-details.html?id=${result.id}` : `/tv-show-details.html?id=${result.id}`
        let year
        if(result.release_date) year = result.release_date.substring(0, 4)
        if(result.first_air_date) year = result.first_air_date.substring(0, 4)
        return `
            <div class="flex border-b border-gray-500 h-[60px]">
                <div class="w-[60px]">${year || ''}</div>
                <div>
                    <a href="${link}" class="font-bold hover:text-blue-700 line-clamp-1">${cutOffTitle(result.title || result.name)}</a>
                    <div class="text-gray-600 line-clamp-1">${result.job ? `as <span class="text-black">${result.job}</span>` : ''}</div>
                </div>
            </div>
        `
    }).join('')

    if(writingSortedArray.length === 0) writingContainer.innerHTML = '<div>No data to display</div>'
}

function sortByDate(arr){
    return arr.sort((a, b) => {
        const dateA = a.release_date || a.first_air_date ? new Date(a.release_date || a.first_air_date).getTime() : 0;
        const dateB = b.release_date || b.first_air_date ? new Date(b.release_date || b.first_air_date).getTime() : 0;
        if (dateA && dateB) {
            return dateB - dateA;
        }
        if (dateA) return -1;
        if (dateB) return 1;
        return 0;
    })
}

favoriteButton.addEventListener('click', async () => {
    if(localStorage.getItem('userInfo') && !favoriteStatus){
        const response = await fetch(`${config.apiBaseUrl}/users/add_person`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: personData.name,
                id: personData.id,
                image: personData.profile_path,
                known_for_department: personData.known_for_department
            })
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = true
            setFavoriteButton()
            // console.log(data);
        } else {
            const error = await response.json()
            console.log(error);
        }
    } else if(localStorage.getItem('userInfo') && favoriteStatus){
        //remove from favorites
        const response = await fetch(`${config.apiBaseUrl}/users/delete_item?type=person&id=${personData.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = false
            setFavoriteButton()
        } else {
            const error = await response.json()
            console.log(error);
        }
    } else {
        window.location.href = `/login.html`
    }
}) 

async function checkFavoriteStatus() {
    if(localStorage.getItem('userInfo') && token){
        const response = await fetch(`${config.apiBaseUrl}/users/favorite_status?type=person&id=${personData.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = data.status
            setFavoriteButton()
        }
    }
    setFavoriteButton()
    return false
}

//change the button in the frontend based on favorite status
function setFavoriteButton(){
    if(favoriteStatus){
        favoriteButton.innerHTML = `<i class="fa-solid fa-heart text-lg"></i>
                                    <span class="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-sm p-1 rounded font-semibold text-nowrap">
                                        Add to favorites
                                    </span>`
    } else {
        favoriteButton.innerHTML = `<i class="fa-regular fa-heart text-lg"></i>
                                    <span class="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-sm p-1 rounded font-semibold text-nowrap">
                                        Remove from favorites
                                    </span>`
    }
}

//fetch users lists
async function getUserList(){
    if(localStorage.getItem('userInfo') && token){
        const response = await fetch(`${config.apiBaseUrl}/users/list_data/${personData.id}/person`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            displayUserLists(data)
        }
    }
}

function displayUserLists(lists){
    userListsContainer.innerHTML = ''

    let htmlContent = `
        <a href="create-list.html" class="w-full flex justify-between p-2 ${lists.length > 0 ? 'border-b' : ''}">Create List</a>
    `;

    htmlContent += lists.map((list, index) => {
        return `
            <button id="list-btn" value="${index}" class="w-full flex justify-between p-2 ${index !== lists.length - 1 ? 'border-b' : ''}">
                <div>${list.name}</div>
                <div>${list.status ? 'Remove' : 'Add'}</div>
            </button>
        `
    }).join('')

    userListsContainer.innerHTML = htmlContent

    document.querySelectorAll('#list-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            const index = button.value
            if(!lists[index].status){
                addPersonToList(lists[index]._id)
            } else {
                removePersonFromList(lists[index]._id)
            }
            lists[index].status = lists[index].status ? false : true
            button.childNodes[3].textContent = lists[index].status ? 'Remove' : 'Add'
        })
    })
}

async function addPersonToList(list_id){
    const response = await fetch(`${config.apiBaseUrl}/users/list_add_person`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            name: personData.name,
            id: personData.id,
            image: personData.profile_path,
            known_for_department: personData.known_for_department
        })
    })
    if(response.ok){
        const data = await response.json()
    } else {
        const error = await response.json()
        console.log(error);
    }
}

async function removePersonFromList(list_id){
    const response = await fetch(`${config.apiBaseUrl}/users/list_remove_item`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            id: personData.id,
            type: 'person'
        })
    })
    if(response.ok){
        const data = await response.json()
        
    } else {
        const error = await response.json()
        console.log(error);
    }
}

function cutOffTitle(str){
    if(str.length > 40 && window.innerWidth <= 430){
        return str.substring(0, 40) + '...'
    }
    return str
}