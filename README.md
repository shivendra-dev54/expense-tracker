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
  ````json
  {
    "status": true,
    "status_code": 200,
    "message": "",
    "data": {}
  }
  ````

- auth routes
  - sign up
    - path = POST `/api/auth/sign_up`
    - body =
      ````json
      {
      "fullname": "Zenitsu Agatsuma",
      "username": "zeni",
      "email": "zeni@demonmail.com",
      "password": "1234"
      }
      ````
  
  - sign in
    - path = POST `/api/auth/sign_in`
    - body =
      ````json
      {
      "username": "zeni",
      "email": "zeni@demonmail.com",
      "password": "1234"
      }
      ````
    - desc = either `username` or `email` is required.
  
  - refresh
    - path = POST `/api/auth/refresh`
    - body =
      ````json
      {}
      ````

  - logout
    - path = POST `/api/auth/logout`
    - body =
      ````json
      {}
      ````

- **entrybook routes:**
  - create
    - path = POST `/api/book`
    - body =
      ````json
      {
        "name": "jan_book"
      }
      ````
  - read
    - path = GET `/api/book`
    - body =
      ````json
      {}
      ````
  - update
    - path = POST `/api/book/:id`
    - body =
      ````json
      {
        "name": "new name"
      }
      ````
  - delete
    - path = DELETE `/api/book/:id`
    - body =
      ````json
      {}
      ````






### plan
**expense:**
<br>every body will have the id of the book
  - POST /	-> create a new expense
  - GET /:id	-> get all the expenses in a certain book
  - POST /:id	-> update a certain expense
  - DELETE/:id	-> delete a certain expense

**admin:**
  - GET /	-> get all the users
  - DELETE /:id	-> delete that user, its books, and its expenses