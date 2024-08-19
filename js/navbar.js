//handle dynamic navbar
const rightSideNav = document.querySelector('#right-side-nav')

if(localStorage.getItem('userInfo')){
    rightSideNav.innerHTML = ''
    
    //create log out button
    const logoutButton = document.createElement('button')
    logoutButton.innerText = 'Log Out'
    logoutButton.addEventListener('click', logout)

    rightSideNav.innerHTML = `
        <a href="create-list.html" ${window.location.pathname.includes('create-list.html') ? 'class="bg-purple-700 text-white p-2 rounded-xl"' : ''}>Create List</a>
        <a href="profile.html" ${window.location.pathname.includes('profile.html') ? 'class="bg-purple-700 text-white p-2 rounded-xl"' : ''}>Profile</a>
    `
    rightSideNav.appendChild(logoutButton)

}

function logout() {
    localStorage.removeItem('userInfo')
    window.location.href = '/'
    rightSideNav.innerHTML = ''
    rightSideNav.innerHTML = `
        <a href="login.html">Log In</a>
        <a href="register.html">Register</a>
    `
}

const menuIcon = document.getElementById('menu-icon')
const sidebar = document.getElementById('sidebar')
const closeButton = document.getElementById('close-sidebar')

menuIcon.addEventListener('click', function() {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
});

closeButton.addEventListener('click', function() {
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
});

//dynamically render sidebar elements depending on logged in status
if(localStorage.getItem('userInfo')){
    const movieLink = document.createElement('a')
    movieLink.textContent = 'Movies'
    movieLink.href = 'movie.html'
    const tvLink = document.createElement('a')
    tvLink.textContent = 'TV Shows'
    tvLink.href = 'tv.html'
    const peopleLink = document.createElement('a')
    peopleLink.textContent = 'People'
    peopleLink.href = 'person.html'
    const createListLink = document.createElement('a')
    createListLink.textContent = 'Create List'
    createListLink.href = 'create-list.html'
    const profileLink = document.createElement('a')
    profileLink.textContent = 'Profile'
    profileLink.href = 'profile.html'
    const logoutButton = document.createElement('button')
    logoutButton.innerText = 'Log Out'
    logoutButton.addEventListener('click', logout)

    const bar = document.createElement('div')
    bar.className = 'h-[1px] bg-white w-full'
    const bar2 = document.createElement('div')
    bar2.className = 'h-[1px] bg-white w-full'
    const bar3 = document.createElement('div')
    bar3.className = 'h-[1px] bg-white w-full'
    const bar4 = document.createElement('div')
    bar4.className = 'h-[1px] bg-white w-full'
    const bar5 = document.createElement('div')
    bar5.className = 'h-[1px] bg-white w-full'
    const bar6 = document.createElement('div')
    bar6.className = 'h-[1px] bg-white w-full'

    sidebar.appendChild(movieLink)
    sidebar.appendChild(bar)
    sidebar.appendChild(tvLink)
    sidebar.appendChild(bar2)
    sidebar.appendChild(peopleLink)
    sidebar.appendChild(bar3)
    sidebar.appendChild(createListLink)
    sidebar.appendChild(bar4)
    sidebar.appendChild(profileLink)
    sidebar.appendChild(bar5)
    sidebar.appendChild(logoutButton)
    sidebar.appendChild(bar6)
} else {
    const movieLink = document.createElement('a')
    movieLink.textContent = 'Movies'
    movieLink.href = 'movie.html'
    const tvLink = document.createElement('a')
    tvLink.textContent = 'TV Shows'
    tvLink.href = 'tv.html'
    const peopleLink = document.createElement('a')
    peopleLink.textContent = 'People'
    peopleLink.href = 'person.html'

    const loginLink = document.createElement('a')
    loginLink.textContent = 'Log In'
    loginLink.href = 'login.html'
    
    const bar = document.createElement('div')
    bar.className = 'h-[1px] bg-white w-full'

    const registerLink = document.createElement('a')
    registerLink.textContent = 'Register'
    registerLink.href = 'register.html'

    const bar2 = document.createElement('div')
    bar2.className = 'h-[1px] bg-white w-full'
    const bar3 = document.createElement('div')
    bar3.className = 'h-[1px] bg-white w-full'
    const bar4 = document.createElement('div')
    bar4.className = 'h-[1px] bg-white w-full'
    const bar5 = document.createElement('div')
    bar5.className = 'h-[1px] bg-white w-full'

    sidebar.appendChild(movieLink)
    sidebar.appendChild(bar)
    sidebar.appendChild(tvLink)
    sidebar.appendChild(bar2)
    sidebar.appendChild(peopleLink)
    sidebar.appendChild(bar3)
    sidebar.appendChild(loginLink)
    sidebar.appendChild(bar4)
    sidebar.appendChild(registerLink)
    sidebar.appendChild(bar5)
}