import config from "./utils/config.js";

const createListForm = document.querySelector('#create-list-form')
const errorMessage = document.querySelector('#error-message')

const token = localStorage.getItem('userInfo') 
? JSON.parse(localStorage.getItem('userInfo')).token
: '' 

createListForm.addEventListener('submit', async (e) => {
    try {
        e.preventDefault()
        const formData = new FormData(createListForm);
        const name = formData.get('name');
        const description = formData.get('description');

        const response = await fetch(`${config.apiBaseUrl}/users/create_list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                description,
            })
        })
        if(response.ok) {
            const data = await response.json()
            //re-route to list page
            window.location.href = `/list.html?id=${data.list._id}`
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.classList.remove('hidden')
    }
    
})