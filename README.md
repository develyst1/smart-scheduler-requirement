# smart-scheduler-requirement

**ศูนย์รวม requirement (Requirement Hub)** ของโปรเจค Smart Tutoring Scheduler — Option C (Ultimate)
เปิดไฟล์เดียวเข้าใจทั้งระบบได้ โดยไม่ต้องเปิดไฟล์ต้นฉบับ

> 📌 **แนวทาง as-built (reverse requirement):** repo นี้ทำ *หลังจาก* โปรเจคเริ่มไปแล้ว —
> UI mockup ใน `make-front/SCR-001…007` จึง **วาดจากแอปที่รันจริง** (`smart-scheduler-front`,
> Next.js 16 + Mantine v9) ไม่ใช่ wireframe ในจินตนาการ · ส่วนที่ยังไม่ได้สร้าง (LINE OA,
> backoffice) จะติดป้าย **Planned** ไว้ชัดเจน

## เปิดยังไง

เปิด **[requirement.html](requirement.html)** ในเบราว์เซอร์ — เป็นหน้าเดียวรวม:
- **★ Interactive Graph (แผนผังกราฟ)** ด้านบนสุด — โหนด `WF/UC/SCR/API/TC/DOC/DIA` เชื่อมกัน**อัตโนมัติ**จากความสัมพันธ์ในหน้า · สลับ **Flow ⇄ Web** · กรองตามชนิด/สถานะ · ค้นหา · คลิกโฟกัส + กระโดดไปการ์ด · **👤 โหมดลูกค้า** (ชื่อไทย ซ่อนรหัส) · **⬇ export PNG** — สำหรับ PM / Dev / โชว์ลูกค้า
- **Workflows (WF) → Use Cases (UC) → Screens (SCR) → APIs → Test Cases (TC)** พร้อม ID + สีประจำชนิด
- ชี้เมาส์ที่ ID ใดๆ → จุดอื่นที่อ้าง ID เดียวกันไฮไลต์พร้อมกัน · คลิกเพื่อกระโดด
- แต่ละ Screen กด **View UI Mockup** เพื่อดูหน้าจอจริง (ฝังจาก `make-front/`)
- **Traceability Matrix** ท้ายหน้า — เห็นทั้งระบบรวดเดียว
- **Diagrams (PlantUML)** ท้ายสุด — context / use-case / ERD / state / sequence (render ผ่าน plantuml.com, source อยู่ที่ `diagrams/*.puml`)
- badge สถานะเทียบโค้ดจริง: **Implemented / Partial / Planned**

## โครงสร้าง

```
requirement.html          ← หน้า hub หลัก (เปิดอันนี้)
make-front/
  assets/                 ← style.css + comments.js + app-skin.css (เลียนแบบ Mantine ของแอปจริง)
  SCR-001.html … SCR-007  ← as-built: วาดจากแอป smart-scheduler-front จริง (Next.js 16 + Mantine v9)
  SCR-008.html … SCR-010  ← planned: LINE OA / backoffice — ยังไม่มี UI จริง (mockup เชิงแนวคิด)
diagrams/                 ← PlantUML source (DIA-001…008) — source of truth ของไดอะแกรม
  README.md               ← วิธี render / regenerate
requirement-timeline.md   ← เอกสารต้นทาง (living spec) — DOC-001
propasal.md               ← ข้อเสนอ 3 ทางเลือก — DOC-002
start_phase.md            ← มัดจำ + เลือก Option C — DOC-003
source-pdf/               ← PDF ต้นฉบับ — DOC-004
```

## รวม ณ ปัจจุบัน

10 Workflows · 26 Use Cases · 10 Screens · 23 APIs · 14 Test Cases · 8 Diagrams
Frontoffice (ตารางเรียน) + scheduling API เสร็จเป็นส่วนใหญ่ · LINE OA ตั้ง Webhook URL แล้ว (บอทตอบกลับได้จริง) + CRM level/perks เสร็จ · Backoffice API มีบางส่วน, UI ยังไม่เริ่ม

## คอมเมนต์บน mockup (ข้อจำกัดที่ต้องรู้)

กล่องคอมเมนต์ในแต่ละ `SCR-XXX.html` เก็บใน **localStorage ของเบราว์เซอร์เท่านั้น** — **ไม่** เขียนกลับลงไฟล์
ถ้าจะให้ AI แก้ตามคอมเมนต์ ต้องกด **📋 Copy All** (วางในแชท) หรือ **⬇ Export .md** (ดาวน์โหลดไฟล์ให้ AI อ่าน)

> `requirement.html` = **แผน (source of truth ของ requirement)** ไม่ใช่กระจกสะท้อนโค้ด — ถ้าโค้ดกับ requirement ไม่ตรง จะ flag ไว้ให้ตัดสินใจ ไม่แก้เงียบๆ
