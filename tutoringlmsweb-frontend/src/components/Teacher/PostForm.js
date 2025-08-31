import React, { useState } from "react";
import { authApis, endpoints } from "../configs/Apis";

const PostForm = ({ forumId, reload }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
              await authApis().post(endpoints.createPost, {  
                forumId,
                title,
                content
            });
            setTitle("");
            setContent("");
            reload();
        } catch (err) {
            console.error("Lỗi khi đăng bài:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề" required />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nội dung" required />
            <button type="submit">Đăng bài</button>
        </form>
    );
};

export default PostForm;
