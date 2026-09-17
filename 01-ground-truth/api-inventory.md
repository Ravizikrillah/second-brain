# API & Service Inventory: Ground Truth

> **Canonical System Truth (Tier 1 Production Code, YAML Configs, & Tier 2 IFAs)**  
> Authoritative, disambiguated registry strictly separating **Internal Microservice APIs** from **External Surrounding Systems**.

---

## 🏛️ System Boundary & IFA Classification Architecture

1. **🔌 Internal Microservice APIs (Owned / Inbound)**: Implemented directly within our codebase (`repo/backend/fmc-*`). Traffic flows inbound to our HTTP routers and gRPC servers from Frontend, APIGW, or internal peers.
2. **🌐 External Surrounding Systems (Outbound / Integrations / Third-Party IFAs)**: Enterprise core services (CO SOM, ESB, UPP, DSC, DigiPOS, CRM, Docman, Dukcapil, ISYANA). Our microservices act as clients calling outbound APIs, or receive incoming webhook callbacks.

---

## 🔌 Part 1: Internal Microservice APIs (Owned Services & Endpoints)

### 1.1 Microservice Topology & Port Allocations
| Microservice Name | Runtime | HTTP Port | gRPC Port | Primary Persistence | Core Responsibility | Source Provenance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

### 1.2 Active Internal Endpoints Registry

---

## 🌐 Part 2: External Surrounding Systems Catalog (Outbound IFAs & Webhooks)

### 2.1 Surrounding Systems Master Catalog
| System Code | System Name | Integration Role | Traffic Direction | Transport Protocol | Ownership Boundary | Authoritative Source Provenance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

### 2.2 External Endpoints & Integration Operations
