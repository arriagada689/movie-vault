import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
// import sampleTvShowDetails from './data/sampleTvShowDetails.js'

const image = document.querySelector('#main-img')
const name = document.querySelector('#name')
const releaseDate = document.querySelector('#release_date')
const genres = document.querySelector('#genres')
const overview = document.querySelector('#overview')
const favoriteButton = document.querySelector('#favorite-btn')
const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
const castCardContainer = document.querySelector('#cast-card-container')
const creditsCardContainer = document.querySelector('#credits-card-container')
const userListsContainer = document.querySelector('#user-list-container')
const listButton = document.getElementById('add-to-list-btn')
const showAllCastButton = document.getElementById('show-all-cast-button')
const showAllCreditsButton = document.getElementById('show-all-credits-button')

const queryParams = getQueryParams()
const tvShowId = queryParams.id
let tvShowData = ''
let creditData = ''
let favoriteStatus = false
let userListDropdown = false
let creditsDropdown = false
let seeAllCast = false
let seeAllCredits = false

showAllCastButton.addEventListener('click', () => {
    //change wrapper classes
    seeAllCast = !seeAllCast
    if(seeAllCast){
        castCardContainer.className = 'flex gap-3 flex-wrap justify-around md:justify-start mt-3'
    } else {
        castCardContainer.className = "flex overflow-x-auto gap-x-3 pb-1"
    }
    //change button text
    showAllCastButton.textContent = seeAllCast ? 'Close' : 'Show All Cast'

    //run display function again with new condition (slice array)
    displayCast(creditData.cast)
})

showAllCreditsButton.addEventListener('click', () => {
    //change wrapper classes
    seeAllCredits = !seeAllCredits
    if(seeAllCredits){
        creditsCardContainer.className = 'flex gap-3 flex-wrap justify-around md:justify-start mt-3'
    } else {
        creditsCardContainer.className = "flex overflow-x-auto gap-x-3 pb-1"
    }
    //change button text
    showAllCreditsButton.textContent = seeAllCredits ? 'Close' : 'Show All Cast'

    //run display function again with new condition (slice array)
    displayCredits(creditData.crew)
})

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
async function getTvShowDetails(){
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/tv_show_details?id=${tvShowId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            console.log(data);
            tvShowData = data.tv_data
            creditData = data.credits
            displayData(data.tv_data)
            displayCast(data.credits.cast)
            displayCredits(data.credits.crew)
            favoriteStatus = checkFavoriteStatus()
            getUserList()
        }
    } catch (error) {
        console.log(error);
    }
}

getTvShowDetails()

function displayData(data){
    image.src = data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : '../images/no-image-1.png'
    image.alt = data.name
    name.textContent = data.name
    releaseDate.textContent = data.first_air_date.substring(0, 4)
    genres.innerHTML = ''
    genres.innerHTML = data.genres.map((genre, index) => {
        if(index === data.genres.length - 1){
            return `
                <div>${genre.name}</div>
            `
        } else {
            return `
                <div>${genre.name}</div>
                <i class="fa-solid fa-circle text-xs"></i>
            `
        }
    }).join('')
    overview.textContent = data.overview
}

function displayCast(arr){
    castCardContainer.innerHTML = ''
    if(arr.length <= 12){
        showAllCastButton.classList.add('hidden')
    }
    let tempArr = seeAllCast ? arr : arr.slice(0, 12)
    
    castCardContainer.innerHTML = tempArr.map((castMember) => {
        const imageUrl = castMember.profile_path ? `https://image.tmdb.org/t/p/w500/${castMember.profile_path}` : '../images/no-image-1.png'
        return `
            <a href="/person-details.html?id=${castMember.id}" class="rounded-lg border h-[320px] w-[160px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${castMember.name}" class="h-[225px] w-full rounded-t-lg">
                <div class="p-1 flex flex-col flex-grow">
                    <div class="line-clamp-2 font-semibold">${castMember.name}</div>
                    <div class="flex-grow"></div>
                    <div class="text-gray-700 line-clamp-2">${castMember.roles[0].character}</div>
                </div>
            </a>
        `
    }).join('')
}

function displayCredits(arr){
    creditsCardContainer.innerHTML = ''

    if(arr.length <= 12){
        showAllCreditsButton.classList.add('hidden')
    }

    let tempArr = seeAllCredits ? arr : arr.slice(0, 12)
    
    creditsCardContainer.innerHTML = tempArr.map((castMember) => {
        const imageUrl = castMember.profile_path ? `https://image.tmdb.org/t/p/w500/${castMember.profile_path}` : '../images/no-image-1.png'
        return `
            <a href="/person-details.html?id=${castMember.id}" class="rounded-lg border h-[320px] w-[160px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${castMember.name}" class="h-[225px] w-full rounded-t-lg">
                <div class="p-1 flex flex-col flex-grow">
                    <div class="line-clamp-2 font-semibold">${castMember.name}</div>
                    <div class="flex-grow"></div>
                    <div class="text-gray-700 line-clamp-2">${castMember.department}</div>
                </div>
            </a>
        `
    }).join('')
}

favoriteButton.addEventListener('click', async () => {
    if(localStorage.getItem('userInfo') && !favoriteStatus){
        const response = await fetch(`${config.apiBaseUrl}/users/add_tv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: tvShowData.name,
                id: tvShowData.id,
                image: tvShowData.poster_path,
                genres: tvShowData.genres,
                first_air_date: tvShowData.first_air_date
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
        const response = await fetch(`${config.apiBaseUrl}/users/delete_item?type=tv&id=${tvShowData.id}`, {
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
        const response = await fetch(`${config.apiBaseUrl}/users/favorite_status?type=tv&id=${tvShowData.id}`, {
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
        const response = await fetch(`${config.apiBaseUrl}/users/list_data/${tvShowData.id}/tv`, {
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
                addTvShowToList(lists[index]._id)
            } else {
                removeTvShowFromList(lists[index]._id)
            }
            lists[index].status = lists[index].status ? false : true
            button.childNodes[3].textContent = lists[index].status ? 'Remove' : 'Add'
        })
    })
}

async function addTvShowToList(list_id){
    const response = await fetch(`${config.apiBaseUrl}/users/list_add_tv`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            name: tvShowData.name,
            id: tvShowData.id,
            image: tvShowData.poster_path,
            genres: tvShowData.genres,
            first_air_date: tvShowData.first_air_date
        })
    })
    if(response.ok){
        const data = await response.json()
    } else {
        const error = await response.json()
        console.log(error);
    }
}

async function removeTvShowFromList(list_id){
    const response = await fetch(`${config.apiBaseUrl}/users/list_remove_item`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            id: tvShowData.id,
            type: 'tv'
        })
    })
    if(response.ok){
        const data = await response.json()
        
    } else {
        const error = await response.json()
        console.log(error);
    }
}