# 🛠️ Workshop Management UI

A modern web frontend for a workshop/garage management system. It provides dashboards for **admins** and **clients**, allowing the workshop to manage customers, cars, and repair orders through a clean and responsive interface.

---

## ✨ Features

### 🧑‍💼 Admin
- 📊 Admin dashboard overview  
- 👥 Manage clients (list + details)  
- 🚗 Manage cars  
- 🔧 Manage repair orders  

### 🙋 Client
- 🏠 Client dashboard  
- ➕ Register a car  
- 📝 Request a repair  
- 📍 Track repair status  

---

## 🧰 Tech Stack
- ⚡ **Next.js** (App Router)
- 🟦 **TypeScript**
- 🎨 **Tailwind CSS**
- 🧩 **shadcn/ui**
- 🔗 **Axios**

---

## 🗂️ Project Structure

A quick overview of the most important folders and files:

workshop-management-ui/
│
├── app/ # Next.js App Router pages (routes)
│ ├── admin/ # Admin area pages
│ │ ├── dashboard/ # Admin dashboard
│ │ ├── clients/ # Client management (list + details)
│ │ ├── cars/ # Car management
│ │ └── repairs/ # Repair order management
│ │
│ ├── client/ # Client area pages
│ │ ├── dashboard/ # Client dashboard
│ │ ├── register-car/ # Register car page
│ │ ├── request-repair/ # Request a repair order
│ │ └── repair-status/ # Repair status tracking
│ │
│ ├── login/ # Login page
│ ├── register/ # Register page
│ ├── layout.tsx # Root layout
│ └── globals.css # Global styles
│
├── api/ # Axios API modules (backend requests)
│ ├── axios.ts # Axios instance + token configuration
│ ├── auth.ts # Login/register endpoints
│ ├── customer.ts # Client related endpoints
│ ├── cars.ts # Cars endpoints
│ └── repairs.ts # Repair orders endpoints
│
├── components/ # Reusable UI components
│ ├── ui/ # shadcn/ui components
│ ├── admin-layout.tsx # Admin layout wrapper
│ ├── client-dashboard.tsx # Client dashboard component
│ └── ... # Cards, tables, modals, forms, etc.
│
├── hooks/ # Custom React hooks
├── lib/ # Helpers & shared utilities
├── public/ # Static assets (images/icons)
└── package.json # Project dependencies & scripts

---

## 🚀 Getting Started

1) Install dependencies:
```bash
npm install
```
2) Run the development server:
 ```bash
npm run dev
```
2) Open in Browser
```
    http://localhost:3000
  ``` 
---

## 🔐 Backend API

This UI is designed to work with the Workshop Management System backend (Spring Boot + JWT authentication).
Make sure the backend is running and configure the API base URL if needed.

---

## 👨‍💻 Author

Developed by Andres Calvo
