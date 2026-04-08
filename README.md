# MediQueue

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)](./client)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-43853d)](./server)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47a248)](./server/src/models)

MediQueue is a smart hospital queue and appointment management system designed to digitize appointment booking, queue handling, consultation flow, and hospital-side coordination. The project centers on one idea: turn fragmented manual hospital operations into a structured digital workflow that is easier to manage, easier to extend, and easier to understand in code.

The current repository is strongest on the backend side. Its main value today lies in the domain modeling, design-pattern-driven architecture, and MongoDB-ready data layer that support the core hospital use cases.

## Table of Contents

- [Project Idea](#project-idea)
- [Core Actors and Use Cases](#core-actors-and-use-cases)
- [Current Project State](#current-project-state)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Backend Architecture](#backend-architecture)
- [Implemented Design Patterns](#implemented-design-patterns)
- [Data Models](#data-models)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Environment Variables](#environment-variables)
- [Project Diagrams](#project-diagrams)
- [Roadmap](#roadmap)

## Project Idea

MediQueue models a hospital workflow with three primary actors:

- `Patient`: register, log in, book appointments, track queue position, receive notifications, reschedule or cancel appointments, and view appointment history
- `Doctor`: manage availability, review the live queue, call the next patient, view patient details, write prescriptions, recommend follow-ups, mark consultations complete, and flag critical cases
- `Admin`: manage doctors, configure operational settings, view system-wide activity, and handle exceptional scheduling cases

The goal is not only to store hospital data, but to represent hospital behavior through a clean software architecture. That is why the project combines domain entities, explicit interfaces, reusable types, design patterns, and persistence models instead of relying only on plain CRUD structures.

## Core Actors and Use Cases

### Patient

- Register and log in
- Select a doctor and choose a time slot
- Book scheduled, walk-in, or emergency appointments
- View queue position
- Receive queue updates and reminders
- Reschedule or cancel appointments
- View appointment history

### Doctor

- Set availability
- Block time for breaks or emergencies
- View today's queue
- Call the next patient
- View patient details
- Write prescriptions
- Recommend follow-ups
- Mark consultation complete
- Review patient history
- Flag critical cases

### Admin

- Add or remove doctors
- Configure consultation rules and working hours
- View system overview
- Handle scheduling conflicts
- Override appointment cancellations when needed

## Current Project State

The repository currently has a much stronger backend foundation than frontend product implementation.

### What is implemented

- A TypeScript backend structure
- Express application bootstrap
- MongoDB connection setup using Mongoose
- Domain entities for users and appointments
- Interfaces for queue, users, appointments, and notifications
- Reusable shared system enums and value types
- Design pattern implementations for queue handling, notifications, and appointment creation
- MongoDB model definitions for the main hospital data objects
- UML and system analysis diagrams

### What is still early-stage

- The frontend is still a starter-level React and Vite shell
- API routes, controllers, and services are not fully implemented yet
- Authentication flow is not fully built out in the current codebase
- End-to-end hospital workflows are modeled in code but not yet exposed as a complete application experience

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- ESLint

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

### Design and Documentation

- Object-oriented design
- SOLID-oriented structure
- UML diagrams
- Use case modeling
- ER modeling
- design-pattern-based backend architecture

## Repository Structure

```text
MediQueue/
├── client/        # React + Vite frontend
├── server/        # Express + TypeScript backend
├── diagrams/      # Use case, class, sequence, and ER diagrams
└── README.md
```

### Frontend

The frontend lives in [client](/Users/jagruthipulumati/Desktop/sd/MediQueue/client). It is currently a lightweight React + Vite setup and should be viewed as the starting shell for the eventual hospital interface, not as the finished user-facing product.

### Backend

<<<<<<< HEAD
<<<<<<< HEAD
### Collections:

* **Users** – Handles authentication and roles (Patient, Doctor, Admin)
* **DoctorSchedules** – Stores availability and blocked time slots
* **Appointments** – Core queue and booking data
* **MedicalRecords** – Prescriptions, diagnosis, and history
* **SystemSettings** – Global configuration



## Architecture

![alt text](diagrams/architecture/architecture.png)



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
=======
The backend lives in [server](/Users/jagruthipulumati/Desktop/sd/MediQueue/server) and contains the architectural core of the project. This is where the hospital domain, queue behavior, design patterns, and MongoDB model definitions are currently concentrated.
=======
The backend lives in [server](/Users/jagruthipulumati/Desktop/sd/MediQueue/server). This is the most important and most developed part of the current project. It contains the domain model, queue behavior, design patterns, and MongoDB model layer that define the system architecture.
>>>>>>> 653ac0d (readme updated v3)

## Backend Architecture

The backend is organized to separate domain logic, contracts, persistence, and reusable behavior.

```text
server/src/
├── config/       # MongoDB connection setup
├── entities/     # Core hospital domain classes
├── interfaces/   # Contracts for appointments, queue, users, and notifications
├── models/       # MongoDB Mongoose schemas
├── patterns/     # Design pattern implementations
├── types/        # Shared enums and reusable types
└── index.ts      # Express server entry point
```

### Entities

The entity layer captures the core business objects used to model hospital operations.

Implemented entities:

- `User`
- `Patient`
- `Doctor`
- `Admin`
- `Appointment`
- `WalkInAppointment`
- `ScheduledAppointment`
- `EmergencyAppointment`

These live in [server/src/entities](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/entities) and represent the business side of the system before persistence concerns are introduced.

### Interfaces

The interface layer defines the contracts that shape queue management, notification delivery, appointments, and user roles.

Implemented interfaces:

- user interface
- patient interface
- doctor interface
- admin interface
- appointment interface
- queue observer interface
- queue subject interface
- queue strategy interface
- notification channel interface

These live in [server/src/interfaces](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/interfaces) and help keep the backend modular, readable, and easier to evolve.

### Shared Types

The shared types file in [server/src/types/system.types.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/types/system.types.ts) connects the rest of the backend through common enums and reusable value types.

It currently defines:

- user roles
- appointment types
- appointment statuses
- queue entry statuses
- doctor availability states
- notification types
- case priorities
- time slots
- queue entries and queue snapshots
- prescriptions and follow-up structures
- doctor daily summary structure

## Implemented Design Patterns

One of the strongest parts of the project is that the backend is not just a CRUD scaffold. It already applies multiple design patterns that fit the hospital queue and appointment domain.

### Factory Pattern

Implemented in [server/src/patterns/appointment_factory.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/patterns/appointment_factory.ts).

Purpose:

- create the correct appointment object based on appointment type
- avoid scattering appointment type checks throughout the application

Included classes:

- `WalkInFactory`
- `ScheduledFactory`
- `EmergencyFactory`
- `AppointmentFactoryProvider`

### Strategy Pattern

Implemented in [server/src/patterns/queue_strategy.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/patterns/queue_strategy.ts).

Purpose:

- allow queue ordering rules to change without rewriting queue manager logic
- support FIFO, priority-based handling, and round-robin style ordering

Included strategies:

- `FIFOQueueStrategy`
- `PriorityQueueStrategy`
- `RoundRobinQueueStrategy`

### Observer Pattern

Implemented in [server/src/patterns/queue_manager.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/patterns/queue_manager.ts) and [server/src/patterns/queue_observer.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/patterns/queue_observer.ts).

Purpose:

- notify observers when queue state changes
- support patient and doctor queue updates without tightly coupling queue logic to UI concerns

Included classes:

- `QueueManager`
- `PatientQueueObserver`
- `DoctorQueueObserver`

### Singleton Pattern

Implemented in [server/src/patterns/queue_registry.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/patterns/queue_registry.ts).

Purpose:

- maintain one shared registry of doctor queues across the application

Included class:

- `QueueRegistry`

### Adapter Pattern

Implemented in [server/src/patterns/notification_adapter.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/patterns/notification_adapter.ts).

Purpose:

- normalize different notification provider interfaces behind one application-facing contract

Included adapters:

- `EmailAdapter`
- `SmsAdapter`
- `PushAdapter`

### Composite Pattern

Implemented in [server/src/patterns/notification_composite.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/patterns/notification_composite.ts).

Purpose:

- send one notification event through multiple channels as a single grouped action

Included class:

- `NotificationGroup`

## Data Models

The MongoDB persistence layer lives in [server/src/models](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/models) and maps the hospital domain into storage-ready schemas.

### User Model

Defined in [server/src/models/user_model.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/models/user_model.ts).

Supports:

- patient profile data
- doctor profile data
- admin profile data
- role-based user storage in a single collection
- doctor availability data
- doctor management data for admins

### Appointment Model

Defined in [server/src/models/appointment_model.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/models/appointment_model.ts).

Supports:

- scheduled, walk-in, and emergency appointments
- appointment status tracking
- queue token and queue position mapping
- reschedule and cancellation metadata
- admin override details
- critical case flagging

### Queue Model

Defined in [server/src/models/queue_model.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/models/queue_model.ts).

Supports:

- per-doctor queue storage
- daily queue snapshots for each doctor
- live queue entries with token number, status, and priority
- tracking of waiting, called, in-progress, done, and missed patients

### Notification Model

Defined in [server/src/models/notification_model.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/models/notification_model.ts).

Supports:

- queue updates
- appointment reminders
- follow-up notifications
- general system messages
- read and unread notification tracking

### Medical Record Model

Defined in [server/src/models/medical_record_model.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/models/medical_record_model.ts).

Supports:

- consultation notes
- diagnosis details
- prescription storage
- follow-up planning
- critical case marking
- patient treatment history

### System Setting Model

Defined in [server/src/models/system_setting_model.ts](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src/models/system_setting_model.ts).

Supports:

- consultation duration configuration
- hospital working hours
- working day configuration
- walk-in and emergency appointment control
- maximum appointments per slot
- queue strategy defaults

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB local instance or MongoDB Atlas connection

### Clone the Repository

```bash
git clone <your-repository-url>
cd MediQueue
```

### Install Dependencies

Client:

```bash
cd client
npm install
```

Server:

```bash
cd server
npm install
```

## Available Commands

### Server

Run these commands from [server](/Users/jagruthipulumati/Desktop/sd/MediQueue/server):

```bash
npm run dev
npm run build
npm run typecheck
```

### Client

Run these commands from [client](/Users/jagruthipulumati/Desktop/sd/MediQueue/client):

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Environment Variables

Create a `.env` file inside [server/src](/Users/jagruthipulumati/Desktop/sd/MediQueue/server/src).

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## Project Diagrams

The repository already includes system diagrams that support the design and documentation of the project:

- use case diagrams in [diagrams/usecase](/Users/jagruthipulumati/Desktop/sd/MediQueue/diagrams/usecase)
- class diagrams in [diagrams/class](/Users/jagruthipulumati/Desktop/sd/MediQueue/diagrams/class)
- sequence diagrams in [diagrams/sequence](/Users/jagruthipulumati/Desktop/sd/MediQueue/diagrams/sequence)
- ER diagrams in [diagrams/er_diagram](/Users/jagruthipulumati/Desktop/sd/MediQueue/diagrams/er_diagram)

These diagrams help explain the intended product behavior, object relationships, and database direction behind the implementation.

## Roadmap

Possible next steps for the project include:

- complete API route and controller layers
- connect the frontend to real backend workflows
- build authentication and authorization flows
- add validation and error handling layers
- implement system overview analytics for admin workflows
- integrate real notification providers
- expand queue and scheduling conflict resolution logic

## Conclusion

MediQueue already has a meaningful backend foundation for a hospital queue and appointment management system. Its clearest strength today is the backend architecture: the domain entities, shared contracts, pattern-based queue logic, and MongoDB model layer create a solid base for future API and product development.
