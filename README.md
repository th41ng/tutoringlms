1. Cài đặt công cụ cần thiết
- **C++ & CMake** (biên dịch module phụ trợ)  
- **Python 3.10+** (chạy AI/ML & scripts)  
- **Node.js 18+** (chạy frontend ReactJS)  
- **JDK 17 + SDK** (chạy backend Spring Boot trong IntelliJ)  
- **MySQL 8+** (tạo sẵn database `tutoringlms`)  

2. Chạy Backend (Spring Boot)
- Mở project trong **IntelliJ IDEA**  
- Chọn JDK/SDK đã cài đặt  
- Chạy trực tiếp bằng Maven:  
  bash
  mvn spring-boot:run
3. Chạy Frontend (ReactJS)
bash
Copy code
cd tutoringlms-frontend
npm install
npm start
👉 Truy cập tại: http://localhost:3000

4. Chạy Python (nhận diện khuôn mặt & scripts)
Cấu hình biến môi trường trong PyCharm (ví dụ: DB_USER, DB_PASS, API_KEY…)
Cài đặt thư viện
