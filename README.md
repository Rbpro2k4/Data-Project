# Calendar Application

A full-stack calendar application with user authentication and event management capabilities.

## Features

- User Authentication (Login/Register)
- Event Management (Create, Edit, Delete)
- Interactive Calendar Interface
- Real-time Event Updates
- MongoDB Integration
- Responsive Design

## Tech Stack

- Frontend:
  - HTML/CSS/JavaScript
  - Font Awesome Icons
  - Custom Calendar UI
- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm (Node Package Manager)

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Data-Project
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
npm start
```

5. Run the frontend:
- Open `frontend/index.html` in a web browser
- Or use Live Server in VS Code

## API Endpoints

- Authentication:
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - Login user

- Schedule Management:
  - POST `/api/schedule/add` - Create new event
  - POST `/api/schedule/edit` - Update event
  - POST `/api/schedule/remove` - Delete event
  - POST `/api/schedule/all` - Get all events

## Project Structure

```
Data-Project/
├── frontend/
│   ├── images/
│   ├── index.html
│   ├── Login.html
│   ├── Calender.html
│   └── styles/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── server.js
└── README.md
```

## Contributors
- Team: Infinite Loopers

## License
This project is licensed under the MIT License.