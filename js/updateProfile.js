import config from "./utils/config.js";

const updateProfileForm = document.querySelector('#update-profile-form')
const errorMessage = document.querySelector('#error-message')

const token = localStorage.getItem('userInfo') 
? JSON.parse(localStorage.getItem('userInfo')).token
: '' 

updateProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(updateProfileForm);
    const username = formData.get('username');

    const response = await fetch(`${config.apiBaseUrl}/users/update_profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            username
        })
    })
    if(response.ok){
        const data = await response.json()
        let newUserInfo = JSON.parse(localStorage.getItem('userInfo'))
        newUserInfo['username'] = username
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
        window.location.href = '/profile.html'

    } else {
        const error = await response.json()
        errorMessage.textContent = error.message
    }
})