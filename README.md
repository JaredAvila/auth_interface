# Juvicount API interface

## USER ROUTES

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

> ### Delete account (PROTECTED)

DELETE: /api/v1/user/:id

---

---

## CHILD ACCOUNT ROUTES

---

> ### Create child account (PROTECTED)

POST: /api/v1/users/children

body:

- name (required)
- photo

> ### Get child account (PROTECTED)

GET: /api/v1/users/child/:id

> ### Update child account (PROTECTED)

PATCH /api/v1/users/child/:id

body:

- name
- photo

> ### Delete child account (PROTECTED)

DELETE /api/v1/users/child/:id

> ### Update balance amount (PROTECTED)

PATCH /api/v1/users/child/balance/:id

body:

- balance (required)

---

---

## ITEM ROUTES

---

> ### Get Items (PROTECTED)

GET /api/v1/items

> ### Create Item (PROTECTED)

POST /api/v1/items

body:

- name (required)
- price (required)
- photo
- url
- category (required)

> ### Get Item (PROTECTED)

POST /api/v1/items/:id

> ### Update Item (PROTECTED)

PATCH /api/v1/items/:id

body:

- name 
- price
- photo
- url
- category

> ### Delete Item (PROTECTED)

DELETE /api/v1/items/:id

