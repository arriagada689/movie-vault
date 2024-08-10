//handle dynamic navbar
const rightSideNav = document.querySelector('#right-side-nav')

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