# MediQueue

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)](./client)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-43853d)](./server)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47a248)](./server/src/models)

MediQueue is a smart hospital queue and appointment management system focused on digitizing appointment booking, queue handling, consultation flow, and hospital-side coordination.

The core idea of the project is simple: replace fragmented manual hospital workflows with a structured digital system that is easier to manage, easier to extend, and easier to reason about in code.

At the current stage of the repository, the backend is the strongest and most important part of the implementation.

## Table of Contents

- [Project Idea](#project-idea)
- [Actors and Use Cases](#actors-and-use-cases)
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

MediQueue models a hospital workflow around three primary actors:

- `Patient`
- `Doctor`
- `Admin`

The system is intended to support booking, queue visibility, consultation handling, notifications, patient history, doctor availability, and admin-side operational control.

This project is not just about storing data. It is designed around domain entities, interfaces, reusable types, design patterns, and MongoDB models so that the hospital workflow is represented clearly in the codebase.

## System Architecture

<p align="center">
  <img src="./diagrams/architecture/architecture.png" alt="MediQueue Architecture" width="700"/>
</p>

## Actors and Use Cases

### Patient

- Register and log in
- Select a doctor and choose a time slot
- Book appointments
- View queue position
- Receive notifications
- Reschedule appointments
- Cancel appointments
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

### Implemented

- Express server bootstrap
- MongoDB connection setup with Mongoose
- Domain entities for users and appointments
- Interfaces for users, appointments, queue flow, and notifications
- Shared enums and reusable system types
- Design pattern implementations for queue handling, notifications, and appointment creation
- MongoDB models for the main hospital data objects
- UML and system analysis diagrams

### Still in Progress

- Frontend is still an early React and Vite shell
- API routes, controllers, and services are not fully implemented yet
- Authentication flow is not fully built in the current codebase
- End-to-end workflows are modeled in code but not yet exposed through a complete application flow

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

### Design

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

The frontend lives in [`client`](./client). It is currently a lightweight React + Vite setup and should be treated as the starting shell for the future hospital interface.

### Backend

The backend lives in [`server`](./server). This is the most developed part of the current project and contains the domain model, queue behavior, design patterns, and MongoDB model layer.

## Backend Architecture

The backend is organized to keep domain logic, contracts, persistence, and reusable behavior clearly separated.

```text
server/src/
├── config/       # MongoDB connection setup
├── entities/     # Core hospital domain classes
├── interfaces/   # Contracts for users, appointments, queue, and notifications
├── models/       # MongoDB Mongoose schemas
├── patterns/     # Design pattern implementations
├── types/        # Shared enums and reusable types
└── index.ts      # Express server entry point
```

### Entities

Implemented in [`server/src/entities`](./server/src/entities):

- `User`
- `Patient`
- `Doctor`
- `Admin`
- `Appointment`
- `WalkInAppointment`
- `ScheduledAppointment`
- `EmergencyAppointment`

These classes represent the business side of the system before persistence concerns are applied.

### Interfaces

Implemented in [`server/src/interfaces`](./server/src/interfaces):

- user interface
- patient interface
- doctor interface
- admin interface
- appointment interface
- queue observer interface
- queue subject interface
- queue strategy interface
- notification channel interface

These contracts keep the backend modular and easier to extend.

### Shared Types

Defined in [`server/src/types/system.types.ts`](./server/src/types/system.types.ts):

- user roles
- appointment types
- appointment statuses
- queue entry statuses
- doctor availability states
- notification types
- case priorities
- time slots
- queue entries and queue snapshots
- prescription and follow-up structures
- daily summary structure

## Implemented Design Patterns

The backend is one of the strongest parts of the repository because it already applies multiple design patterns that fit the hospital queue and appointment domain.

### Factory Pattern

Implemented in [`server/src/patterns/appointment_factory.ts`](./server/src/patterns/appointment_factory.ts).

Purpose:

- create the correct appointment object based on appointment type
- avoid scattering appointment type checks throughout the application

Included classes:

- `WalkInFactory`
- `ScheduledFactory`
- `EmergencyFactory`
- `AppointmentFactoryProvider`

### Strategy Pattern

Implemented in [`server/src/patterns/queue_strategy.ts`](./server/src/patterns/queue_strategy.ts).

Purpose:

- allow queue ordering rules to change without rewriting queue manager logic
- support FIFO, priority-based handling, and round-robin style ordering

Included strategies:

- `FIFOQueueStrategy`
- `PriorityQueueStrategy`
- `RoundRobinQueueStrategy`

### Observer Pattern

Implemented in [`server/src/patterns/queue_manager.ts`](./server/src/patterns/queue_manager.ts) and [`server/src/patterns/queue_observer.ts`](./server/src/patterns/queue_observer.ts).

Purpose:

- notify observers when queue state changes
- support patient and doctor queue updates without tightly coupling queue logic to UI concerns

Included classes:

- `QueueManager`
- `PatientQueueObserver`
- `DoctorQueueObserver`

### Singleton Pattern

Implemented in [`server/src/patterns/queue_registry.ts`](./server/src/patterns/queue_registry.ts).

Purpose:

- maintain one shared registry of doctor queues across the application

Included class:

- `QueueRegistry`

### Adapter Pattern

Implemented in [`server/src/patterns/notification_adapter.ts`](./server/src/patterns/notification_adapter.ts).

Purpose:

- normalize different notification provider interfaces behind one application-facing contract

Included adapters:

- `EmailAdapter`
- `SmsAdapter`
- `PushAdapter`

### Composite Pattern

Implemented in [`server/src/patterns/notification_composite.ts`](./server/src/patterns/notification_composite.ts).

Purpose:

- send one notification event through multiple channels as a single grouped action

Included class:

- `NotificationGroup`

## Data Models

The MongoDB persistence layer lives in [`server/src/models`](./server/src/models).

### User Model

Defined in [`server/src/models/user_model.ts`](./server/src/models/user_model.ts).

Supports:

- patient profile data
- doctor profile data
- admin profile data
- role-based user storage in a single collection
- doctor availability data
- doctor management data for admins

### Appointment Model

Defined in [`server/src/models/appointment_model.ts`](./server/src/models/appointment_model.ts).

Supports:

- scheduled, walk-in, and emergency appointments
- appointment status tracking
- queue token and queue position mapping
- reschedule and cancellation metadata
- admin override details
- critical case flagging

### Queue Model

Defined in [`server/src/models/queue_model.ts`](./server/src/models/queue_model.ts).

Supports:

- per-doctor queue storage
- daily queue snapshots for each doctor
- live queue entries with token number, status, and priority
- waiting, called, in-progress, done, and missed patient states

### Notification Model

Defined in [`server/src/models/notification_model.ts`](./server/src/models/notification_model.ts).

Supports:

- queue updates
- appointment reminders
- follow-up notifications
- general system messages
- read and unread tracking

### Medical Record Model

Defined in [`server/src/models/medical_record_model.ts`](./server/src/models/medical_record_model.ts).

Supports:

- consultation notes
- diagnosis details
- prescription storage
- follow-up planning
- critical case marking
- patient treatment history

### System Setting Model

Defined in [`server/src/models/system_setting_model.ts`](./server/src/models/system_setting_model.ts).

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

Run these commands from [`server`](./server):

```bash
npm run dev
npm run build
npm run typecheck
```

### Client

Run these commands from [`client`](./client):

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Environment Variables

Create a `.env` file inside `server/src`.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## Project Diagrams

The repository includes supporting diagrams for system understanding and documentation:

- use case diagrams in [`diagrams/usecase`](./diagrams/usecase)
- class diagrams in [`diagrams/class`](./diagrams/class)
- sequence diagrams in [`diagrams/sequence`](./diagrams/sequence)
- ER diagrams in [`diagrams/er_diagram`](./diagrams/er_diagram)

## Roadmap

Possible next steps for the project include:

- complete API route and controller layers
- connect the frontend to real backend workflows
- build authentication and authorization flows
- add validation and error handling layers
- implement admin system overview analytics
- integrate real notification providers
- expand queue and scheduling conflict resolution logic

## Team Contributions

| Name | Contribution |
| --- | --- |
| Koriginja Sathvik | Led system design, developed the codebase, and defined the overall architecture |
| Pulumati Jagruthi | Created system diagrams, managed the GitHub repository, and designed interfaces |
| Rashmi Anand | Designed system workflows, developed sequence & ER diagrams, defined entity relationships, and contributed to implementation logic |
| Kasula Lalithendra | Contributed to development tasks and supported implementation across modules |
| Nachiket | Assisted with development, integration, and overall project support |

## Conclusion

MediQueue already has a meaningful backend foundation for a hospital queue and appointment management system. Its clearest strength today is the backend architecture: the domain entities, shared contracts, pattern-based queue logic, and MongoDB model layer create a solid base for future API and product development.
