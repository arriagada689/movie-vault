import config from "./utils/config.js";

const loginForm = document.querySelector('#login-form')
const errorMessage = document.querySelector('#error-message')

loginForm.addEventListener('submit', async (e) => {
    try {
        e.preventDefault()
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        const response = await fetch(`${config.apiBaseUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            })
        })
        if(response.ok) {
            const data = await response.json()
            //re-route to home page
            window.location.href = '/'
            //set local storage
            localStorage.setItem('userInfo', JSON.stringify(data))
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.classList.remove('hidden')
    }
    
})