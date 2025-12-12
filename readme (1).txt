WordDee — แอปฝึกศัพท์ภาษาอังกฤษ

ฟีเจอร์หลัก

-   ระบบผู้ใช้หลายคน (Multi-user)
-   Username + Password
-   Avatar อักษรย่ออัตโนมัติ
-   Word of the Day
-   Quiz Mode
-   ระบบคะแนนและเลเวล
-   เชื่อมต่อ n8n สำหรับประเมินประโยคด้วย AI

การติดตั้ง Backend (FastAPI)

1.  สร้าง virtual environment
    python -m venv venv
2.  เปิดใช้งาน
    Windows: venv\Scripts\activate
3.  ติดตั้ง dependencies
    pip install fastapi uvicorn httpx
4.  รันเซิร์ฟเวอร์
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

การติดตั้ง Frontend (React + Vite)

1.  cd frontend
2.  npm install
3.  npm run dev เว็บจะเปิดที่ http://localhost:5173

การเชื่อมต่อ n8n

-   Workflow รับ Webhook → ส่งเข้า LLM → ส่ง JSON กลับ
-   ตัวอย่าง JSON

    { "score": 90, "level": "Intermediate", "suggestion": "...", "corrected_sentence": "..." }

โครงสร้างโปรเจกต์

    worddee/
      backend/
      frontend/
      n8n/
      README.txt

การใช้งาน

1.  เปิดเว็บและ Login
2.  เลือกหรือสร้างผู้ใช้
3.  ใช้ Word of the Day หรือ Quiz
4.  ระบบจะบันทึกคะแนนและเลเวลอัตโนมัติ

ปัญหาที่พบบ่อย

-   React error: ตรวจ API_BASE ให้ถูกต้อง
-   n8n ไม่ทำงาน: ตรวจพอร์ตและเปิด workflow เป็น Active
-   git push ไม่ได้: ใช้ git push --set-upstream origin main
