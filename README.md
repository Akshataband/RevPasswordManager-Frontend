RevPasswordManager Frontend
A secure Angular application for managing encrypted passwords.
This frontend connects with the Spring Boot backend and provides authentication, vault management, password generation, security audit, and encrypted backup features using JWT-based security and OTP verification.

Tech Stack
-Angular (Standalone Components)
-TypeScript
-Angular Router
-Angular Material
-Reactive Forms
HTTP Interceptors
JWT Authentication
SCSS (Dark Theme)

Features

Authentication
Register with email, username, and master password
Minimum 3 security questions setup
Login using username or email and master password
OTP verification (2FA)
JWT-based authentication
Route protection using AuthGuard
Automatic redirect on token expiration
Logout functionality

Dashboard
Total stored passwords summary
Weak password count
Recently added passwords
Security alerts overview
Quick navigation links

Password Vault
View all passwords
Search passwords
Filter by category
Sort by name, created date, or modified date
Add new password
Update password
Delete password with confirmation
Mark and unmark as favorite
View password details after master password verification

Favorites
View only favorite passwords
Quick access to important entries

Password Generator
Customizable password length (8–64)
Toggle uppercase, lowercase, numbers, special characters
Exclude similar characters option
Password strength indicator
Copy to clipboard
Save generated password directly to vault

Security Audit
Detect weak passwords
Detect reused passwords
Identify old passwords
Display security alerts

Backup
Export encrypted vault file
Import encrypted backup file

Profile and Account Settings
Update profile information
Change master password
Enable or disable 2FA
Update security question answers

Project Structure

src/app

core
– services (auth, vault, generator, backup, security)
– interceptors (JWT interceptor)
– guards (AuthGuard)

features
– auth
– dashboard
– vault
– generator
– security
– backup

shared
– reusable components
– layout components
– models

app.config.ts – application configuration
app.routes.ts – route definitions

The application follows modular separation. Business logic is handled inside services, while components manage UI and user interaction.

Application Flow

User registers account
User logs in with master password
OTP verification completed
JWT token stored in localStorage
Dashboard loads after authentication
User manages vault, generator, audit, and backup features
Logout clears token and redirects to login

Installation

Navigate to frontend directory:

cd frontend

Install dependencies:

npm install

Run development server:

ng serve --port 4200

Application runs at:

http://localhost:4200

Environment Configuration

Ensure backend runs at:

http://localhost:8080

Update API base URL in environment configuration if needed.

Security Implementation

JWT stored in localStorage
HTTP interceptor attaches Authorization header
AuthGuard protects private routes
Token removed on logout
Automatic redirect on 401 Unauthorized
Reactive form validation for secure inputs

Validation and Error Handling

Required field validation
Minimum password length validation
OTP format validation
Snackbar notifications for success and error messages
Loading indicators during API calls

Notes

All API calls are centralized in services.
Sensitive operations require master password verification.
Application uses Angular Material for consistent UI design.
Responsive dark theme UI is implemented.

This frontend can be extended with refresh token handling, HttpOnly cookie-based authentication, lazy loading modules, state management improvements, and production build optimization.
