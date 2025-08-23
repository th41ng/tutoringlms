import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";

const ForumDetail = () => {
  const { id } = useParams(); // forum ID
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  // Load posts + comments khi vào forum
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await authApis().get(endpoints.get_posts_by_class(id));
        setPosts(res.data);

        const allComments = {};
        for (let post of res.data) {
          const resCmt = await authApis().get(endpoints.get_comments_by_post(post.id));
          allComments[post.id] = resCmt.data;
        }
        setComments(allComments);
      } catch (err) {
        console.error("❌ Lỗi khi tải bài viết hoặc bình luận:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [id]);

  // Tạo bài viết mới
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await authApis().post(endpoints.create_post, {
        ...newPost,
        forumId: id,
      });
      setPosts((prev) => [res.data, ...prev]); // thêm bài viết mới lên đầu
      setNewPost({ title: "", content: "" });
    } catch (err) {
      console.error("❌ Lỗi khi tạo bài viết:", err);
    }
  };

  // Tạo bình luận
  const handleCreateComment = async (e, postId, content) => {
    e.preventDefault();
    try {
      const res = await authApis().post(endpoints.create_comment, {
        postId,
        content,
      });

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data],
      }));
    } catch (err) {
      console.error("❌ Lỗi khi tạo bình luận:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📌 Diễn đàn (ID: {id})</h2>

      {/* Form tạo bài viết */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">✍️ Tạo bài viết mới</h4>
          <form onSubmit={handleCreatePost}>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
              className="form-control mb-2"
            />
            <textarea
              placeholder="Nội dung"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
              className="form-control mb-2"
              rows={3}
            />
            <button className="btn btn-primary" type="submit">
              Đăng bài
            </button>
          </form>
        </div>
      </div>

      {/* Danh sách bài viết */}
      {loading ? (
        <p>⏳ Đang tải bài viết...</p>
      ) : (
        <>
          {posts.length === 0 ? (
            <p className="text-muted">Chưa có bài viết nào.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content}</p>
                  <small className="text-muted d-block mb-2">
                    Đăng bởi: <strong>{post.author?.lastName} {post.author?.firstName || "Ẩn danh"}</strong> |{" "}
                    {new Date(post.createdAt).toLocaleString()}
                  </small>

                  {/* Bình luận */}
                  <div className="mt-3">
                    <h6 className="mb-2">💬 Bình luận:</h6>
                    {comments[post.id]?.length > 0 ? (
                      <ul className="list-group mb-2">
                        {comments[post.id].map((cmt, idx) => (
                          <li key={idx} className="list-group-item">
                            <strong>{cmt.author?.lastName} {cmt.author?.firstName}:</strong> {cmt.content}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">Chưa có bình luận.</p>
                    )}

                    {/* Form tạo bình luận */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        const content = form.comment.value.trim();
                        if (content) {
                          handleCreateComment(e, post.id, content);
                          form.reset();
                        }
                      }}
                      className="d-flex gap-2"
                    >
                      <input
                        name="comment"
                        className="form-control"
                        placeholder="Viết bình luận..."
                        required
                      />
                      <button className="btn btn-secondary">Gửi</button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default ForumDetail;
