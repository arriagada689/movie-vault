import config from "./utils/config.js"
import getQueryParams from './utils/getQueryParams.js' 

const queryParams = getQueryParams() 
const id = queryParams.id

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

    listItems.innerHTML = items.map(item => {
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
            <a href="${link}">
                <img src="${imageUrl}" alt="${item.name || item.title}" class="h-[50px] w-[50px]">
                ${item.name || item.title}
            </a>
        `
    }).join('')
}

const updateLinkList = document.querySelector('#update-list-link')
updateLinkList.href = `/update-list.html?id=${id}`
