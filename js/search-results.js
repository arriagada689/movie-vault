import getQueryParams from './utils/getQueryParams.js'
import config from './utils/config.js'

const searchResultsWrapper = document.querySelector('#search-results-wrapper')
const homeSearchForm = document.querySelector('#search-form')
const paginationButtonsWrapper = document.querySelector('#pagination-buttons-wrapper')
const typeButtons = document.querySelectorAll('#type-button')

const tempData = {
    "page": 1,
    "results": [
        {
            "backdrop_path": "/86JnsgNpTI8XPVGwZhaIPojyyU.jpg",
            "id": 154770,
            "name": "Hello Saturday",
            "original_name": "你好，星期六",
            "overview": "\"Hello, Saturday\" is the rebranding of popular Chinese show \"Happy Camp\", hosted by He Jiong and with a fixed group of regular celebrity members.\n\nThe program showcases the talent of various stars as well as social topics through creative and diverse content and games. It aims to spread positive energy whilst keeping up with the current trends and leading youth culture.",
            "poster_path": "/1mUhxebaTKsX9OqJ1gkYpVR9uRa.jpg",
            "media_type": "tv",
            "adult": false,
            "original_language": "zh",
            "genre_ids": [
                10764
            ],
            "popularity": 328.516,
            "first_air_date": "2022-01-01",
            "vote_average": 4.5,
            "vote_count": 2,
            "origin_country": [
                "CN"
            ]
        },
        {
            "backdrop_path": "/lKsHyNJFr47Pgz3uxnnMqDU1bx0.jpg",
            "id": 1027497,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "An emotionally unavailable flight attendant meets a potential love interest and later finds out that her \"perfect guy\" has ulterior motives. As the clock ticks down on New Year's Eve, she must fight to keep her murdered ex-boyfriend's secrets or find herself dead.",
            "poster_path": "/ra2UvHNvZ1oaneSa96I48G4sQ9N.jpg",
            "media_type": "movie",
            "adult": false,
            "original_language": "en",
            "genre_ids": [
                18,
                53,
                10770
            ],
            "popularity": 7.088,
            "release_date": "2022-09-22",
            "video": false,
            "vote_average": 6.156,
            "vote_count": 157
        },
        {
            "backdrop_path": "/uhgJPxTZ9IpKgSAC9D73SJO0jik.jpg",
            "id": 1098152,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "During one of their night stays, three college teens play a silly prank where they randomly call people and tell them that they know who that person is and what they have done. What will happen when things take a dangerous turn?",
            "poster_path": "/8ta8VToSOykwgqI9iBqSE26SdWa.jpg",
            "media_type": "movie",
            "adult": false,
            "original_language": "gu",
            "genre_ids": [
                80,
                53
            ],
            "popularity": 3.439,
            "release_date": "2023-03-03",
            "video": false,
            "vote_average": 5.76,
            "vote_count": 48
        },
        {
            "backdrop_path": "/bNYxr3GGXRthtDRFCnloXO4r3xC.jpg",
            "id": 20365,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "Call-center workers receive a phone call from God.",
            "poster_path": "/qpN7Td4djkQp4vFDjaGGAWgueTQ.jpg",
            "media_type": "movie",
            "adult": false,
            "original_language": "hi",
            "genre_ids": [
                35
            ],
            "popularity": 10.599,
            "release_date": "2008-10-10",
            "video": false,
            "vote_average": 5.704,
            "vote_count": 125
        },
        {
            "backdrop_path": null,
            "id": 277875,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "Chandru's friends make fun of him as he does not have a girlfriend. He points out at a girl claiming that she is his girlfriend, due to which a number of unfortunate events take place in her life.",
            "poster_path": "/uA8i38ri4MpaWI3Lcy7fnWOIZMK.jpg",
            "media_type": "movie",
            "adult": false,
            "original_language": "ta",
            "genre_ids": [
                10749,
                18
            ],
            "popularity": 4.798,
            "release_date": "1999-11-06",
            "video": false,
            "vote_average": 6.581,
            "vote_count": 37
        },
        {
            "backdrop_path": null,
            "id": 245464,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "The film tells the story of three best friends named Ako, Aki and Awang, who are well-known in their village for their mischievous and humourous pranks. The trio work for Pak Man. One day, they are assigned to pick up his daughter Misha, who has just returned from overseas and dreams of becoming a doctor. The trio have been in love with her for a long time but she does not pay them any heed. When Misha is robbed by a snatch thief one day, she is rescued by a doctor named Shafiq. Her face reminds the doctor of his late wife, and he begins to pursue her, which annoys the trio.",
            "poster_path": null,
            "media_type": "movie",
            "adult": false,
            "original_language": "en",
            "genre_ids": [
                35
            ],
            "popularity": 3.66,
            "release_date": "2013-10-17",
            "video": false,
            "vote_average": 6.125,
            "vote_count": 60
        },
        {
            "backdrop_path": null,
            "id": 351406,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "In a digital world, can analogue find true love? It is the wise old gramaphone who has the answers for a lovesick loner.",
            "poster_path": "/vuRdRcQrii8PvoZhHwKlLyst0i2.jpg",
            "media_type": "movie",
            "adult": false,
            "original_language": "en",
            "genre_ids": [
                16,
                10402
            ],
            "popularity": 1.707,
            "release_date": "2003-04-24",
            "video": false,
            "vote_average": 6.097,
            "vote_count": 31
        },
        {
            "id": 3569485,
            "name": "hello",
            "original_name": "hello",
            "media_type": "person",
            "adult": false,
            "popularity": 0.001,
            "gender": 0,
            "known_for_department": "Acting",
            "profile_path": null,
            "known_for": [
                {
                    "backdrop_path": null,
                    "id": 203151,
                    "name": "슬기로운 탐구생활 2 (역사편)",
                    "original_name": "슬기로운 탐구생활 2 (역사편)",
                    "overview": "",
                    "poster_path": "/jzb0HJuI7nDHTg1BRIMnogi56Ck.jpg",
                    "media_type": "tv",
                    "adult": false,
                    "original_language": "ko",
                    "genre_ids": [],
                    "popularity": 0.056,
                    "first_air_date": "2021-08-03",
                    "vote_average": 0,
                    "vote_count": 0,
                    "origin_country": [
                        "KR"
                    ]
                }
            ]
        },
        {
            "backdrop_path": "/5mXjRXU8Fy36J6AQaaHiYwh4nxc.jpg",
            "id": 153581,
            "name": "Hello Again!",
            "original_name": "И снова здравствуйте!",
            "overview": "Animated comedy with Andrei Merzlikin about the adventures of the bandit Boris who rose from the dead. He awakens in the morgue and decides to reveal the secret of his own death, enlisting the help of a young medical trainee Artem. What is the avenger capable of, who has been in the other world and is eager to punish the killers? Boris is capable of a lot.",
            "poster_path": "/h44AoZWEO6xenzNBQ4dJWMeGKsn.jpg",
            "media_type": "tv",
            "adult": false,
            "original_language": "ru",
            "genre_ids": [
                35,
                80,
                18
            ],
            "popularity": 104.96,
            "first_air_date": "2022-02-02",
            "vote_average": 9.313,
            "vote_count": 16,
            "origin_country": [
                "RU"
            ]
        },
        {
            "backdrop_path": "/g0BuzftdxEAuqzzwitl6CiH9fVr.jpg",
            "id": 60006,
            "name": "Hello Counselor",
            "original_name": "안녕하세요",
            "overview": "A talk show with an emphasis on regular people, regardless of age or gender, that aims to help take down communication barriers by sharing stories about life.",
            "poster_path": "/1oSc9094tHH7JDpAWBgijKA6H4G.jpg",
            "media_type": "tv",
            "adult": false,
            "original_language": "ko",
            "genre_ids": [
                10764
            ],
            "popularity": 180.378,
            "first_air_date": "2010-11-22",
            "vote_average": 9,
            "vote_count": 2,
            "origin_country": [
                "KR"
            ]
        },
        {
            "backdrop_path": "/7YQ0EP7cqDgLZ9YhbqFf2Mc3EtE.jpg",
            "id": 112774,
            "name": "Hello Life",
            "original_name": "你好生活",
            "overview": "",
            "poster_path": "/rH96eGyuSgkkqptndYkdWsz40xr.jpg",
            "media_type": "tv",
            "adult": false,
            "original_language": "zh",
            "genre_ids": [
                10764
            ],
            "popularity": 72.87,
            "first_air_date": "2019-12-17",
            "vote_average": 0,
            "vote_count": 0,
            "origin_country": [
                "CN"
            ]
        },
        {
            "backdrop_path": "/8mLrIrvGpvE8V5uvu786w2D15P3.jpg",
            "id": 26815,
            "name": "Hello Anne: Before Green Gables",
            "original_name": "こんにちは アン ~Before Green Gables",
            "overview": "Anne Shirley goes through quite a lot of adventures before she ends up in Green Gables. She is living with a family and helps out by looking after the kids, helping in the chores around the home... Meanwhile she discovers more about who she is, that her name is \"Anne\" and not \"Ann\"... And she just is her adorable but a bit crazy self.",
            "poster_path": "/Ae24Axetj86vfHXYbd4J0ifIB7d.jpg",
            "media_type": "tv",
            "adult": false,
            "original_language": "ja",
            "genre_ids": [
                16,
                18,
                10751
            ],
            "popularity": 98.641,
            "first_air_date": "2009-04-05",
            "vote_average": 8.5,
            "vote_count": 10,
            "origin_country": [
                "JP"
            ]
        },
        {
            "backdrop_path": "/lJZPn6nSD0uUEgR23Mv3w5D6rtP.jpg",
            "id": 122111,
            "name": "Hello Mr. Gu",
            "original_name": "原来你是这样的顾先生",
            "overview": "A CEO with a phobia of crowds enters by accident a contractual marriage with a broke heiress. With opposing personalities, the two butt heads but eventually becomes each other's confidant. The two imperfect souls heal each other and fall in love.",
            "poster_path": "/Mq7H1cnZctl52lX5mMeG2VfM7U.jpg",
            "media_type": "tv",
            "adult": false,
            "original_language": "zh",
            "genre_ids": [
                18,
                35
            ],
            "popularity": 57.985,
            "first_air_date": "2021-03-30",
            "vote_average": 6.4,
            "vote_count": 11,
            "origin_country": [
                "CN"
            ]
        },
        {
            "backdrop_path": null,
            "id": 747851,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "Short animation film about the fear of singing in public",
            "poster_path": null,
            "media_type": "movie",
            "adult": false,
            "original_language": "en",
            "genre_ids": [
                16
            ],
            "popularity": 1.117,
            "release_date": "2020-09-25",
            "video": false,
            "vote_average": 6.725,
            "vote_count": 20
        },
        {
            "backdrop_path": "/y5ydDPtJPM7DgwxDXkM94XddNOm.jpg",
            "id": 1275516,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "A man peacefully sips his coffee, engrossed in a book, until a door suddenly swings open, revealing a dimly lit room.",
            "poster_path": "/nadCVFpBxsMFWjC4KGFiq4tGyx0.jpg",
            "media_type": "movie",
            "adult": false,
            "original_language": "en",
            "genre_ids": [
                27,
                35
            ],
            "popularity": 0.592,
            "release_date": "2024-04-15",
            "video": false,
            "vote_average": 7,
            "vote_count": 1
        },
        {
            "backdrop_path": "/kik5ZuXvgk5VQ54qfjL32KYGEHU.jpg",
            "id": 1101886,
            "title": "HELLO",
            "original_title": "HELLO",
            "overview": "Through a haze of smoke, coke, and booze; possible futures, pasts, and presents coalesce chaos inside the mind of a man drifting directionless through life. When your future calls, what will you have to say?",
            "poster_path": "/137qvAWKLN661ZQ3l1j14tWmU0D.jpg",
            "media_type": "movie",
            "adult": false,
            "original_language": "en",
            "genre_ids": [
                18
            ],
            "popularity": 2.187,
            "release_date": "2021-09-01",
            "video": false,
            "vote_average": 5.028,
            "vote_count": 18
        },
        {
            "backdrop_path": null,
            "id": 48764,
            "name": "Hello",
            "original_name": "Hello",
            "overview": "",
            "poster_path": null,
            "media_type": "tv",
            "adult": false,
            "original_language": "en",
            "genre_ids": [],
            "popularity": 0.001,
            "first_air_date": "",
            "vote_average": 0,
            "vote_count": 0,
            "origin_country": []
        },
        {
            "backdrop_path": "/nhFi3zziBL6oLD2goDLX8PSXap1.jpg",
            "id": 67014,
            "name": "Hello, My Twenties!",
            "original_name": "청춘시대",
            "overview": "With different personalities, life goals and taste in men, five female college students become housemates in a shared residence called Belle Epoque.",
            "poster_path": "/4MdSbKFGAzgFhF407e9fcZreqvm.jpg",
            "media_type": "tv",
            "adult": false,
            "original_language": "ko",
            "genre_ids": [
                35,
                18
            ],
            "popularity": 132.056,
            "first_air_date": "2016-07-22",
            "vote_average": 7,
            "vote_count": 120,
            "origin_country": [
                "KR"
            ]
        },
        {
            "backdrop_path": "/s5yCb288kfDyAJEuBg6RjhIV5v6.jpg",
            "id": 116045,
            "name": "Hello, Me!",
            "original_name": "안녕? 나야!",
            "overview": "Miserable and unsuccessful, a woman thinks she's lost all her spark — until one day, her spunky younger self appears in front of her demanding change.",
            "poster_path": "/8ZlKn5qEuv3wTzHyG4RSWJY81ec.jpg",
            "media_type": "tv",
            "adult": false,
            "original_language": "ko",
            "genre_ids": [
                18,
                10765,
                35
            ],
            "popularity": 57.262,
            "first_air_date": "2021-02-17",
            "vote_average": 7.4,
            "vote_count": 84,
            "origin_country": [
                "KR"
            ]
        },
        {
            "backdrop_path": null,
            "id": 1155225,
            "title": "Hello",
            "original_title": "Hello",
            "overview": "Produced by WGBH-TV in Boston, THE MEDIUM IS THE MEDIUM is one of the earliest and most prescient examples of the collaboration between public television and the emerging field of video art in the U.S. WGBH commissioned artists – Allan Kaprow, Nam June Paik, Otto Piene, James Seawright, Thomas Tadlock, and Aldo Tambellini – to create original works for broadcast television. Their works explored the parameters of the new medium, from image processing and interactivity to video dance and sculpture.",
            "poster_path": null,
            "media_type": "movie",
            "adult": false,
            "original_language": "en",
            "genre_ids": [],
            "popularity": 1.711,
            "release_date": "1969-01-01",
            "video": false,
            "vote_average": 4.938,
            "vote_count": 8
        }
    ],
    "total_pages": 59,
    "total_results": 1165
}

