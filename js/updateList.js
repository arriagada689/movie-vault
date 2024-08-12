import config from "./utils/config.js";
import getQueryParams from './utils/getQueryParams.js' 

const queryParams = getQueryParams() 
const id = queryParams.id

const updateListForm = document.querySelector('#update-list-form')
const errorMessage = document.querySelector('#error-message')

const token = localStorage.getItem('userInfo') 
? JSON.parse(localStorage.getItem('userInfo')).token
: '' 

//fetch list data to pre-fill input boxes
async function getListDetails(){
    const response = await fetch(`${config.apiBaseUrl}/users/list_prefill/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    if(response.ok){
        const data = await response.json()
        prefillData(data.name, data.description)
    } else {
        const error = await response.json()
        console.log(error);
    }
}

getListDetails()

const nameBox = document.querySelector('#name')
const descriptionBox = document.querySelector('#description')

function prefillData(name, description){
    nameBox.value = name
    descriptionBox.value = description
}

updateListForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(updateListForm);
    const name = formData.get('name');
    const description = formData.get('description');
    
    const response = await fetch(`${config.apiBaseUrl}/users/update_list`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id,
            name,
            description
        })
    })
    if(response.ok){
        const data = await response.json()
        
        //re-route to list details page
        window.location.href = `/list.html?id=${id}`
    } else {
        const error = await response.json()
        errorMessage.textContent = error.message
    }
})
