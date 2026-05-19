# Expense tracker

### Techstack

- Bun.js
- Next.js
- TypeScript
- Mongoose
- MongoDB
- bcryptjs
- jose-jwt

### API routes

- API response format

  ```json
  {
    "status": true,
    "status_code": 200,
    "message": "",
    "data": {}
  }
  ```

- auth routes
  - sign up
    - path = POST `/api/auth/sign_up`
    - body =
      ```json
      {
        "fullname": "Zenitsu Agatsuma",
        "username": "zeni",
        "email": "zeni@demonmail.com",
        "password": "1234"
      }
      ```
  - sign in
    - path = POST `/api/auth/sign_in`
    - body =
      ```json
      {
        "username": "zeni",
        "email": "zeni@demonmail.com",
        "password": "1234"
      }
      ```
    - desc = either `username` or `email` is required.
  - refresh
    - path = POST `/api/auth/refresh`
    - body =
      ```json
      {}
      ```

  - logout
    - path = POST `/api/auth/logout`
    - body =
      ```json
      {}
      ```

- **entrybook routes:**
  - create
    - path = POST `/api/book`
    - body =
      ```json
      {
        "name": "jan_book"
      }
      ```
  - read
    - path = GET `/api/book`
    - body =
      ```json
      {}
      ```
  - update
    - path = POST `/api/book/:id`
    - body =
      ```json
      {
        "name": "new name"
      }
      ```
  - delete
    - path = DELETE `/api/book/:id`
    - body =
      ```json
      {}
      ```

- **expense routes:**
  - create
    - path = POST `/api/expense`
    - body =
      ```json
      {
        "book_id": "some_id",
        "amount": 10,
        "message": "purchsed a pen."
      }
      ```
  - read
    - path = GET `/api/expense?book_id=id_of_the_book`
    - body =
      ```json
      {}
      ```
  - update
    - path = POST `/api/expense/:id`
    - body =
      ```json
      {
        "amount": 90,
        "message": "purchased 9 pens."
      }
      ```
  - delete
    - path = DELETE `/api/expense/:id`
    - body =
      ```json
      {}
      ```

- **admin routes:**
  - get acess
    - path = POST `/api/admin`
    - body =
      ```json
      {
        "secret": ""
      }
      ```
  - get all users
    - path = GET `/api/admin`
    - body =
      ```json
      {}
      ```
  - delete user
    - path = DELETE `/api/admin/:id`
    - body =
      ```json
      {}
      ```

- **user routes:**
  - get info
    - path = GET `/api/user`
    - body =
      ```json
      {}
      ```
  - delete self
    - path = DELETE `/api/user`
    - body =
      ```json
      {}
      ```

### plan

**tasks:**

- update all responses so that the status codes will be correct.
- standardize the response code thing.
