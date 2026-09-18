---
name: technical-flow
description: Generate concise Technical Flow and Surrounding Systems list from PlantUML sequence diagrams according to strict System Analyst format rules and SALT Story Sizing standards.
---

# 🔄 Technical Flow Generator from Sequence Diagram

Skill ini digunakan untuk mengonversi **PlantUML Sequence Diagram** menjadi **Technical Flow** yang ringkas serta mengidentifikasi **Surrounding Systems** yang terlibat secara tepat dan konsisten berdasarkan standar **SALT & Pepper**.

---

## 🎯 Expected Output Format

Struktur keluaran WAJIB persis mengikuti format berikut:

```text
[Flow Name]

1. Frontend Web -> API Gateway
    GET /v1/example
2. API Gateway -> Backend Service
    GET /v1/example
3. (If condition)
    Backend Service -> TOG
    GET /example

Surrounding:

1. TOG
2. ESB
```

---

## 📜 Rules & Guidelines

### 1. Only Include System-to-System Communication
Ekstrak HANYA komunikasi antar-sistem:
- Frontend Web
- API Gateway
- Backend Service / Internal Microservices
- Other internal services
- Surrounding systems

**DILARANG memasukkan:**
- User -> Frontend interactions
- Frontend internal processing
- Backend internal processing
- Mapping
- Validasi internal
- Notes / Catatan
- Detail response payload
- Logika bisnis internal yang tidak melibatkan sistem lain

### 2. Database, Cache & Logging Must NEVER Be Included
Abaikan SEMUA interaksi yang melibatkan:
- DB (MySQL, PostgreSQL, Oracle, NoSQL API, etc.)
- Redis / In-memory Cache
- Query database (SELECT, INSERT, UPDATE, DELETE)
- Cache GET / SET / DEL operations
- Process Logging

*Contoh yang HARUS diabaikan:*
- `Backend Service -> DB`
- `DB -> Backend Service`
- `Backend Service -> Redis`
- `Redis -> Backend Service`

*Aturan Hitungan Sequence (Story Sizing):*
- Penyimpanan data *regular* (DB) dan Logging **TIDAK** dihitung sebagai sequence flow.
- Penyimpanan data *non-regular* seperti Object Storage / File System (MinIO, AWS S3) atau Message Broker **dihitung sebagai 1 Sequence**.
- Event Broker publishing dan consumption (Kafka, RabbitMQ) **dihitung sebagai Sequence**.
- Panggilan API hanya menghitung *Request*, bagian *Response* **TIDAK** dihitung sebagai sequence terpisah.
- Alur fungsi eksisting yang tidak terdampak diabaikan (gunakan `...` jika menandakan fungsi eksisting).

### 3. Frontend -> API Gateway
Sertakan panggilan API dari Frontend Web ke API Gateway.
- Gunakan HTTP method dan endpoint persis sesuai di sequence diagram.
*Contoh:*
```text
1. Frontend Web -> API Gateway
    GET /v1/order/history
```

### 4. API Gateway -> Backend Service
Sertakan panggilan API yang diteruskan dari API Gateway ke Backend Service.
*Contoh:*
```text
2. API Gateway -> Backend Service
    GET /v1/order/history
```
*Catatan:* Jika sequence diagram tidak menampilkan endpoint secara eksplisit pada panggilan Gateway -> Backend, gunakan endpoint dari panggilan Frontend -> API Gateway terkait jika jelas-jelas API yang sama.

### 5. Surrounding Systems Definition & Categorization
Semua partisipan/sistem di luar batas aplikasi utama (WEC Main Application/Services) dianggap sebagai **Surrounding System**.

*Daftar Komponen Eksternal (Surrounding Systems):*
- CO (Customer Order)
- ESB (Enterprise Service Bus)
- CRM
- DSC (Digital Sales Channel)
- Docman (Docman Repository Vault)
- Carina (Carina Notification / Care)
- Elisa / Elisa Invoice
- UPP (Universal Payment Platform)
- Isyana
- Gmaps / NBP / Libur Nasional
- Sistem eksternal / integrasi lainnya

*BUKAN Surrounding System (DILARANG dimasukkan ke daftar Surrounding):*
- Frontend Web
- API Gateway
- Internal Microservices WEC (`Order Service`, `Document Service`, `Auth Service`, `Link Service`, `Payment Service`, `Fallout Service`, `Failover Service`, dll.)
- DB (MySQL/PostgreSQL)
- Redis

### 6. Surrounding API Calls
Sertakan panggilan dari Backend Service / Internal Service ke Surrounding Systems.
*Contoh:*
```text
3. (If cache not found)
    Backend Service -> TOG
    GET /productDetail
```

### 7. Conditional / IF Flow Format
Jika komunikasi terjadi di dalam blok `alt`, `else`, `loop`, atau kondisi lainnya, sertakan kondisi secara LANGSUNG pada langkah terkait dalam tanda kurung `(If ...)`.

*Format yang Benar:*
```text
3. (If order status = ACTIVE)
    Backend Service -> TOG
    GET /transaction/status
```

*DILARANG menuliskan kondisi sebagai nomor terpisah:*
```text
❌ Salah:
3. If order status = ACTIVE
4. Backend Service -> TOG
    GET /transaction/status

✅ Benar:
3. (If order status = ACTIVE)
    Backend Service -> TOG
    GET /transaction/status
```

### 8. Multiple Conditions & Sub-Flows
Jika API Surrounding yang sama dipanggil di bawah kondisi berbeda, pertahankan kondisi tersebut secara terpisah jika mewakili cabang alur yang berbeda. Jika suatu user story memiliki beberapa aksi independen (misal: *Update* vs *Remove*), pisahkan menjadi sub-flow yang jelas (contoh: `[Flow Name] - [Action Name]`).

### 9. Surrounding List
Di bagian akhir, daftarkan setiap Surrounding System unik yang **benar-benar dipanggil** dalam alur sequence.

*Format:*
```text
Surrounding:

1. TOG
2. ESB
3. Elisa
```
*Catatan:* Jangan mendaftarkan surrounding system hanya karena ada di deklarasi participant PlantUML jika tidak pernah melakukan panggilan/interaksi.

Jika tidak ada Surrounding System yang dipanggil:
```text
Surrounding:

- None
```

### 10. Avoid Duplicate Surrounding Names
Jika suatu Surrounding System (misal TOG) dipanggil beberapa kali dalam alur, tuliskan HANYA 1 kali di daftar Surrounding.

### 11. Do Not Count Database / Redis as Surrounding
Berapapun banyaknya interaksi dengan DB atau Redis, mereka TIDAK BOLEH mempengaruhi jumlah atau daftar Surrounding.

### 12. Preserve API Details
Pertahankan detail endpoint secara presisi:
- HTTP method (GET, POST, PUT, DELETE, PATCH)
- Endpoint path
- Path parameters (contoh: `/v1/order/{order_id}`)
- Query parameters jika merupakan bagian dari endpoint API (contoh: `GET /v1/order/status?order_id={order_id}`)

### 13. Keep Output Concise & Clean
- **JANGAN** memberikan penjelasan alasan (reasoning).
- **JANGAN** mendeskripsikan mengapa call DB diabaikan, mengapa suatu sistem dianggap surrounding, logika bisnis internal, response mapping, atau detail validasi.
- HANYA tampilkan hasil akhir Technical Flow dan daftar Surrounding.
