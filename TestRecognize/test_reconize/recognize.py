from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition, cv2, numpy as np, base64, pickle, cloudinary, cloudinary.uploader

app = Flask(__name__)
# Cho phép React (chạy ở cổng 3000) gọi API Flask
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

cloudinary.config(
  cloud_name="dxxwcby8l",
  api_key="448651448423589",
  api_secret="ftGud0r1TTqp0CGp5tjwNmkAm-A"
)

# Load encodings
try:
    with open("encodings.pickle", "rb") as f:
        data = pickle.load(f)
except:
    data = {"encodings": [], "names": []}

# Enroll nhiều ảnh
@app.route("/enroll", methods=["POST"])
def enroll():
    username = request.json["username"]
    images = request.json["images"]
    encodings_list = []
    for img_base64 in images:
        img_bytes = base64.b64decode(img_base64.split(",")[1])
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        enc = face_recognition.face_encodings(rgb)
        if enc:
            encodings_list.append(enc[0])
            cloudinary.uploader.upload(img_base64, folder=f"faces/{username}")
    for enc in encodings_list:
        data["encodings"].append(enc)
        data["names"].append(username)
    with open("encodings.pickle", "wb") as f:
        pickle.dump(data, f)
    return jsonify({"status": "success"})

# Nhận diện khuôn mặt
@app.route("/recognize", methods=["POST"])
def recognize():
    try:
        # Lấy ảnh base64 từ request
        img_data = request.json.get("image")
        if not img_data:
            return jsonify({"name": None, "confidence": 0, "error": "Không có dữ liệu ảnh"}), 400

        # Nếu có prefix data:image/jpeg;base64,... thì tách ra
        if "," in img_data:
            img_base64 = img_data.split(",")[1]
        else:
            img_base64 = img_data

        img_bytes = base64.b64decode(img_base64)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Nhận diện khuôn mặt
        boxes = face_recognition.face_locations(rgb)
        encodings = face_recognition.face_encodings(rgb, boxes)

        if not encodings:
            return jsonify({"name": None, "confidence": 0, "error": "Không tìm thấy khuôn mặt"}), 200

        for encoding in encodings:
            distances = face_recognition.face_distance(data["encodings"], encoding)
            if len(distances) == 0:
                return jsonify({"name": None, "confidence": 0, "error": "Chưa có dữ liệu khuôn mặt"}), 200

            min_distance = min(distances)
            best_idx = np.argmin(distances)
            name = data["names"][best_idx] if min_distance < 0.5 else None

            if name is None:
                return jsonify({"name": None, "confidence": 0, "error": "Khuôn mặt không nhận diện được"}), 200

            # Upload lên Cloudinary
            cloudinary_result = cloudinary.uploader.upload(
                "data:image/jpeg;base64," + img_base64,
                folder=f"attendance/{name}"
            )

            return jsonify({
                "name": name,
                "confidence": float(1 - min_distance),
                "imageUrl": cloudinary_result["secure_url"]
            })

        return jsonify({"name": None, "confidence": 0, "error": "Không nhận diện được"}), 200

    except Exception as e:
        print("Error in /recognize:", str(e))
        return jsonify({"name": None, "confidence": 0, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
