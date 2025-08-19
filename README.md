# 📘 Housing Services Portal Documentation

## Table of Contents

1. [Overview](#1-overview)
2. Setup & Installation
3. [Authentication](#3-authentication)
   - [Register](#register)
   - [Login](#login)
4. System Summary
5. Entity Relationship Diagram
6. Data Models
   - Residents
   - Services
   - Service Requests
   - Housing Plans
   - Admins
   - Junction Tables
7. Relationships Explained
8. API Endpoints
   - Residents Overview (`/api/residents`)
   - Services Overview (`/api/services`)
   - Requests Overview (`/api/requests`)
   - Housing Plans Overview (`/api/housing-plans`)
9. Cost Calculation Logic

---

## 1. Overview

The **Housing Services Portal** is an online platform designed to facilitate housing-related service requests for residents. Its primary goal is to streamline communication between residents and housing management while ensuring transparency around service availability and costs.

### 🎯 Purpose

- Allow residents to browse and request housing-related services (e.g., plumbing, maintenance, pest control).
- Inform users whether the service is covered under their housing fee or incurs an additional cost.
- Provide clear cost breakdowns when applicable.
- Offer administrators tools to manage services, pricing, and housing package inclusions.

---

## 3. Authentication

The portal uses a **JWT-based authentication system**. Users can register with an email and password, then login to receive a token for accessing protected endpoints.

### Register

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

- `201 Created` on success

```json
{
  "message": "User registered"
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
  "token": "JWT_TOKEN_HERE"
}
```

- `401 Unauthorized` if credentials are invalid
