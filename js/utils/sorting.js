function sortResults(metric, arr){
    if(metric === 'popularity_desc'){
        return arr.sort((a, b) => b.popularity - a.popularity);
    } else if(metric === 'popularity_asc'){
        return arr.sort((a, b) => a.popularity - b.popularity);
    } else if(metric === 'rating_desc'){
        return arr.sort((a, b) => b.vote_average - a.vote_average);
    } else if(metric === 'rating_asc'){
        return arr.sort((a, b) => a.vote_average - b.vote_average);
    } else if(metric === 'release_date_desc'){
        return arr.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if(metric === 'release_date_asc'){
        return arr.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    } else if(metric === 'title_desc'){
        return arr.sort((a, b) => a.title.localeCompare(b.title));
    } else if(metric === 'title_asc'){
        return arr.sort((a, b) => b.title.localeCompare(a.title));
    }
}

function sortTvResults(metric, arr){
    if(metric === 'popularity_desc'){
        return arr.sort((a, b) => b.popularity - a.popularity);
    } else if(metric === 'popularity_asc'){
        return arr.sort((a, b) => a.popularity - b.popularity);
    } else if(metric === 'rating_desc'){
        return arr.sort((a, b) => b.vote_average - a.vote_average);
    } else if(metric === 'rating_asc'){
        return arr.sort((a, b) => a.vote_average - b.vote_average);
    } else if(metric === 'release_date_desc'){
        return arr.sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));
    } else if(metric === 'release_date_asc'){
        return arr.sort((a, b) => new Date(a.first_air_date) - new Date(b.first_air_date));
    } else if(metric === 'title_desc'){
        return arr.sort((a, b) => a.name.localeCompare(b.name));
    } else if(metric === 'title_asc'){
        return arr.sort((a, b) => b.name.localeCompare(a.name));
    }
}

export {
    sortResults,
    sortTvResults
}