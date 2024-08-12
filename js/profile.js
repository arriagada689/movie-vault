import config from './utils/config.js'

const userListsContainer = document.querySelector('#user-lists-container')

const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

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
        displayLists(data)
    } else {
        const error = await response.json()
        console.log(error);
    }
}

function displayLists(lists){
    userListsContainer.innerHTML = ''

    userListsContainer.innerHTML = lists.map(list => {
        return `
            <a href="/list.html?id=${list._id}">
                ${list.name}
            </a>
        `
    }).join('')
}

getProfileData()