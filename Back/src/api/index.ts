import axios from 'axios';
const api = axios.create({
    baseURL: 'https://economia.awesomeapi.com.br/json/last/',
    timeout: 10000
});

export default api;