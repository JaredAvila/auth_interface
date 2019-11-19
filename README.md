# Juvicount API interface

## User Routes

---

> ### Register new account

POST: /api/v1/users/register

body:

- name (required)
- email (required)
- password (required)
- password2 (\*\*confirmation required)
- photo (optional)

> ### Login

POST: /api/v1/users/login

body:

- email (required)
- password (required)

> ### Get all users:

GET: /api/v1/users

> ### Forgot password

POST: /api/v1/users/forgotPassword

body:

- email (required)

> ### Password reset

PATCH: /api/v1/users/resetPassword/:resetToken

body:

- password (required)
- password2 (\*\*confirmation required)

> ### Update account (PROTECTED)

PATCH: /api/v1/user/:id

body:

- name
- email

## Child Account Routes

---

> ### Create child account

POST: /api/v1/users/children

body:

- name (required)
- photo

> ### Get child account

GET: /api/v1/users/child/:id

> ### Update child account

PATCH /api/v1/users/child/:id

body:
- name
- photo

> ### Delete child account

DELETE /api/v1/users/child/:id

