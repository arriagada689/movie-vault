import config from './utils/config.js'
import formatDate from './utils/formatDate.js'

const userListsContainer = document.querySelector('#user-lists-container')
const favoritesContainer = document.querySelector('#favorites-container')
const username = document.querySelector('#username')
username.textContent = JSON.parse(localStorage.getItem('userInfo')).username
// username.innerHTML = `
//     <div class="">List by: <span class="text-blue-500 font-semibold ml-2">${JSON.parse(localStorage.getItem('userInfo')).username}</span</div>
// `

const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

let tempArray = []
let favoritesFilter = ''

//fetch profile data
async function getProfileData(){
    const response = await fetch(`${config.apiBaseUrl}/users/profile`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if(response.ok){
        const data = await response.json()
        tempArray = data.favorites
        displayFavorites(data.favorites)
        displayLists(data.lists)
        displayStats(data.movie_count, data.tv_count, data.person_count)
    } else {
        const error = await response.json()
        console.log(error);
    }
}

getProfileData()

function displayLists(lists){
    userListsContainer.innerHTML = ''

    userListsContainer.innerHTML = lists.map(list => {
        return `
            <a href="/list.html?id=${list._id}" class="border-b border-gray-500 h-[60px] w-[90%]">
                <div class="font-bold hover:text-blue-700 line-clamp-1">${list.name}</div>
                <div># of items: ${list.list_items.length}</div>
            </a>
        `
    }).join('')
}

function displayFavorites(favorites){
    favoritesContainer.innerHTML = ''

    favoritesContainer.innerHTML = favorites.map((item, index) => {
        let link = ''
        if(item.type === 'Movie'){
            link += `/movie-details.html?id=${item.id}`
        } else if(item.type === 'TV'){
            link += `/tv-show-details.html?id=${item.id}`
        } else if(item.type === 'Person'){
            link += `/person-details.html?id=${item.id}`
        }
        const imageUrl = item.image ? `https://image.tmdb.org/t/p/w500/${item.image}` : '../images/no-image-1.png';
        let subLabel
        if(item.type === 'Movie' || item.type === 'TV'){
            subLabel = formatDate(item.release_date || item.first_air_date)
        } else {
            subLabel = item.known_for_department
        }
        return `
            <a href="${link}" class="rounded-lg border h-[305px] w-[150px] flex-shrink-0 flex flex-col justify-between relative group overflow-x-hidden">
                <img src="${imageUrl}" alt="${item.name || item.title}" class="h-[225px] w-full rounded-t-lg">
                <div class="p-1 flex flex-col flex-grow">
                    <div class="line-clamp-2 font-semibold">${item.name || item.title}</div>
                    <div class="flex-grow"></div>
                    <div class="text-gray-700">${subLabel}</div>
                </div>
                <button class="absolute top-0 right-0 bg-red-400 text-white p-2 hover:bg-red-300 hover:rounded-bl-xl" id="favorite-delete-btn" value="${index}"><i class="fa-solid fa-trash"></i></button>
            </a>
        `
    }).join('')

    document.querySelectorAll('#favorite-delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation()
            e.preventDefault()
            const index = button.value
            await removeItemFromFavorites(index)
            
            //dom manipulation
            tempArray.splice(index, 1)
            displayFavorites(tempArray)
        })
    })
}

const movieCount = document.querySelector('#movie-count')
const tvShowCount = document.querySelector('#tv-count')
const personCount = document.querySelector('#person-count')

function displayStats(num1, num2, num3){
    movieCount.textContent = num1
    tvShowCount.textContent = num2
    personCount.textContent = num3
}

const filterButtonsContainer = document.querySelectorAll('#filter-btn')
const xButton = document.getElementById('x-btn')

filterButtonsContainer.forEach(button => {
    button.addEventListener('click', () => {
        favoritesFilter = button.value
        //filter array and display new array
        const filteredArray = tempArray.filter(favorite => favorite.type === favoritesFilter)
        displayFavorites(filteredArray)

        //set all bg colors to default color
        filterButtonsContainer.forEach(button => {
            button.className = 'bg-yellow-400 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'
        })

        //make x button appear if filter clicked
        if(favoritesFilter.length > 0){
            xButton.classList.remove('hidden')
        }
        
        //change bg colors of buttons
        button.className = 'bg-yellow-600 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'
    })
})

xButton.addEventListener('click', () => {
    favoritesFilter = ''
    displayFavorites(tempArray)

    //set all bg colors to default color
    filterButtonsContainer.forEach(button => {
        button.className = 'bg-yellow-400 p-2 rounded-xl text-white font-semibold hover:bg-yellow-300'
    })

    //make x button disappear
    xButton.classList.add('hidden')
})

async function removeItemFromFavorites(index){
    //remove from favorites
    const response = await fetch(`${config.apiBaseUrl}/users/delete_item?type=movie&id=${tempArray[index].id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if(response.ok){
        const data = await response.json()
    } else {
        const error = await response.json()
        console.log(error);
    }
}