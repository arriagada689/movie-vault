const homeSearchForm = document.querySelector('#home-search-form')
const rightSideNav = document.querySelector('#right-side-nav')

homeSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputField = homeSearchForm.querySelector('input');
    const searchText = inputField.value;

    //re-route to search results page
    window.location.href = `search-results.html?query=${encodeURIComponent(searchText)}`
})

if(localStorage.getItem('userInfo')){
    rightSideNav.innerHTML = ''
    
    //create log out button
    const logoutButton = document.createElement('button')
    logoutButton.innerText = 'Log Out'
    logoutButton.addEventListener('click', logout)

    rightSideNav.innerHTML = `
        <a href="profile.html">Profile</a>
    `
    rightSideNav.appendChild(logoutButton)
}

function logout() {
    localStorage.removeItem('userInfo')
    rightSideNav.innerHTML = ''
    rightSideNav.innerHTML = `
        <a href="login.html">Log In</a>
        <a href="register.html">Register</a>
    `
}