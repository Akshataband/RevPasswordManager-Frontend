# RevPasswordManager Frontend

A secure Angular application for managing encrypted passwords.  
This frontend communicates with the Spring Boot backend and provides authentication, vault management, password generation, security audit, and encrypted backup functionality.

---

## Tech Stack

- Angular (Standalone Components)
- TypeScript
- Angular Router
- Angular Material
- Reactive Forms
- HTTP Interceptors
- JWT Authentication
- SCSS (Dark Theme)

---

## Features

### Authentication

- Register with email, username, and master password
- Setup minimum 3 security questions
- Login using username or email and master password
- OTP verification (2FA)
- JWT-based authentication
- Route protection using AuthGuard
- Automatic redirect on token expiration
- Logout functionality

### Dashboard

- Display total stored passwords
- Show weak password count
- Recently added passwords list
- Security alerts overview
- Quick navigation links

### Password Vault

- View all stored passwords
- Search passwords
- Filter by category
- Sort by name, date added, or modified
- Add new password
- Update existing password
- Delete password with confirmation
- Mark and unmark as favorite
- View password details (requires master password re-entry)

### Favorites

- View favorite passwords
- Quick access to important entries

### Password Generator

- Custom password length (8–64 characters)
- Toggle uppercase, lowercase, numbers, and special characters
- Exclude similar characters option
- Password strength indicator
- Copy to clipboard
- Save generated password directly to vault

### Security Audit

- Detect weak passwords
- Detect reused passwords
- Identify old passwords
- Display security alerts

### Backup

- Export encrypted vault backup
- Import encrypted backup file

### Profile and Account Settings

- Update profile details
- Change master password
- Enable or disable 2FA
- Update security question answers

---

## Project Structure

src/app

├── core

│ ├── services

│ ├── interceptors

│ └── guards

├── features

│ ├── auth

│ ├── dashboard


│ ├── vault

│ ├── generator

│ ├── security

│ └── backup

├── shared

│ ├── components

│ ├── layout

│ └── models

├── app.config.ts

└── app.routes.ts


---

## Application Flow

- User registers
- User logs in with master password
- OTP verification completed
- JWT stored in localStorage
- Dashboard loads after authentication
- User manages vault, generator, audit, and backup features
- Logout clears token and redirects to login

---

## Installation

1. Navigate to frontend directory  
   `cd frontend`

2. Install dependencies  
   `npm install`

3. Start development server  
   `ng serve --port 4200`

Application runs at:  
http://localhost:4200

---

## Environment Configuration

- Ensure backend is running at  
  http://localhost:8080

- Update API base URL in `environment.ts` if needed

---

## Security Implementation

- JWT stored in localStorage
- HTTP interceptor attaches Authorization header
- AuthGuard protects private routes
- Token removed on logout
- Automatic redirect on 401 Unauthorized
- Reactive form validation
