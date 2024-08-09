import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
import sampleMovieDetails from './data/sampleMovieDetails.js'

const queryParams = getQueryParams()
const movieId = queryParams.id

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
            console.log(data);
            displayData(data.movie_data)
            displayCast(data.credits.cast)
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

// getMovieDetails()
displayData(sampleMovieDetails.movie_data)
displayCast(sampleMovieDetails.credits.cast)

function genreString(genres){
    let str = ''
    for(const genre of genres){
        str += genre.name
    }
    return str
}