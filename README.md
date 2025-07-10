# Full Stack Project: mCal

## About mCal

mCal is a **comprehensive productivity suite** designed to streamline your daily tasks and enhance your focus. It integrates a calendar for event management, a versatile note-taking feature, and a built-in Pomodoro timer.
This full-stack application provides a seamless experience across devices, helping users stay organized and efficient.

---

## Features

- **User Authentication:**
    - Secure signup with email, username, password, and profile details.
    - Login/logout functionality.
    - Welcome email sent upon successful signup.
    - Protected areas accessible only after login (with token).

- **Homepage:**
    - Landing page with login and signup options.
    - After login: dashboard showing upcoming events, tasks, recent notes, and a quick-start Pomodoro.

- **Calendar:**
    - **Events:**
        - Create, view, edit, and delete calendar events.
        - Set event title, description, date, time, and notifications (including email reminders).
        - Highly flexible recurrence rules for events and reminders.
        - Events appear instantly on the calendar after creation or update.
    - **Tasks:**
        - Create, view, edit, and delete tasks.
        - Set task deadlines with optional email reminders.
        - Incomplete tasks past deadline can trigger reminders.
        - Tasks appear on the calendar and in a separate task view ordered by deadline.
    - **Study Plans:**
        - Create study plan events with custom Pomodoro phases and number of cycles.
        - Launch the Pomodoro directly from a scheduled study plan.
        - Optionally auto-postpone unused study plans to the next day.

- **Notes:**
    - Create, view, edit, duplicate, and delete notes.
    - Support for tags, colors, and real-time Markdown preview.
    - List all notes with sorting options.

- **Pomodoro Timer:**
    - **Simple Pomodoro:**
        - Set focus and break durations and number of cycles.
        - Timer view with controls for the session.
    - **Session Planner:**
        - Automatically generate a Pomodoro session based on desired study duration, intensity, and cycle length.
        - View the upcoming steps in the session (if not infinite).

- **Time Machine:**
    - Change the current date and time for the entire app (affects all views and data).
    - Changes take effect instantly without reloading the page.
    - Triggers all email notifications relevant to the selected date.
    - Protected by a password to prevent unauthorized changes.
    - “Reset” button restores the real current time.

- **Real-time Updates:**
    - All calendar items, notes, tasks, and events update visually as soon as they are modified.
    - Time Machine changes propagate immediately throughout the app.



---

## Some Technologies Used

### Frontend

- **React** — JavaScript library for building user interfaces.
- **Vite** — Fast build tool and development server.
- **TypeScript** — Strongly-typed superset of JavaScript.
- **Tailwind CSS** — Utility-first CSS framework.
- **ShadCN UI** — Customizable React UI components.
- **Axios** — HTTP client for API requests.
- **React FullCalendar** — Calendar component for displaying events and tasks.
- **React Datepicker** — Date selection component.
- **Lucide React** — SVG icon library for React.

### Backend

- **Node.js + Express** — Server-side JavaScript runtime.
- **TypeScript** — Strongly-typed superset of JavaScript.
- **MongoDB + Mongoose** — NoSQL database.
- **JSON Web Tokens (JWT)** — Token-based user authentication.
- **Node-Cron** — Scheduler for running background tasks like recurring email notifications.
- **Nodemailer** — Email sending library used for notifications.
- **Bcrypt** — Library for secure password hashing.

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mikegaravani/mCal
    cd mCal
    ```

2.  **Backend Setup:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory with the following variables:
    ```
    PORT=3000
    MONGO_URI="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret_key"
    ADMIN_PASSWORD="your_admin_password"
    SMTP_HOST="your_email_host"
    SMTP_PORT=465
    SMTP_USER="your_notification_email"
    SMTP_PASS="your_notification_password"
    FROM_EMAIL="your_notification_email"
    ```

    Create a new mongodb database and add its URI in the .env file.

    Start the backend server:
    ```bash
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../client
    npm install
    ```
    Start the frontend development server:
    ```bash
    npm run dev
    ```

The application should now be running on `http://localhost:5173` (frontend) and the API server on `http://localhost:3000` (backend).

---

## License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## Contact

For any inquiries or feedback, please reach out to Mike Garavani at [michele@garavani.ch](mailto:michele@garavani.ch).