const queryParams = getQueryParams()
const searchQuery = queryParams.query

const page = queryParams && queryParams.page ? queryParams.page : 1
const type = queryParams && queryParams.type ? queryParams.type : ''

//hit the api with search query
if(searchQuery && searchQuery.length > 0){
    const fetchResultData = async () => {
        const response = await fetch(`${config.apiBaseUrl}/tmdb/search?query=${searchQuery}&page=${page}&type=${type}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            console.log(data);
            displayResults(data.results)
            setPagination(data.total_pages)
        } else {
            const error = await response.json()
            console.log(error)
        }
    }
    fetchResultData()
}

//display search results
function displayResults(results) {
    // Clear previous results
    searchResultsWrapper.innerHTML = '';

    if (!results || results.length === 0) {
        searchResultsWrapper.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Create a string with all the results' HTML
    const resultsHTML = results.map(result => {
        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image-1.png';
        return `
            <div>
                <img src="${imageUrl}" alt="${result.name || result.title}" class="h-[50px] w-[50px]">
                ${result.name || result.title}
            </div>
        `
    }).join('');

    searchResultsWrapper.innerHTML = resultsHTML;
}

//search bar submit
homeSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputField = homeSearchForm.querySelector('input');
    const searchText = inputField.value;

    //re-route to search results page
    window.location.href = `search-results.html?query=${encodeURIComponent(searchText)}`
})

//filter buttons
typeButtons.forEach((typeButton) => {
    typeButton.addEventListener('click', () => {
        //re-route to search results page
        window.location.href = `search-results.html?query=${encodeURIComponent(queryParams.query)}&type=${typeButton.value}`
    })
})

//pagination (create buttons dynamically and append to wrapper)
function setPagination(num) {
    paginationButtonsWrapper.innerHTML = ''
    if(page < num){
        const showMoreButton = document.createElement('button')
        showMoreButton.textContent = 'Show More'
        showMoreButton.addEventListener('click', () => paginationClick(Number(page) + 1))

        paginationButtonsWrapper.appendChild(showMoreButton)
    }
}

function paginationClick(page){
    window.location.href = `search-results.html?query=${encodeURIComponent(queryParams.query)}${type ? `&type=${type}` : ''}&page=${page}`
}

