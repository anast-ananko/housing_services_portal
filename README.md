# 📘 Housing Services Portal Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Setup & Installation](#2-setup--installation)
3. [Authentication](#3-authentication)
   - [Register](#register)
   - [Login](#login)
4. System Summary
5. [Data Modeling](#5-data-modeling)
   - [Entity Relationship Diagram](#entity-relationship-diagram)
   - [Detailed Table Information](#detailed-table-information)
   - [Relationships Explained](#relationships-explained)
6. API Endpoints
   - Residents Overview (`/api/residents`)
   - Services Overview (`/api/services`)
   - Requests Overview (`/api/requests`)
   - Housing Plans Overview (`/api/housing-plans`)
7. Cost Calculation Logic

---

## 1. Overview

The **Housing Services Portal** is an online platform designed to facilitate housing-related service requests for residents. Its primary goal is to streamline communication between residents and housing management while ensuring transparency around service availability and costs.

### 🎯 Purpose

- Allow residents to browse and request housing-related services (e.g., plumbing, maintenance, pest control).
- Inform users whether the service is covered under their housing fee or incurs an additional cost.
- Provide clear cost breakdowns when applicable.
- Offer administrators tools to manage services, pricing, and housing package inclusions.

---

## 2. Setup & Installation

### 🔧 Requirements

- Node.js v18+
- PostgreSQL 14+

### ⚙️ Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
PORT=3000
SECRET_KEY=your_access_secret
REFRESH_SECRET_KEY=your_refresh_secret

DB_HOST=localhost
DB_PORT=5432
DB_NAME=housing_services
DB_USER=postgres
DB_PASSWORD=your_password
```

### 🗄️ Database Setup

1. Start PostgreSQL (locally or via Docker).

2. **Manually create the database** with the name specified in `DB_NAME` (default: `housing_services`):

   ```sql
   CREATE DATABASE hhousing_services;
   ```

3. Make sure the user and password match the values in `.env` (`DB_USER` and `DB_PASSWORD`).

### 📦 Installation & Run

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

---

## 3. Authentication

The portal uses a **JWT-based authentication system**. Users can register with an email and password, then login to receive a token for accessing protected endpoints.

### Register

**Endpoint:** `POST /api/auth/register`

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

**Endpoint:** `POST /api/auth/login`

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

**Endpoint:** `POST /api/auth/refresh`

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

## 5. Data Modeling

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
