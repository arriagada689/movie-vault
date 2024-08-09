import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
import sampleTvShowDetails from './data/sampleTvShowDetails.js'

const queryParams = getQueryParams()
const tvShowId = queryParams.id

//fetch initial data
async function getTvShowDetails(){
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/tv_show_details?id=${tvShowId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            // console.log(data);
            displayData(data.tv_data)
            displayCast(data.credits.cast)
        }
    } catch (error) {
        console.log(error);
    }
}



const image = document.querySelector('#main-img')
const name = document.querySelector('#name')
const releaseDate = document.querySelector('#release_date')
const genres = document.querySelector('#genres')
const overview = document.querySelector('#overview')

function displayData(data){
    image.src = data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : '../images/no-image-1.png'
    image.alt = data.name
    name.textContent = data.name
    releaseDate.textContent = data.first_air_date.substring(0, 4)
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

getTvShowDetails()
// displayData(sampleTvShowDetails.tv_data)
// displayCast(sampleTvShowDetails.credits.cast)

function genreString(genres){
    let str = ''
    for(const genre of genres){
        str += genre.name
    }
    return str
}
