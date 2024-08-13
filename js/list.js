import config from "./utils/config.js"
import getQueryParams from './utils/getQueryParams.js' 

const queryParams = getQueryParams() 
const id = queryParams.id

let tempListItems = []

const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

async function getListDetails(){
    const response = await fetch(`${config.apiBaseUrl}/users/list_details/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    if(response.ok){
        const data = await response.json()
        tempListItems = data.list_items
        displayListDetails(data)
        displayListItems(data.list_items)
    } 
}

getListDetails()

const name = document.querySelector('#name')
const creator = document.querySelector('#creator')
const description = document.querySelector('#description')
const listItems = document.querySelector('#list-items')

function displayListDetails(data){
    name.textContent = data.name
    creator.textContent = JSON.parse(localStorage.getItem('userInfo')).username
    description.textContent = data.description
}

//can be movie, tv show, person
function displayListItems(items){
    listItems.innerHTML = ''

    listItems.innerHTML = items.map((item, index) => {
        let link = ''
        if(item.type === 'Movie'){
            link += `/movie-details.html?id=${item.id}`
        } else if(item.type === 'TV'){
            link += `/tv-show-details.html?id=${item.id}`
        } else if(item.type === 'Person'){
            link += `/person-details.html?id=${item.id}`
        }
        const imageUrl = item.image ? `https://image.tmdb.org/t/p/w500/${item.image}` : '../images/no-image-1.png';
        return `
            <a id="list-card-${index}" href="${link}">
                <img src="${imageUrl}" alt="${item.name || item.title}" class="h-[50px] w-[50px]">
                ${item.name || item.title}
                <button id="remove-btn" value="${index}" class="bg-red-400">Remove</button>
            </a>
        `
    }).join('')

    document.querySelectorAll('#remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            const index = button.value
            removeItemFromList(id, items[index].id, items[index].type.toLowerCase())
            const card = document.querySelector(`#list-card-${index}`)
            card.classList.add('hidden')
        })
    })
}

async function removeItemFromList(list_id, id, type){
    const response = await fetch(`${config.apiBaseUrl}/users/list_remove_item`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            list_id: list_id,
            id: id,
            type: type
        })
    })
    if(response.ok){
        const data = await response.json()
        
    } else {
        const error = await response.json()
        console.log(error);
    }
}

const updateLinkList = document.querySelector('#update-list-link')
updateLinkList.href = `/update-list.html?id=${id}`
