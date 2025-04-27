# Calendar Application

A full-stack calendar application with user authentication and event management capabilities. Built by Team Infinite Loopers.

## Project Presentation
[View our project presentation on Canva](https://www.canva.com/design/DAGl3G8CkoU/lpR7ETiiLldMSoCCU4KWMg/edit?utm_content=DAGl3G8CkoU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Features

- User Authentication (Login/Register)
- Event Management (Create, Edit, Delete)
- Interactive Calendar Interface
- Real-time Event Updates
- MongoDB Atlas Integration
- Responsive Design
- Social Media Integration
- Profile Cards
- Custom UI Elements

## Tech Stack

### Frontend:
- HTML5/CSS3/JavaScript
- Font Awesome Icons
- Custom Calendar UI
- Responsive Design Components
- Custom Animation Effects

### Backend:
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt for Password Hashing
- CORS Support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas Account
- npm (Node Package Manager)
- Modern Web Browser

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Rbpro2k4/Data-Project#
cd Data-Project
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb+srv://your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
npm start
```

5. Access the frontend:
- Using VS Code Live Server extension
- Or directly open `frontend/index.html` in a browser

## Running with ngrok

To make your application accessible from anywhere:

1. Install ngrok:
```bash
npm install ngrok -g
```

2. Start your backend server:
```bash
cd backend
npm start
```

3. In a new terminal, start ngrok (replace 5000 with your backend port if different):
```bash
ngrok http 5000
```

4. Copy the ngrok HTTPS URL (looks like `https://xxxx-xx-xx-xxx-xx.ngrok-free.app`)

5. Update your frontend configuration:
   - Open your frontend JavaScript files
   - Replace `localhost:5000` with your ngrok URL
   - Example: `const API_URL = 'https://xxxx-xx-xx-xxx-xx.ngrok-free.app';`

6. Access your application:
   - Frontend: Open `frontend/index.html` in any browser
   - Backend API: Available at your ngrok URL
   - Example: `https://xxxx-xx-xx-xxx-xx.ngrok-free.app/api/auth/login`

### Persistent URL Setup (Premium)

To maintain the same URL across server restarts:

1. Sign up for a paid ngrok account at https://ngrok.com/pricing

2. Get your auth token from ngrok dashboard

3. Update your `.env` file with:
```env
NGROK_AUTH_TOKEN=your_auth_token
NGROK_SUBDOMAIN=your-chosen-subdomain
```

4. Start the server:
```bash
cd backend
npm start
```

Your application will always be available at:
`https://your-chosen-subdomain.ngrok.io`

Note: Reserved domains are only available with paid ngrok accounts.

### Security Considerations
- Update your CORS settings in `backend/server.js` to allow ngrok domain
- Keep your ngrok URL private for development/testing only
- Don't commit any ngrok URLs to version control

## Features in Detail

### Authentication
- Secure login/register system
- JWT token-based authentication
- Password hashing with bcrypt
- Social media login buttons (UI implemented)

### Calendar Functions
- Create, edit, and delete events
- Real-time updates
- Time conflict detection
- Event invitations
- Custom event descriptions

### UI Features
- Responsive design
- Interactive animations
- Custom profile cards
- Modern glassmorphism effects
- Mobile-friendly interface

## Project Structure

```
Data-Project/
├── frontend/
│   ├── images/
│   │   ├── index/
│   │   ├── login/
│   │   ├── calendar/
│   │   └── Logo/
│   ├── index.html
│   ├── Login.html
│   ├── Calender.html
│   ├── Cards.html
│   ├── 404.html
│   ├── style.css
│   ├── Login.css
│   ├── Cards.css
│   └── script.js
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── Schedule.js
│   ├── User.js
│   ├── server.js
│   └── .env
└── README.md
```

## API Endpoints

### Authentication:
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Schedule Management:
- POST `/api/schedule/add` - Create new event
- POST `/api/schedule/edit` - Update event
- POST `/api/schedule/remove` - Delete event
- POST `/api/schedule/all` - Get all events
- POST `/api/schedule/leave` - Leave an event

## Contributors
Team: Infinite Loopers
- Jacques Daoura - Frontend Developer
- Jean Marie Chahoud - Database Developer
- Charbel Abi Saad - Backend Developer

## License
This project is licensed under the MIT License.