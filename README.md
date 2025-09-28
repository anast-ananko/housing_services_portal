# 📘 Housing Services Portal Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Setup & Installation](#2-setup--installation)
3. [Running Tests](#3-running-tests)
4. [Authentication](#4-authentication)
   - [Register](#register)
   - [Login](#login)
5. [API Endpoints](#5-api-endpoints)
   - [Users](#users)
   - [Residents](#residents)
   - [Managers](#managers)
   - [Services](#services)
   - [Requests](#requests)
   - [Payments](#payments)
6. [Data Modeling](#6-data-modeling)
   - [Entity Relationship Diagram](#entity-relationship-diagram)
   - [Detailed Table Information](#detailed-table-information)
   - [Relationships Explained](#relationships-explained)

---

## 1. Overview

The **Housing Services Portal** is an online platform designed to facilitate housing-related service requests for residents. Its primary goal is to streamline communication between residents and housing management while ensuring transparency around service availability and costs.

### 🎯 Purpose

- Allow residents to browse and request housing-related services (e.g., plumbing, maintenance, pest control).
- Inform users whether the service is covered under their housing fee or incurs an additional cost.
- Offer administrators tools to manage services, pricing, and housing package inclusions.

---

## 2. Setup & Installation

### 🔧 Requirements

- Node.js v18+
- Docker & Docker Compose (if running with containers)
- PostgreSQL 14+ (if running locally, without Docker)

### ⚙️ Environment Variables

Environment variables are stored in .env files.

This project provides example files — copy them and rename:

```bash
rename .env.example .env
rename .env.docker.example .env.docker
```

- Use .env when running the server locally.
- Use .env.docker when running the server inside Docker (it will be automatically picked up by docker-compose).

### 🗄️ Database Setup

### Local database

1. Start PostgreSQL locally.

2. **Manually create the database** with the name specified in `DB_NAME` (default: `housing_services`):

   ```sql
   CREATE DATABASE housing_services;
   ```

3. Make sure the user and password match the values in `.env` (`DB_USER` and `DB_PASSWORD`).

### Dockerized database

Make sure **Docker** (and Docker Compose) is installed and **running**.The database container will be initialized automatically using values from `.env.docker` when you run the services with Docker Compose.

### 📦 Installation & Run

### Local development (no Docker)

**Install dependencies:**

```bash
npm install
```

**Run the development server:**

```bash
npm run dev
```

**For production:**

```bash
npm run build && npm start
```

### With Docker Compose (server + database)

**Start all services:**

```bash
docker-compose up
```

**Stop the containers (press Ctrl+C or run):**

```bash
docker-compose down
```

**If you change dependencies or Dockerfile, rebuild images with:**

```bash
docker-compose up --build
```

---

## 3. Running Tests

This project uses **Jest** for unit and integration testing.

### 🧪 Run all tests

```bash
npm run test
```

### 📊 Run tests with coverage

To check which parts of the codebase are covered by tests, run:

```bash
npm run test:coverage
```

---

## 4. Authentication

The portal uses a **JWT-based authentication system**. Users can register with an email and password, then login to receive a token for accessing protected endpoints.

### Register

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "resident",
  "residentId": 1,
  "managerId": null
}
```

**Response:**

- `201 Created` on success

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "resident",
    "residentId": 1,
    "managerId": null
  }
}
```

- `400 Bad Request` if email or password missing or user already exists

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

- `200 OK` on success

```json
{
  "accessToken": "ACCESS_JWT_TOKEN_HERE",
  "refreshToken": "REFRESH_JWT_TOKEN_HERE"
}
```

- `401 Unauthorized` if credentials are invalid

### Refresh Access Token

**Endpoint:** `POST /auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "REFRESH_JWT_TOKEN_HERE"
}
```

**Response:**

- `200 OK` on success

```json
{
  "accessToken": "NEW_ACCESS_JWT_TOKEN_HERE"
}
```

- `401 Unauthorized` if refresh token is invalid or expired

---

## 5. API Endpoints

All the following endpoints (except `/auth`) require a valid **JWT access token** in the  
`Authorization: Bearer <token>` header.

---

### Users

**Endpoint:** `/users`

- `GET /users` — Get all users
- `GET /users/:id` — Get a user by ID
- `GET /users/me` — Get the currently authenticated user profile
- `PUT /users/:id` — Update a user
- `DELETE /users/:id` — Delete a user

---

### Residents

**Endpoint:** `/residents`

- `GET /residents` — Get all residents
- `GET /residents/:id` — Get a resident by ID
- `POST /residents` — Create a new resident
- `PUT /residents/:id` — Update a resident
- `DELETE /residents/:id` — Delete a resident

---

### Managers

**Endpoint:** `/managers`

- `GET /managers` — Get all managers
- `GET /managers/:id` — Get a manager by ID
- `POST /managers` — Create a new manager
- `PUT /managers/:id` — Update a manager
- `DELETE /managers/:id` — Delete a manager

---

### Services

**Endpoint:** `/services`

- `GET /services` — Get all services
- `GET /services/:id` — Get a service by ID
- `POST /services` — Create a new service
- `PUT /services/:id` — Update a service
- `DELETE /services/:id` — Delete a service

---

### Requests

**Endpoint:** `/requests`

- `GET /requests` — Get all requests
- `GET /requests/:id` — Get a request by ID
- `POST /requests` — Create a new request
- `PUT /requests/:id` — Update a request
- `DELETE /requests/:id` — Delete a request

---

### Payments

**Endpoint:** `/payments`

- `GET /payments` — Get all payments
- `GET /payments/:id` — Get a payment by ID
- `POST /payments` — Create a new payment
- `PUT /payments/:id` — Update a payment
- `DELETE /payments/:id` — Delete a payment

---

## 6. Data Modeling

### Entity Relationship Diagram

![ERD Diagram](./docs/housing_services_portal_schema.png)

### Detailed Table Information

### `Residents` Table

| Column     | Type     | Constraints             | Description                       |
| ---------- | -------- | ----------------------- | --------------------------------- |
| id         | int      | PK, auto-increment      | Unique identifier of the resident |
| name       | varchar  | NOT NULL                | Full name of the resident         |
| email      | varchar  | UNIQUE, NOT NULL        | Resident's email address          |
| phone      | varchar  |                         | Resident's phone number           |
| address    | text     |                         | Resident's home address           |
| created_at | datetime | NOT NULL, DEFAULT now() | Timestamp of record creation      |

### `Services` Table

| Column      | Type    | Constraints                 | Description                      |
| ----------- | ------- | --------------------------- | -------------------------------- |
| id          | int     | PK, auto-increment          | Unique identifier of the service |
| name        | varchar | NOT NULL                    | Name of the service              |
| description | text    |                             | Description of the service       |
| cost        | decimal | NOT NULL, CHECK (cost >= 0) | Service cost                     |
| is_active   | boolean | DEFAULT TRUE                | Whether the service is active    |

### `Requests` Table

| Column      | Type     | Constraints                         | Description                       |
| ----------- | -------- | ----------------------------------- | --------------------------------- |
| id          | int      | PK, auto-increment                  | Unique identifier of the request  |
| resident_id | int      | NOT NULL, FK → Residents.id         | The resident who made the request |
| service_id  | int      | NOT NULL, FK → Services.id          | Service being requested           |
| manager_id  | int      | FK → Managers.id                    | Manager assigned to the request   |
| status      | enum     | DEFAULT 'pending', request_status   | Status of the request             |
| created_at  | datetime | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp of request creation     |
| updated_at  | datetime | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp of last update          |

### `Payments` Table

| Column     | Type     | Constraints                       | Description                       |
| ---------- | -------- | --------------------------------- | --------------------------------- |
| id         | int      | PK, auto-increment                | Unique payment identifier         |
| request_id | int      | NOT NULL, FK → Requests.id        | Associated request                |
| amount     | decimal  | NOT NULL, CHECK (amount >= 0)     | Payment amount                    |
| method     | enum     | NOT NULL, payment_method          | Payment method (card/cash/online) |
| status     | enum     | DEFAULT 'pending', payment_status | Payment status                    |
| paid_at    | datetime |                                   | Timestamp of payment              |

### `Managers` Table

| Column | Type    | Constraints            | Description                                    |
| ------ | ------- | ---------------------- | ---------------------------------------------- |
| id     | int     | PK, auto-increment     | Unique identifier of the manager               |
| name   | varchar | NOT NULL               | Manager's full name                            |
| email  | varchar | UNIQUE, NOT NULL       | Manager's email address                        |
| phone  | varchar |                        | Manager's phone number                         |
| role   | enum    | NOT NULL, manager_role | Role of the manager (admin/technician/support) |

### `Users` Table

| Column        | Type    | Constraints                  | Description                                 |
| ------------- | ------- | ---------------------------- | ------------------------------------------- |
| id            | int     | PK, auto-increment           | Unique identifier of the user               |
| email         | varchar | UNIQUE, NOT NULL             | User's email address                        |
| password_hash | varchar | NOT NULL                     | Hashed password                             |
| refresh_token | text    |                              | Refresh token for authentication            |
| role          | varchar | NOT NULL, DEFAULT 'resident' | User role (e.g., resident, manager, admin)  |
| resident_id   | int     | FK → Residents.id            | Linked resident record (if role = resident) |
| manager_id    | int     | FK → Managers.id             | Linked manager record (if role = manager)   |

### Enums

#### `request_status`

- pending
- in_progress
- completed
- cancelled

#### `payment_method`

- card
- cash
- online

#### `payment_status`

- paid
- pending
- failed

#### `manager_role`

- admin
- technician
- support

### Relationships Explained

- **Residents → Requests:** One-to-Many  
  _A resident can make many requests, but each request belongs to only one resident._

- **Services → Requests:** One-to-Many  
  _A service can be requested multiple times, but each request is for a single service._

- **Managers → Requests:** One-to-Many  
  _A manager can be assigned to multiple requests, but each request has only one manager._

- **Requests → Payments:** One-to-Many  
  _Each request can have multiple associated payments, and each payment belongs to a single request._
- **Users → Residents:** One-to-One (optional)  
  _A user with the role "resident" may be linked to a resident record via `resident_id`._

- **Users → Managers:** One-to-One (optional)  
  _A user with the role "manager" may be linked to a manager record via `manager_id`._

- **Users Role Logic:**  
  _Each user can have a role of `resident`, `manager`, or `admin`. Depending on the role, the `resident_id` or `manager_id` field is populated to link the user to the corresponding entity._

---
