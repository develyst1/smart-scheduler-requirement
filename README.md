# smart-scheduler-requirement

**ศูนย์รวม requirement (Requirement Hub)** ของโปรเจค Smart Tutoring Scheduler — Option C (Ultimate)
เปิดไฟล์เดียวเข้าใจทั้งระบบได้ โดยไม่ต้องเปิดไฟล์ต้นฉบับ

## เปิดยังไง

เปิด **[requirement.html](requirement.html)** ในเบราว์เซอร์ — เป็นหน้าเดียวรวม:
- **Workflows (WF) → Use Cases (UC) → Screens (SCR) → APIs → Test Cases (TC)** พร้อม ID + สีประจำชนิด
- ชี้เมาส์ที่ ID ใดๆ → จุดอื่นที่อ้าง ID เดียวกันไฮไลต์พร้อมกัน · คลิกเพื่อกระโดด
- แต่ละ Screen กด **View UI Mockup** เพื่อดูหน้าจอจริง (ฝังจาก `make-front/`)
- **Traceability Matrix** ท้ายหน้า — เห็นทั้งระบบรวดเดียว
- badge สถานะเทียบโค้ดจริง: **Implemented / Partial / Planned**

## โครงสร้าง

```
requirement.html          ← หน้า hub หลัก (เปิดอันนี้)
make-front/
  assets/                 ← style.css + comments.js (design system ร่วม)
  SCR-001.html … SCR-010  ← mockup จริงต่อหน้าจอ (มีกล่องคอมเมนต์ในตัว)
requirement-timeline.md   ← เอกสารต้นทาง (living spec) — DOC-001
propasal.md               ← ข้อเสนอ 3 ทางเลือก — DOC-002
start_phase.md            ← มัดจำ + เลือก Option C — DOC-003
source-pdf/               ← PDF ต้นฉบับ — DOC-004
```

## รวม ณ ปัจจุบัน

10 Workflows · 26 Use Cases · 10 Screens · 23 APIs · 14 Test Cases
Frontoffice (ตารางเรียน) + scheduling API เสร็จเป็นส่วนใหญ่ · LINE OA รอตั้ง Webhook URL · Backoffice API มีบางส่วน, UI ยังไม่เริ่ม

## คอมเมนต์บน mockup (ข้อจำกัดที่ต้องรู้)

กล่องคอมเมนต์ในแต่ละ `SCR-XXX.html` เก็บใน **localStorage ของเบราว์เซอร์เท่านั้น** — **ไม่** เขียนกลับลงไฟล์
ถ้าจะให้ AI แก้ตามคอมเมนต์ ต้องกด **📋 Copy All** (วางในแชท) หรือ **⬇ Export .md** (ดาวน์โหลดไฟล์ให้ AI อ่าน)

> `requirement.html` = **แผน (source of truth ของ requirement)** ไม่ใช่กระจกสะท้อนโค้ด — ถ้าโค้ดกับ requirement ไม่ตรง จะ flag ไว้ให้ตัดสินใจ ไม่แก้เงียบๆ
