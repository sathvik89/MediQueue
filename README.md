# MediQueue: Smart Hospital Queue & Appointment Management System
## Project Overview

MediQueue is a real-world hospital queue management system designed to digitize patient registration, appointment scheduling, and real-time queue tracking. The system addresses a critical problem in healthcare—long waiting times, inefficient manual token systems, and lack of visibility for both patients and doctors.

The platform enables patients to seamlessly book appointments, track their live queue position, and receive timely notifications. Doctors are provided with a dedicated dashboard to efficiently manage patient flow, consultations, and workload.

The system is built using modern web technologies and follows strong software engineering principles including Object-Oriented Programming (OOP), all five SOLID principles, and key design patterns such as Observer, Strategy, and Factory.



## Key Features

### Patient Module

* Register and login securely (JWT-based authentication)
* Book, reschedule, or cancel appointments
* View available doctors and time slots
* Track real-time queue position
* Receive live notifications for queue updates
* Access appointment history

### Doctor Module

* Manage availability and block time slots
* View and manage daily patient queue
* Call next patient with automated notifications
* Access patient details and medical history
* Write prescriptions and recommend follow-ups
* Mark consultations complete and update queue dynamically
* Handle emergency cases with priority override

### Admin Module

* Manage doctors (add/update/remove)
* Configure system-wide settings (timings, slot duration)
* View system analytics and operational overview



## Core System Workflows

### 1. Appointment Booking Flow

1. Patient selects a doctor
2. System fetches available time slots
3. Patient selects a slot and confirms booking
4. System assigns queue number and stores appointment

### 2. Live Queue & Consultation Flow

1. Doctor views today's queue
2. Doctor calls next patient
3. System sends notifications to patients
4. Doctor performs consultation and writes prescription
5. System updates queue and recalculates positions



## Tech Stack

### Frontend

* React.js
* TypeScript
* HTML, CSS

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* MongoDB (Mongoose)

### Tools & Technologies

* JWT Authentication
* WebSockets / Real-time Notifications
* REST APIs
* Git & GitHub



## 📂 Project Structure

```
MediQueue/
├── client/                  → React + TypeScript (Frontend)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│
├── server/                  → Node.js + Express + TypeScript (Backend)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── patterns/
│   │   ├── interfaces/
│   │   └── utils/
│
├── docs/                    → Project documentation
├── diagrams/                → UML diagrams
├── db/                      → Schema and ER diagrams
└── README.md
```



## Database Design

### Collections:

* **Users** – Handles authentication and roles (Patient, Doctor, Admin)
* **DoctorSchedules** – Stores availability and blocked time slots
* **Appointments** – Core queue and booking data
* **MedicalRecords** – Prescriptions, diagnosis, and history
* **SystemSettings** – Global configuration



## Architecture

![alt text](image.png)



## Design Principles & Patterns

### SOLID Principles

* **Single Responsibility Principle** – Separate services for authentication, appointments, notifications
* **Open/Closed Principle** – Easy to extend (e.g., adding new notification channels)
* **Liskov Substitution Principle** – Flexible role-based architecture
* **Interface Segregation Principle** – Clean separation of interfaces
* **Dependency Inversion Principle** – Services depend on abstractions

### Design Patterns

* **Observer Pattern**
  Used for real-time queue updates and notifications

* **Strategy Pattern**
  Enables flexible queue handling (FIFO, priority-based)

* **Factory Pattern**
  Used for scalable creation of appointment types



## Setup & Installation

### Prerequisites

* Node.js installed
* MongoDB installed or cloud instance (MongoDB Atlas)
* Git installed

### Clone the Repository

```
git clone https://github.com/your-username/MediQueue.git
cd MediQueue
```



## ▶️ Running the Project

### Backend Setup

```
cd server
npm install
npm run dev
```

### Frontend Setup

```
cd client
npm install
npm start
```



## Environment Variables

Create a `.env` file in the server directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```



## Scalability & Future Scope

* Load balancing across multiple doctors
* Caching for queue prediction and wait time estimation
* Integration with SMS/WhatsApp notifications
* Multi-hospital support
* AI-based patient prioritization



## 👥 Team Members & Contributions

| Name                | Contribution                                                                 |
|---------------------|------------------------------------------------------------------------------|
| Koriginja Sathvik   | Led system design, developed the complete codebase, and defined overall architecture |
| Pulumati Jagruthi   | Created system diagrams(usecase & class), managed GitHub repository, and designed interfaces  |
| Rashmi Anand        | Worked on system diagrams(ER & sequence) and defined entity structures within the codebase  |
| Kasula Lalithendra  | Contributed to development tasks and supported implementation across modules |
| Nachiket            | Assisted in development, integration, and overall project support            |



## 📄 License

This project is developed for academic and learning purposes.



##  Conclusion

MediQueue provides a scalable and efficient solution to modernize hospital queue systems. By combining real-time updates, structured appointment handling, and strong architectural principles, it significantly improves both patient experience and hospital efficiency.
