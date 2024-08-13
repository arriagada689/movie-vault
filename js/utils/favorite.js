import { movieGenres, tvGenres } from "../data/genres.js"
import config from "./config.js"

const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

async function addItemToFavorites(type, data){
    //build object to send to backend
    let obj = {}
    if(type === 'movie'){
        //get genres from genre_ids
        let genres
        if(data.genre_ids){
            genres = getGenresByIds(data.genre_ids, movieGenres)
        } else {
            genres = data.genres
        }
        
        obj['title'] = data.title
        obj['id'] = data.id
        obj['image'] = data.poster_path
        obj['genres'] = genres
        obj['release_date'] = data.release_date
    } else if(type === 'tv'){
        //get genres from genre_ids
        let genres
        if(data.genre_ids){
            genres = getGenresByIds(data.genre_ids, tvGenres)
        } else {
            genres = data.genres
        }

        obj['name'] = data.name
        obj['id'] = data.id
        obj['image'] = data.poster_path
        obj['genres'] = genres
        obj['first_air_date'] = data.first_air_date
    } else if(type === 'person'){
        obj['name'] = data.name
        obj['id'] = data.id
        obj['image'] = data.profile_path
        obj['known_for_department'] = data.known_for_department
    }

    const response = await fetch(`${config.apiBaseUrl}/users/add_${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(obj)
    })
    if(response.ok){
        const data = await response.json()
        // favoriteStatus = true
        // setFavoriteButton()
    } else {
        const error = await response.json()
        console.log(error);
    }
}

async function removeItemFromFavorites(type, item_id){
    const response = await fetch(`${config.apiBaseUrl}/users/delete_item?type=${type}&id=${item_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if(response.ok){
        const data = await response.json()
        // favoriteStatus = false
        // setFavoriteButton()
    } else {
        const error = await response.json()
        console.log(error);
    }
}

function getGenresByIds(ids, genres) {
    return ids.map(id => {
        const genre = genres.find(genre => genre.id === id);
        return genre ? { id: genre.id, name: genre.name } : null;  
    }).filter(genre => genre !== null); 
}

export {
    addItemToFavorites,
    removeItemFromFavorites
}