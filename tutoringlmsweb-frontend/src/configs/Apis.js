    import axios from "axios";
    import cookie from "react-cookies";

    const BASE_URL = "http://localhost:8080/api/";

    export const endpoints = {
    // Auth
    register: "auth/register",
    login: "auth/login",
    currentUser: "auth/me",

    // Admin
    listUsers: "admin/listUser",
    createUser: "admin/createUser",
    editUser: (id) => `admin/editUser/${id}`,
    deleteUser: (id) => `admin/deleteUser/${id}`,

    // Teacher
    listClasses: "teacher/listClasses",
    createClass: "teacher/createClasses",
    editClass: (classId) => `teacher/editClasses/${classId}`,
    deleteClass: (classId) => `teacher/deleteClasses/${classId}`,
    classDetail: (classId) => `/teacher/classroom/${classId}`,
    classStudents: (classId) => `teacher/classroom/${classId}/students`,
    deleteStudent: (classId, studentId) => `teacher/classroom/${classId}/students/${studentId}`,

    // Assignments (Teacher)
    listAssignments: "assignments/all",
    createEssayAssignment: "assignments/createEssay",
    createMCAssignment: "assignments/create-multiple-choice",
    updateMCAssignment: (id) => `assignments/multiple-choice/update/${id}`,
    deleteMCAssignment: (id) => `assignments/multiple-choice/delete/${id}`,
    updateAssignment: (id) => `assignments/update/${id}`,
    deleteAssignment: (id) => `assignments/delete/${id}`,
    detailMCAssignment: (id) => `assignments/multiple-choice/${id}`,

    // Assignment submissions
    assignmentSubmissions: (assignmentId, type) => `assignments/${assignmentId}/submissions?type=${type}`,
    submitGrade: (assignmentId, studentId) => `assignments/${assignmentId}/submissions/${studentId}/grade`,

    // Payments (Teacher & Student)
    currentPaymentInfo: "class-payments/current",
    createPaymentAllClasses: "class-payments/create-all",
    classPaymentInfo: (classId) => `class-payments/class/${classId}`,
    studentCurrentPayment: (classId) => `payments/student/current/${classId}`,
    uploadPaymentProof: (classId) => `payments/upload-proof/${classId}`,
    paymentsTable: (classId) => `payments/class/${classId}/table`,
    togglePayment: (paymentId) => `payments/${paymentId}/toggle`,

    // Announcements
    createAnnouncement: "announcements/create",
    allAnnouncements: "announcements/all", 
    deleteAnnouncement: (id) => `announcements/delete/${id}`,
    updateAnnouncement: (id) => `announcements/update/${id}`,

    // Forum
    getAllForums: "forum/all",
    getMyClassForum: "forum/mine",
    createPost: "forum/posts",
    getPostsByClass: (classId) => `forum/posts/classroom/${classId}`,
    createComment: "forum/comments",
    getCommentsByPost: (postId) => `forum/comments/post/${postId}`,

    // Student
    joinClass: "student/joinClass",
    studentClassroom: "student/classroom",
    assignmentsByClass: (classId) => `submission/class/${classId}`,
    detailEssayAssignment: (id) => `submission/doEssay/${id}`,
    myEssaySubmission: (id) => `submission/myessay/${id}`,
    submitEssay: "submission/essay",
    detailMCAssignment: (id) => `submission/doMC/${id}`,
    myMCSubmission: (id) => `submission/mymc/${id}`,
    submitMC: (id) => `submission/multiple-choice?assignmentId=${id}`,

    // Attendance
    currentAttendanceSession: "attendance/current",
    attendanceSession: (sessionId) => `teacher/attendance/${sessionId}`,

    // Teacher stats
    teacherStats: "teacher/stats",
    };

    // Axios instance dùng token
    export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
        },
    });
    };

    // Axios default (không cần token)
    export default axios.create({
    baseURL: BASE_URL,
    });
