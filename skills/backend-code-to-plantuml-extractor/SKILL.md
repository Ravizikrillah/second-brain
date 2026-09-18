---
name: backend-code-to-plantuml-extractor
description: Reverse engineer Go backend code (repo/backend/) and gRPC Protobuf definitions into detailed, exhaustive PlantUML sequence diagrams complying with WEC FMC standards.
---

# ⚙️ Backend Code to PlantUML Extractor (WEC FMC)

Skill ini digunakan untuk mereverse-engineer source code Golang pada `repo/backend/` dan definisi gRPC Protobuf menjadi **diagram sequence PlantUML (`.puml`) yang sangat detail dan lengkap** sesuai standar resmi dokumentasi WEC FMC.

---

## 📐 1. Persyaratan Kedalaman Diagram (Mandatory Exhaustive)

Agent **DILARANG KERAS** membuat diagram level tinggi yang disederhanakan (*high-level summary*). Diagram PlantUML yang diekstrak dari kode backend WAJIB mencakup seluruh rantai eksekusi:

1. **HTTP Controller & gRPC Server Layer (`internal/controller/http/v1/` & `internal/controller/grpc/`)**:
   - Binding path URL, query parameter, dan DTO request body.
   - Ekstraksi headers penting (`Device-Id`, `X-Auth-*`, `X-Channel-Id`, `X-Correlation-Id`, `Authorization Bearer`).
2. **Usecase & Business Logic Layer (`internal/usecase/`)**:
   - Logika bisnis lengkap (dekripsi JWT token, hashing/validasi password, query & update DB, increment counter, pengecekan expiry, evaluasi Growthbook feature flag).
   - Seluruh percabangan eksplisit (`alt / else / loop`).
3. **Data Layer & Infrastructure**:
   - Interaksi langsung ke RDBMS MySQL (`orders`, `transactions`) dan Redis Cluster (`GET / SET / DEL / Mutex Lock`).
   - Panggilan Message Broker (Amazon MQ / RabbitMQ Publish & Consume).
4. **Surrounding Systems & External APIs**:
   - API calls ke Customer Order (CO SOM), ESB, ELISA, ISYANA, UPP, DSC, Docman.
5. **Error & Fallout Branches**:
   - Seluruh blok penanganan error (`Unauthorized`, `EXPIRED`, `FALLOUT`, `ES1`–`ES19`) beserta format payload JSON responsenya.

---

## 🏢 2. Pemetaan 18 Canonical Golang Microservices & Alias

Gunakan nama microservice dan alias standar berikut dalam blok `box WEC #DBEEF3`:

| Microservice Folder | Package Name | Alias Standar | Peran / Domain |
|---|---|:---:|---|
| `service-fmc-auth` | `fmc-authentication` | `auth` | Auth, OTP, Session & JWT Token |
| `service-fmc-approval` | `fmc-approval` | `appr` | Approval Workflow & Contract Sign-off |
| `service-fmc-callback` | `fmc-callback` | `cb` | Async Webhook & Payment Callback |
| `service-fmc-command` | `fmc-command` | `cmd` | CQRS Command Dispatcher & Actions |
| `service-fmc-document` | `fmc-document` | `d` / `doc` | Dokumen PDF, OCR KTP & File Vault |
| `service-fmc-failover` | `fmc-failover` | `fail` | Circuit Breaker & Failover Recovery |
| `service-fmc-fallout` | `fmc-fallout` | `fall` | Fallout Engine & Incident Remediation |
| `service-fmc-fire-fighter` | `fmc-fire-fighter` | `ff` | Emergency Bypass & Critical Fixes |
| `service-fmc-smart-selfcare` | `fmc-smart-selfcare` | `self` | Profil Pelanggan & Self-Care |
| `service-fmc-address` | `fmc-master-address` | `addr` | Master Alamat & Cakupan ODP |
| `service-fmc-notification` | `fmc-notification` | `notif` | Push Notif, WhatsApp & SMS Dispatcher |
| `service-fmc-order` | `fmc-order` | `o` | Orchestrator Pesanan & State Machine |
| `service-fmc-payment` | `fmc-payment` | `p` | Payment Gateway & Inisiasi Billing |
| `service-fmc-product` | `fmc-product` | `prod` | Katalog Produk, Paket & Harga |
| `service-fmc-link` | `fmc-link` | `l` | Routing Link, Dynamic Deeplink & ES |
| `service-fmc-survey` | `fmc-survey` | `srv` | Site Survey & Appointment Teknisi |
| `service-fmc-tracking-order` | `fmc-tracking-order` | `track` | Tracking Pesanan Real-time |
| `service-fmc-utility-monitoring` | `fmc-utility-monitoring` | `mon` | Monitoring Infrastruktur & Health Check |

---

## 🎨 3. Header & Visual Skinparam Standar

Setiap diagram `.puml` hasil ekstraksi kode WAJIB diawali dengan konfigurasi standar:

```plantuml
@startuml
/' Auto-Generated from Codebase by WEC AI Documentation System '/
!theme plain
skinparam defaultFontName SansSerif
skinparam fontName SansSerif
skinparam TitleFontName SansSerif
skinparam FooterFontName SansSerif
skinparam minClassWidth 90
skinparam ActorFontStyle bold
skinparam DatabaseFontStyle bold
skinparam ParticipantFontStyle bold
skinparam QueueFontStyle bold
skinparam SequenceGroupBodyBackgroundColor transparent
skinparam SequenceGroupHeaderBackgroundColor transparent
hide unlinked

autonumber

title
[NAMA MODUL] - [NAMA FITUR / LOGIKA BACKEND]
end title

box WEC #DBEEF3
    participant "**Frontend** \n **Web**" as f
    participant "**API** \n **Gateway**" as a
    participant "**[Service Name]**" as [alias]
    database "**DB**" as db
    database "**Redis**" as r
    queue "**RabbitMQ**" as rb
end box

' External Surrounding Systems
participant "**CO**" as co
participant "**ELISA**" as elisa

...

@enduml
```

### Konvensi Logika Baru / Enhancement:
Bungkus logika baru atau enhancement fitur menggunakan blok berwarna peach `#F8D4AF`:
```plantuml
group #F8D4AF ENHANCEMENT [Sprint XX: Fitur Baru]
    [alias] -> db : SELECT ... WHERE is_sobi_tab = 1
    db --> [alias] : result rows
end
```

---

## 🛠️ 4. Prosedur Validasi Post-Generation

Setelah membuat atau mengedit file diagram `.puml`, pastikan sintaks valid:
1. Periksa kesesuaian penutupan tag (`@startuml` ... `@enduml`).
2. Periksa kesesuaian lifeline activation/deactivation.
3. Pastikan format response note menggunakan `#DDF4DD` untuk 200 OK dan `#FFCCCC` untuk error.
