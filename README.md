# Interest-Based Activity & Social Matching Platform 🎯

A full-stack web application for users to create, discover, and join activities based on interests and location.

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.1.5
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security with BCrypt
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19 with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS with CSS Variables

## Features ✨

- 🔐 **JWT-based Authentication** - Secure login and registration
- 👤 **User Profiles** - Create and manage personal profiles with skills, interests, and ratings
- 🎯 **Activity Management** - Create, browse, and join activities
- 🔍 **Smart Filtering** - Filter activities by category, skill level, location, and more
- 🤝 **Join Requests** - Request to join activities with approval/rejection workflow
- 💬 **In-App Chat** - Real-time messaging for activity participants (polling-based)
- ⭐ **Feedback System** - Rate and review participants after activity completion
- 🎓 **Recommendations** - Personalized activity suggestions based on user interests and history
- 📊 **User Stats** - Track ratings, activity count, and experience level

## Project Structure

```
AC1/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/ac1/app/
│   │       │   ├── controller/      # REST Controllers
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   ├── exception/       # Exception Handlers
│   │       │   ├── model/           # Entity Models
│   │       │   ├── repository/      # JPA Repositories
│   │       │   ├── security/        # JWT Security Config
│   │       │   └── service/         # Business Logic
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── components/         # Reusable Components
    │   ├── pages/              # Page Components
    │   ├── redux/              # Redux Store & Slices
    │   │   └── slices/
    │   ├── services/           # API Service Layer
    │   ├── styles/             # CSS Stylesheets
    │   ├── App.jsx             # Main App Component
    │   └── main.jsx            # Entry Point
    └── package.json
```

## Prerequisites 📋

Before you begin, ensure you have the following installed:

- **Java 17+** ([Download](https://adoptium.net/))
- **Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))
- **MySQL 8.0+** ([Download](https://dev.mysql.com/downloads/mysql/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))

## Setup Instructions 🚀

### 1. Database Setup

```sql
-- Create the database
CREATE DATABASE ac1_db;

-- Update credentials in backend/src/main/resources/application.properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies and run (Maven will download dependencies)
mvn spring-boot:run

# The backend will start on http://localhost:8080
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# The frontend will start on http://localhost:5173
```

## API Endpoints 📡

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Profiles
- `GET /api/profiles/me` - Get current user profile
- `GET /api/profiles/{userId}` - Get user profile by ID
- `POST /api/profiles` - Create/Update profile

### Activities
- `GET /api/activities` - Get all activities (paginated)
- `GET /api/activities/filter` - Filter activities
- `GET /api/activities/categories` - Get predefined categories
- `GET /api/activities/recommendations` - Get personalized recommendations
- `GET /api/activities/my-created` - Get user's created activities
- `GET /api/activities/my-joined` - Get user's joined activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity
- `POST /api/activities/{id}/complete` - Mark activity as completed

### Participation
- `POST /api/activities/{id}/participants/join` - Request to join
- `GET /api/activities/{id}/participants/pending` - Get pending requests
- `GET /api/activities/{id}/participants` - Get approved participants
- `POST /api/activities/{id}/participants/{participantId}/approve` - Approve request
- `POST /api/activities/{id}/participants/{participantId}/reject` - Reject request

### Chat
- `POST /api/activities/{id}/chat` - Send message
- `GET /api/activities/{id}/chat` - Get all messages
- `GET /api/activities/{id}/chat/poll` - Poll for new messages

### Feedback
- `POST /api/activities/{id}/feedback` - Submit feedback
- `GET /api/activities/{id}/feedback` - Get activity feedback
- `GET /api/users/{userId}/feedback` - Get user feedback

## Environment Variables ⚙️

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ac1_db
spring.datasource.username=root
spring.datasource.password=password

app.jwtSecret=YourSecretKeyHere
app.jwtExpirationMs=86400000
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Testing the Application 🧪

1. **Register a new user** at `/register`
2. **Login** with your credentials
3. **Create your profile** with interests and skills
4. **Browse activities** on the dashboard
5. **Create an activity** or join existing ones
6. **Chat with participants** after being approved
7. **Give feedback** when activity is completed

## Key Features Implementation 🔑

### 1. JWT Authentication
- Secure token-based authentication
- Auto-logout on token expiration
- Protected routes on frontend

### 2. Activity Lifecycle
```
Create Activity → Join Requests → Approval/Rejection → 
Chat with Participants → Complete Activity → Give Feedback
```

### 3. Recommendation Algorithm
Scores activities based on:
- User interests match
- Skill level compatibility
- Location proximity
- Creator rating
- Age appropriateness
- Upcoming activities

### 4. Chat System
- Polling-based message updates
- Real-time conversation feel
- Only available to approved participants

### 5. Feedback & Ratings
- Post-activity peer reviews
- 1-5 star rating system
- Aggregate ratings update user profile
- Influences recommendations

## Design Highlights 🎨

- **Dark Theme**: Modern dark UI with gradient accents
- **Glassmorphism**: Translucent cards with backdrop blur
- **Micro-animations**: Smooth transitions and hover effects
- **Responsive Design**: Mobile-first approach
- **CSS Variables**: Consistent theming throughout

## Security Features 🔒

- Password encryption with BCrypt
- JWT token validation
- CORS configuration
- SQL injection protection
- Input validation on both frontend and backend
- Protected API endpoints

## Future Enhancements 🚧

- [ ] WebSocket-based real-time chat
- [ ] Push notifications
- [ ] Image upload for activities and profiles
- [ ] Admin dashboard
- [ ] User blocking/reporting
- [ ] Advanced search with Elasticsearch
- [ ] Activity reviews and comments
- [ ] Social sharing integration

## Troubleshooting 🔧

### Backend not starting
- Ensure MySQL is running
- Verify database credentials in `application.properties`
- Check if port 8080 is available

### Frontend not connecting to backend
- Verify backend is running on port 8080
- Check CORS settings in `SecurityConfig.java`
- Ensure API base URL is correct

### Build errors
```bash
# Clean and rebuild backend
cd backend
mvn clean install

# Clean and rebuild frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Contributors 👥

Built with ❤️ as a showcase project for modern full-stack development.

## License 📄

This project is created for educational purposes.

---

**Happy Coding! 🚀**
