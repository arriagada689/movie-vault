import config from "./utils/config.js"

const deleteButton = document.querySelector('#delete-btn')
const goBackButton = document.getElementById('go-back')

goBackButton.addEventListener('click', () => {
    window.history.back()
})

const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

deleteButton.addEventListener('click', async () => {
    const response = await fetch(`${config.apiBaseUrl}/users/delete_profile`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if(response.ok){
        const data = await response.json()
        localStorage.removeItem('userInfo')
        window.location.href = '/'
    }
})