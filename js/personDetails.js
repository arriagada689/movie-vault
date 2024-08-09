import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'
import samplePersonDetails from './data/samplePersonDetails.js'

const queryParams = getQueryParams()
const personId = queryParams.id

//fetch initial data
async function getPersonDetails(){
    try {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/person_details?id=${personId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            // console.log(data);
            displayData(data.person_data)
            displayCredits(data.credits_data)
        }
    } catch (error) {
        console.log(error);
    }
}

const image = document.querySelector('#main-img')
const name = document.querySelector('#name')
const biography = document.querySelector('#biography')

function displayData(data){
    image.src = data.profile_path ? `https://image.tmdb.org/t/p/w500/${data.profile_path}` : '../images/no-image-1.png'
    image.alt = data.name
    name.textContent = data.name
    biography.textContent = data.biography
}

const actorContainer = document.querySelector('#actor-container')
const productionContainer = document.querySelector('#production-container')
const writingContainer = document.querySelector('#writing-container')

function displayCredits(results){
    actorContainer.innerHTML = ''
    productionContainer.innerHTML = ''

    //sort cast array based on date
    const actorSortedArray = sortByDate(results.cast)

    const actorHtml = actorSortedArray.slice(0, 10).map((result) => {
        const link = result.media_type === 'movie' ? `/movie.html?id=${result.id}` : `/tv.html?id=${result.id}`
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png'
        return `
            <a href="${link}" class="border">
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[100px] w-[100px]">
                <div>${result.name || result.title}</div>
            </a>
        `
    }).join('')

    const productionArray = results.crew.filter(item => item.department === 'Production');
    const writingArray = results.crew.filter(item => item.department === 'Writing');
    const productionSortedArray = sortByDate(productionArray)
    const writingSortedArray = sortByDate(writingArray)

    const productionHtml = productionSortedArray.slice(0, 10).map((result) => {
        const link = result.media_type === 'movie' ? `/movie.html?id=${result.id}` : `/tv.html?id=${result.id}`
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png'
        return `
            <a href="${link}" class="border">
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[100px] w-[100px]">
                <div>${result.name || result.title}</div>
            </a>
        `
    }).join('')

    const writingHtml = writingSortedArray.slice(0, 10).map((result) => {
        const link = result.media_type === 'movie' ? `/movie.html?id=${result.id}` : `/tv.html?id=${result.id}`
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png'
        return `
            <a href="${link}" class="border">
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[100px] w-[100px]">
                <div>${result.name || result.title}</div>
            </a>
        `
    })

    actorContainer.innerHTML = actorHtml
    productionContainer.innerHTML = productionHtml
    writingContainer.innerHTML = writingHtml
}

function sortByDate(arr){
    return arr.sort((a, b) => {
        const dateA = a.release_date || a.first_air_date ? new Date(a.release_date || a.first_air_date).getTime() : 0;
        const dateB = b.release_date || b.first_air_date ? new Date(b.release_date || b.first_air_date).getTime() : 0;
        if (dateA && dateB) {
            return dateB - dateA;
        }
        if (dateA) return -1;
        if (dateB) return 1;
        return 0;
    })
}

getPersonDetails()
