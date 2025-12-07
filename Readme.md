Smart Expenses Tracker

A full-stack web application to track personal expenses and income, visualize statistics, and manage finances. The project includes a Node.js/Express backend and a React frontend.

# To Check website login with my user credential

{
email : phanindragullapudi@gmail.com
password: 12345
}

Table of Contents

Features

Tech Stack

Backend Setup

Frontend Setup

API Endpoints

Usage

License

Features

User authentication (signup/login) with JWT

Add, update, delete, and filter expenses

Track income vs. expense

View summaries and charts (by category, type, timeline)

Responsive dashboard for desktop and mobile

Tech Stack

Backend:

Node.js

Express.js

MongoDB (or your choice of database)

JWT Authentication

Frontend:

React.js

React Router

Axios for API calls

Tailwind CSS for styling

Recharts & react-chrono for statistics visualization

Backend Setup

Navigate to backend folder:

cd Backend

Install dependencies:

npm install

Create a .env file:

PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>

Run the backend server:

npm start

The backend will run on http://localhost:5000

Frontend Setup

Navigate to frontend folder:

cd Frontend

Install dependencies:

npm install

Start the frontend development server:

npm run dev

The frontend will run on http://localhost:5173 (or the port Vite assigns)

API Endpoints

Auth

POST /api/auth/signup – Register user

POST /api/auth/login – Login user

Expenses

GET /api/expenses – Fetch all expenses

GET /api/expenses/:id – Fetch single expense

POST /api/expenses – Add new expense

PUT /api/expenses/:id – Update expense

DELETE /api/expenses/:id – Delete expense

DELETE /api/expenses – Delete all expenses

GET /api/expenses/summary – Get summary by type

GET /api/expenses/statistics – Get category & timeline statistics

Usage

Signup and login to the app.

Add income or expense using the form.

Filter, sort, and search expenses using the sidebar.

Click Update to edit an expense or Delete to remove it.

View statistics in the dashboard below the form.

{
"username": "Alice Smith",
"email": "alice@example.com",
"password": "AlicePass1"
}
{
"username": "Bob Johnson",
"email": "bob@example.com",
"password": "BobSecret99"
}
