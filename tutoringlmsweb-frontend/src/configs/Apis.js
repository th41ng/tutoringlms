import axios from "axios";
import cookie from 'react-cookies';

const BASE_URL = 'http://localhost:8080/api/';

export const endpoints = {
    'register':'auth/register', 
    'login':'auth/login',

};

export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            "Authorization": `Bearer ${cookie.load('token')}`
        }
    });
}

export default axios.create({
    baseURL: BASE_URL
});