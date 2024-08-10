import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
import sampleMovieDetails from './data/sampleMovieDetails.js'

const queryParams = getQueryParams()
const movieId = queryParams.id
let movieData = ''
let favoriteStatus = false
// const sampleMovieData = sampleMovieDetails.movie_data

//fetch initial data
async function getMovieDetails(){
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/movie_details?id=${movieId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            movieData = data.movie_data
            displayData(data.movie_data)
            displayCast(data.credits.cast)
            favoriteStatus = checkFavoriteStatus()
        }
    } catch (error) {
        console.log(error);
    }
}

const image = document.querySelector('#main-img')
const name = document.querySelector('#name')
const releaseDate = document.querySelector('#release_date')
const runtime = document.querySelector('#runtime')
const genres = document.querySelector('#genres')
const overview = document.querySelector('#overview')

function displayData(data){
    image.src = data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : '../images/no-image-1.png'
    image.alt = data.title
    name.textContent = data.title
    releaseDate.textContent = data.release_date
    runtime.textContent = data.runtime
    genres.textContent = genreString(data.genres)
    overview.textContent = data.overview
}

const castCardContainer = document.querySelector('#cast-card-container')

function displayCast(arr){
    castCardContainer.innerHTML = ''
    
    const html = arr.map((castMember) => {
        const imageUrl = castMember.profile_path ? `https://image.tmdb.org/t/p/w500/${castMember.profile_path}` : '../images/no-image-1.png'
        return `
            <a href="/person-details.html?id=${castMember.id}" class="border">
                <img src="${imageUrl}" alt="${castMember.name}" class="h-[100px] w-[100px]">
                <div>${castMember.name}</div>
            </a>
        `
    }).join('')

    castCardContainer.innerHTML = html
}

getMovieDetails()
// displayData(sampleMovieDetails.movie_data)
// displayCast(sampleMovieDetails.credits.cast)

function genreString(genres){
    let str = ''
    for(const genre of genres){
        str += genre.name
    }
    return str
}

//add to favorites section
const favoriteButton = document.querySelector('#favorite-btn')

const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

//check favorite status for movie
async function checkFavoriteStatus(){
    if(localStorage.getItem('userInfo') && token){
        const response = await fetch(`${config.apiBaseUrl}/users/favorite_status?type=movie&id=${movieData.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = data.status
            setFavoriteButton()
        }
    }
    setFavoriteButton()
    return false
}

favoriteButton.addEventListener('click', async () => {
    if(localStorage.getItem('userInfo') && !favoriteStatus){
        
        const response = await fetch(`${config.apiBaseUrl}/users/add_movie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: movieData.title,
                id: movieData.id,
                image: movieData.poster_path,
                genres: movieData.genres,
                release_date: movieData.release_date
            })
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = true
            setFavoriteButton()
        } else {
            const error = await response.json()
            console.log(error);
        }
    } else if(localStorage.getItem('userInfo') && favoriteStatus) {
        //remove from favorites
        const response = await fetch(`${config.apiBaseUrl}/users/delete_item?type=movie&id=${movieData.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            favoriteStatus = false
            setFavoriteButton()
        } else {
            const error = await response.json()
            console.log(error);
        }
    } else {
        window.location.href = `/login.html`
    }
})

//change the button in the frontend based on favorite status
function setFavoriteButton(){
    if(favoriteStatus){
        favoriteButton.textContent = 'Remove from Favorites'
    } else {
        favoriteButton.textContent = 'Add to Favorites'
    }
}
