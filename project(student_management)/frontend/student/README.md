# Student Management System

This is a simple Student Management System made for the Full Stack Development Workshop assignment.

## Technologies Used

- React.js
- Node.js
- Express.js
- HTML
- CSS
- JavaScript
- Fetch API

No database is used. Student records are stored in a JavaScript array in the backend.

## Features

- Add student
- View students
- Update student
- Delete student
- Search student by ID or name
- Form validation
- Server-side validation
- Duplicate Student ID check

## Project Structure

```text
Student-Management-System/
├── backend/
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchStudent.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   └── StudentList.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## How to Run

### Backend

Open a terminal inside the `backend` folder:

```bash
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

### Frontend

Open another terminal inside the `frontend` folder:

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Add student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

## Sample Student

```json
{
    "id": 101,
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "branch": "CSE",
    "semester": 3,
    "mobile": "9876543210"
}
```

## Important

The data is stored in an in-memory array, so it will be reset when the Node.js server is restarted. This is required by the assignment.