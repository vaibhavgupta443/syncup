# AC1 - Activity & Social Matching Platform

## Quick Start

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
Create MySQL database: `ac1_db`
Update credentials in `backend/src/main/resources/application.properties`

## URLs
- Backend: http://localhost:8080
- Frontend: http://localhost:5173
- API Docs: http://localhost:8080/swagger-ui.html (if Swagger is added)

## Default Test User
After running, register a new user or use these test credentials (if seeded):
- Email: test@example.com
- Password: password123

## Tech Stack
- Backend: Spring Boot 3.1.5 + MySQL + JWT
- Frontend: React 19 + Vite + Redux Toolkit

See full README.md for detailed documentation.
