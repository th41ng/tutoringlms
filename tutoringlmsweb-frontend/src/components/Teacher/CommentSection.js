import React, { useState, useEffect } from "react";
import { authApis, endpoints } from "../configs/Apis";

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");

    const loadComments = async () => {
        try {
            const res = await authApis().get(endpoints.getCommentsByPost(postId));
            setComments(res.data);
        } catch (err) {
            console.error("Lỗi khi tải bình luận:", err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        try {
             await authApis().post(endpoints.createComment, {
                postId,
                content
            });
            setContent("");
            loadComments();
        } catch (err) {
            console.error("Lỗi khi đăng bình luận:", err);
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    return (
        <div>
            <form onSubmit={handleComment}>
                <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Bình luận..." />
                <button type="submit">Gửi</button>
            </form>
            <ul>
                {comments.map(c => (
                    <li key={c.id}>
                        <b>{c.author.username}</b>: {c.content}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
