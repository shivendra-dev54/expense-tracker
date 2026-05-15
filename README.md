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
    - path = `/api/auth/sign_up`
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
    - path = `/api/auth/sign_in`
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
    - path = `/api/auth/refresh`
    - body =
      ````json
      {}
      ````

  - logout
    - path = `/api/auth/logout`
    - body =
      ````json
      {}
      ````

