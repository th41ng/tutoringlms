# encode_faces.py
import face_recognition
import pickle
import os

known_faces_dir = "known_faces"
encodings = []
names = []

for filename in os.listdir(known_faces_dir):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        name = os.path.splitext(filename)[0]
        filepath = os.path.join(known_faces_dir, filename)

        image = face_recognition.load_image_file(filepath)
        face_enc = face_recognition.face_encodings(image)

        if face_enc:
            encodings.append(face_enc[0])
            names.append(name)
            print(f"[✔] Encoded {name}")
        else:
            print(f"[✘] Không tìm thấy mặt trong {filename}")

with open("encodings.pickle", "wb") as f:
    pickle.dump({"encodings": encodings, "names": names}, f)

print("✅ Done encoding.")
# encode_faces.py
import face_recognition
import pickle
import os

known_faces_dir = "known_faces"
encodings = []
names = []

for filename in os.listdir(known_faces_dir):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        name = os.path.splitext(filename)[0]
        filepath = os.path.join(known_faces_dir, filename)

        image = face_recognition.load_image_file(filepath)
        face_enc = face_recognition.face_encodings(image)

        if face_enc:
            encodings.append(face_enc[0])
            names.append(name)
            print(f"[✔] Encoded {name}")
        else:
            print(f"[✘] Không tìm thấy mặt trong {filename}")

with open("encodings.pickle", "wb") as f:
    pickle.dump({"encodings": encodings, "names": names}, f)

print("✅ Done encoding.")
