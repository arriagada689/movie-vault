const config = {
    apiBaseUrl: window.location.hostname === '127.0.0.1' ?
    'http://localhost:5000/api'
    :
    'https://movie-vault-api.onrender.com/api'
}

export default config