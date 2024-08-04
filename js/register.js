import config from "./utils/config.js";

const registerForm = document.querySelector('form')
const errorMessage = document.querySelector('#error-message')

registerForm.addEventListener('submit', async (e) => {
    try {
        e.preventDefault()
        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const password = formData.get('password');
        const confirm_password = formData.get('confirm_password');

        const response = await fetch(`${config.apiBaseUrl}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                confirm_password
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
    }
    
})