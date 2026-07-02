# diagrams/ — PlantUML source (source of truth)

ไดอะแกรมของ Smart Scheduler เขียนด้วย [PlantUML](https://plantuml.com). ไฟล์ `.puml` ในโฟลเดอร์นี้
คือ **source of truth** — `requirement.html` ฝังสำเนาไว้ (section ⑧) และ render ผ่าน public server
`plantuml.com` ตอนเปิดในเบราว์เซอร์ (ต้องต่อเน็ต)

| ID | ไฟล์ | ชนิด | อธิบาย |
|----|------|------|--------|
| DIA-001 | `01-system-context.puml`      | component/deployment | 4 repos + shared PostgreSQL (`public.*`/`ops.*`) + LINE OA |
| DIA-002 | `02-usecases.puml`            | use case   | actors → UC-001…UC-026 แยกกลุ่ม scheduling / backoffice |
| DIA-003 | `03-erd.puml`                 | ERD        | ตารางจริงจาก `schema.ts` + สรุป `ops.*` + จุดเชื่อม cross-schema |
| DIA-004 | `04-booking-state.puml`       | state      | lifecycle ของ `booking_status` enum |
| DIA-005 | `05-seq-book-confirm.puml`    | sequence   | WF-001 จอง + ยืนยัน + LINE outbox → ครู |
| DIA-006 | `06-seq-conflict.puml`        | sequence   | WF-002 จองทับ + reschedule (ผู้ปกครองยืนยัน) |
| DIA-007 | `07-seq-checkin-leave.puml`   | sequence   | WF-004 เช็คอิน + ลา + auto-extend / Policy Lock |
| DIA-008 | `08-seq-wallet-integration.puml` | sequence | WF-009 wallet top-up + debit on ATTENDED (planned D.1) |

## ดู / แก้ไดอะแกรม

- **ในเบราว์เซอร์:** เปิด `../requirement.html` → เลื่อนไป section ⑧ (render อัตโนมัติ) หรือกด
  **Open in PlantUML editor** เพื่อเปิดใน editor ออนไลน์
- **ใน VS Code:** ติดตั้ง extension *PlantUML* แล้วกด `Alt+D` เพื่อ preview ไฟล์ `.puml`
- **สร้างรูปแบบไฟล์ (ต้องมี Java + Graphviz):**

  ```bash
  # ดาวน์โหลด plantuml.jar แล้ว:
  java -jar plantuml.jar -tsvg diagrams/*.puml     # ได้ .svg ข้างไฟล์
  java -jar plantuml.jar -tpng diagrams/*.puml
  ```

## แก้แล้วอย่าลืมซิงก์

`requirement.html` เก็บสำเนาโค้ด PlantUML ไว้ใน `<script type="text/plantuml">` ต่อการ์ด
ถ้าแก้ `.puml` ที่นี่ ให้ก็อปเนื้อหาไปวางในบล็อก `<script>` ของ DIA ที่ตรงกันด้วย (โครงสร้างเดียวกัน
ยกเว้นบรรทัด `@startuml <name>` ในไฟล์ ตัดเหลือ `@startuml` ในฝั่ง HTML)

> หมายเหตุ: ในไดอะแกรม **sequence** ใช้ `participant` แทน LINE (คีย์เวิร์ด `cloud` ใช้ได้เฉพาะ
> component/use-case diagram เท่านั้น — ถ้าใช้ใน sequence จะ error)
