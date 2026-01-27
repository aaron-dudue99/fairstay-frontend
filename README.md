# FairStay

**Clear, fair rental records for landlords and tenants.**

FairStay is a lightweight rental record management system designed for informal and semi-formal housing markets where agreements and rent payments are often undocumented.  
It helps landlords and tenants maintain a **shared, neutral record** of agreements and payments to reduce misunderstandings and disputes.

---

## 🌍 Problem

In many rental markets:

- Agreements are verbal or informal
- Rent payments lack consistent receipts
- Disputes arise due to missing or conflicting records

FairStay does **not enforce** agreements.  
It simply provides a **clear, time-stamped history** that both parties can rely on.

---

## ✨ What FairStay Does

- Phone-based authentication (OTP)
- Digital rental agreements (non-legal)
- Immutable rent payment records
- Receipt generation
- Role-based access (Landlord / Tenant)
- Clear audit timelines

> FairStay records facts — it does not judge or enforce.

---

## 🧱 Monorepo Structure

This repository uses a **monorepo** approach to keep the full product in one place.
fairstay/
├── backend/ # Spring Boot API
├── frontend/ # Angular application
├── docs/ # Branding, diagrams, screenshots
└── README.md

---

## 🛠️ Tech Stack

### Backend

- Java 21+
- Spring Boot
- Spring Security (JWT)
- PostgreSQL
- Flyway (DB migrations)

### Frontend

- Angular
- TypeScript
- Tailwind CSS
- Angular Reactive Forms

---

## 🧠 Architecture Highlights

- Feature-based package structure
- Strong domain modeling (Lease, Payment, Agreement)
- Append-only payment records (no edits or deletes)
- Ownership-based authorization
- Agreement acceptance workflow
- Multi-currency support without auto-conversion

---

## 🔐 Disclaimer

FairStay is a **record-keeping system only**.  
It does **not** provide legal enforcement, arbitration, or financial guarantees.

---

## 🚧 Project Status

This project is currently under active development, will update this section when it's complete

Some integrations (SMS, mobile money) are intentionally mocked or simulated.

---

## 📸 Screens & Branding

Branding and UI mockups are available in the `/docs` directory.

---

## 🗺️ Roadmap (High Level)

- [ ] Core backend domain & APIs
- [ ] Angular role-based UI
- [ ] Receipt PDF generation
- [ ] Dispute workflow
- [ ] Offline/PWA support
- [ ] Payment provider integrations (future)

---

## 👤 Author

Built by **Duduzile Sibanda**  
Full-stack developer focused on building practical, trust-aware systems.

---

## 📄 License

This project is for educational and demonstration purposes.
