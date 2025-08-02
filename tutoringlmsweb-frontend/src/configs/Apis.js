import axios from "axios";
import cookie from 'react-cookies';

const BASE_URL = 'http://localhost:8080/api/';

export const endpoints = {
    'register':'auth/register', 
    'login':'auth/login',
    'current_user': '/auth/me',

     // --- Dành cho Admin ---
    'list_users': 'admin/listUser',
    'create_user': 'admin/createUser',
    'edit_user': (id) => `admin/editUser/${id}`,
    'delete_user': (id) => `admin/deleteUser/${id}`,

     // --- Dành cho teacher ---
    "list_classes": "teacher/listClasses",
    "create_class": "teacher/createClasses",
    "edit_class": (classId) => `teacher/editClasses/${classId}`,
    "delete_class": (classId) => `teacher/deleteClasses/${classId}`
};

export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
            "Authorization": `Bearer ${cookie.load('token')}`
        }
    });
}

export default axios.create({
    baseURL: BASE_URL
});