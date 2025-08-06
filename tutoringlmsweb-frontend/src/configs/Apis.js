import axios from "axios";
import cookie from 'react-cookies';

const BASE_URL = 'http://localhost:8080/api/';

export const endpoints = {
    'register': 'auth/register',
    'login': 'auth/login',
    'current_user': '/auth/me',

    //Dành cho Admin
    'list_users': 'admin/listUser',
    'create_user': 'admin/createUser',
    'edit_user': (id) => `admin/editUser/${id}`,
    'delete_user': (id) => `admin/deleteUser/${id}`,

    //Dành cho teacher
    "list_classes": "teacher/listClasses",
    "create_class": "teacher/createClasses",
    "edit_class": (classId) => `teacher/editClasses/${classId}`,
    "delete_class": (classId) => `teacher/deleteClasses/${classId}`,
    "class_detail": (classId) => `/teacher/classroom/${classId}`,
    // Assignment (cho giáo viên)
    "list_assignments": "assignments/all",
    "create_ESassignment": "assignments/createEssay",
    "create_MCassignment": "assignments/create-multiple-choice",
    "update_MCassignment": (id) => `assignments/multiple-choice/update/${id}`,
    "delete_MCassignment": (id) => `assignments/multiple-choice/delete/${id}`,
    "update_assignment": (id) => `assignments/update/${id}`,
    "delete_assignment": (id) => `assignments/delete/${id}`,
    "detail_MCassignment": (id) => `assignments/multiple-choice/${id}`,


    // Diễn đàn - Forum
    "get_all_forums": "forum/all",           // ✅ đúng path backend
    "get_my_class_forum": "forum/mine",
    "create_post": "forum/posts",
    "get_posts_by_class": (classId) => `forum/posts/classroom/${classId}`,
    "create_comment": "forum/comments",
    "get_comments_by_post": (postId) => `forum/comments/post/${postId}`,

    //Dành cho student
    "join_class": "student/joinClass",
    'student_classroom': 'student/classroom',
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