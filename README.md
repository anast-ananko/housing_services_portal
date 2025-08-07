# 📘 Housing Services Portal Documentation

## Table of Contents

1. [Overview](#1-overview)
2. Setup & Installation
3. Authentication
   - Register
   - Login
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
