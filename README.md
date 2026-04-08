# MediQueue

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)](./client)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-43853d)](./server)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47a248)](./server/src/models)

MediQueue is a smart hospital queue and appointment management system built to reduce waiting friction for patients, improve queue visibility for doctors, and provide administrators with better control over daily hospital operations.

The project is centered on one idea: turn fragmented appointment and queue handling into a structured digital workflow that is easier to manage, easier to extend, and easier to reason about in code.

## Table of Contents

- [Project Idea](#project-idea)
- [Core Use Cases](#core-use-cases)
- [Current Project State](#current-project-state)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)

## Project Idea

MediQueue models a hospital flow with three primary actors:

- `Patient`: register, log in, book appointments, track queue position, receive notifications, reschedule or cancel appointments, and view appointment history
- `Doctor`: manage availability, review the live queue, call the next patient, view patient details, write prescriptions, mark consultations complete, review patient history, and flag critical cases
- `Admin`: log in, manage doctors, configure operational settings, view system-wide activity, and handle exceptional scheduling cases

The system design is supported by the project diagrams in [diagrams/usecase](/Users/jagruthipulumati/Desktop/sd/MediQueue/diagrams/usecase), [diagrams/class](/Users/jagruthipulumati/Desktop/sd/MediQueue/diagrams/class), [diagrams/sequence](/Users/jagruthipulumati/Desktop/sd/MediQueue/diagrams/sequence), and [diagrams/er_diagram](/Users/jagruthipulumati/Desktop/sd/MediQueue/diagrams/er_diagram).

## Core Use Cases

### Patient

- Register and log in
- Select a doctor and choose a time slot
- Book scheduled, walk-in, or emergency appointments
- View queue position and appointment history
- Receive reminders and queue updates
- Reschedule or cancel appointments

### Doctor

- Set availability and block time
- Review today's queue
- Call the next patient
- View patient details and history
- Write prescriptions
- Recommend follow-ups
- Mark consultation complete
- Flag critical cases

### Admin

- Add or remove doctors
- Configure consultation rules and working hours
- View system overview
- Override cancellations when needed
- Resolve scheduling conflicts

## Current Project State

The repository currently contains a stronger backend foundation than frontend product implementation.

### What is implemented

- A TypeScript backend structure with domain entities, interfaces, and design pattern implementations
- MongoDB model definitions for the main hospital data objects
- Express server bootstrap and database connection setup
- Project diagrams describing use cases, class relationships, sequence flow, and data design

### What is still early-stage

- The frontend is still at starter level and is not yet connected to the backend domain flow
- API routes, controllers, services, validation, and authentication flow are not fully built out yet
- End-to-end hospital workflows are modeled in code, but not yet exposed through a complete application interface

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

- Use case diagrams
- Class diagrams
- Sequence diagrams
- ER diagrams
- Object-oriented design
- SOLID-oriented structure
- design pattern based backend modeling

## Repository Structure

```text
MediQueue/
├── client/        # React + Vite frontend
├── server/        # Express + TypeScript backend
├── diagrams/      # Use case, class, sequence, and ER diagrams
└── README.md
```

### Frontend

The frontend lives in [client](/Users/jagruthipulumati/Desktop/sd/MediQueue/client) and is set up with React, Vite, and TypeScript. At the moment, it serves as the initial application shell rather than the finished hospital interface.

### Backend

The backend lives in [server](/Users/jagruthipulumati/Desktop/sd/MediQueue/server) and contains the architectural core of the project. This is where the hospital domain, queue behavior, design patterns, and MongoDB model definitions are currently concentrated.
