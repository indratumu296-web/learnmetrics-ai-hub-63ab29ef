# 🎓 LearnMetrics AI

## AI-Powered Student Performance Analytics & Academic Management Platform

> **Measure Learning. Predict Success. Improve Outcomes.**

LearnMetrics AI is a modern **Student Academic Management and Analytics Platform** designed to bring academic information, intelligent insights, visualization, and workflow automation into one unified system.

The platform combines **React, Node.js, Express, MySQL, Power BI, Artificial Intelligence, Machine Learning, and n8n automation** to help students, faculty, and administrators manage and understand academic performance more effectively.

Instead of functioning as a traditional marks portal, LearnMetrics AI transforms academic data into **actionable insights, performance trends, risk indicators, personalized recommendations, and automated academic notifications**.

---

## 📌 Table of Contents

- [✨ Project Highlights](#-project-highlights)
- [🎯 Project Objectives](#-project-objectives)
- [👥 User Roles](#-user-roles)
- [🧩 Core Modules](#-core-modules)
- [🤖 AI & Analytics](#-ai--analytics)
- [📊 Power BI Analytics](#-power-bi-analytics)
- [⚙️ Workflow Automation](#️-workflow-automation)
- [🛠️ Technology Stack](#️-technology-stack)
- [🗄️ Database Entities](#️-database-entities)
- [🏗️ System Architecture](#️-system-architecture)
- [📁 Project Structure](#-project-structure)
- [🔌 API Endpoints](#-api-endpoints)
- [📂 Dataset & Data Processing](#-dataset--data-processing)
- [🔐 Security](#-security)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [🗃️ Database Setup](#️-database-setup)
- [▶️ Running the Application](#️-running-the-application)
- [📦 Production Build](#-production-build)
- [🧪 Testing](#-testing)
- [☁️ Deployment](#️-deployment)
- [📚 Documentation](#-documentation)
- [🔮 Future Enhancements](#-future-enhancements)
- [⚠️ Responsible AI](#️-responsible-ai)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Project Highlights

| Capability | Description |
|---|---|
| 🔐 Role-Based Access | Separate access for administrators, faculty, and students |
| 👨‍🎓 Student Management | Manage profiles, academic records, and student information |
| 📝 Marks Management | Store and manage internal, assignment, laboratory, and final examination marks |
| 📅 Attendance Tracking | Monitor overall and subject-wise attendance |
| 🗓️ Academic Calendar | Manage working days, holidays, examinations, and academic events |
| 📚 Learning Resources | Organize syllabus, assignments, notes, and study materials |
| 🤖 AI Academic Assistant | Answer academic questions using authorized student information |
| 🧠 AI Performance Insights | Convert academic data into understandable performance summaries |
| 📈 Predictive Analytics | Identify potential academic risk and performance trends |
| 📊 Power BI Dashboards | Provide interactive analytics for administrators and faculty |
| 🔔 Notifications | Deliver academic reminders, alerts, and announcements |
| ⚡ n8n Automation | Automate academic communication and recurring workflows |
| 📱 Responsive Interface | Designed for a professional web-based academic experience |

---

## 🎯 Project Objectives

LearnMetrics AI is designed around five major objectives:

1. **Centralize academic information** in one platform.
2. **Reduce manual academic administration** through digital workflows.
3. **Visualize student performance** using interactive dashboards.
4. **Use AI and machine learning** to generate meaningful academic insights.
5. **Automate notifications and recurring workflows** to improve communication.

### The Core Idea

```text
Raw Academic Data
       ↓
Data Storage & Processing
       ↓
Analytics & Visualization
       ↓
AI-Based Insights
       ↓
Personalized Recommendations
       ↓
Better Academic Decisions
```

---

# 👥 User Roles

LearnMetrics AI supports three practical access levels.

## 👨‍💼 Administrator

Administrators can manage the academic platform and institutional data.

### Responsibilities

- Add, edit, and delete student records
- Manage faculty members
- Manage subjects
- Upload and manage marks
- Upload and manage attendance
- Upload timetables
- Upload examination schedules
- Manage academic calendars
- Upload syllabus and learning resources
- Publish announcements
- Manage assignments and notes
- View Power BI dashboards
- Review AI-generated analytics
- Identify potentially at-risk students
- Generate academic reports
- Send notifications

---

## 👨‍🏫 Faculty

Authorized faculty members can work with academic information relevant to their teaching responsibilities.

### Faculty capabilities

- View assigned subjects
- Update marks
- Upload attendance
- View student performance
- Review subject-level analytics
- Access relevant academic schedules
- Publish academic announcements
- Share assignments and study materials
- Review performance indicators

---

## 👨‍🎓 Student

Students authenticate using:

- Student ID / Register Number
- Password

### Student dashboard

Students can view:

- Total marks
- Internal marks
- Assignment marks
- Laboratory marks
- Attendance percentage
- Upcoming examinations
- Today's timetable
- Announcements
- Assignments
- Study materials
- AI performance summary
- Subject-wise performance
- Semester performance
- Previous semester performance
- Personalized study recommendations

---

# 🧩 Core Modules

## 1. 🔐 Login & Authentication

The system provides separate authentication for:

- Administrator
- Faculty
- Student

### Security capabilities

- Password hashing
- Secure login sessions
- JWT-based authentication where required
- Role-based access control
- Protected API routes
- Form validation
- Secure error handling
- Logout functionality

---

## 2. 👤 Student Profile

Each student profile can contain:

| Field | Description |
|---|---|
| Name | Student's full name |
| Register Number | Unique academic identifier |
| Department | Academic department |
| Semester | Current semester |
| Section | Assigned section |
| Email | Student email address |
| Phone Number | Contact number |
| Parent Name | Parent/guardian name |
| Parent Mobile | Parent/guardian contact |
| Profile Photo | Student profile image |

---

## 3. 📝 Marks Management

Administrators and authorized faculty members can enter or upload academic marks.

### Example academic structure

| Subject | Internal 1 | Internal 2 | Assignment | Lab | Final Examination |
|---|---:|---:|---:|---:|---:|
| Python | — | — | — | — | — |
| DBMS | — | — | — | — | — |
| Mathematics | — | — | — | — | — |

### Students can view

- Current marks
- Internal marks
- Assignment marks
- Laboratory marks
- Final examination marks
- Subject-wise marks
- Semester marks
- Previous semester marks
- Total marks
- Grade
- GPA
- CGPA

---

## 4. 📅 Attendance Management

Administrators and faculty members can upload or update attendance records.

### Example

| Date | Subject | Status |
|---|---|---|
| August 1 | Python | Present |
| August 2 | DBMS | Absent |
| August 3 | Artificial Intelligence | Present |

### Supported attendance statuses

- Present
- Absent
- Leave
- Medical Leave
- On-Duty

### Student attendance view

- Overall attendance percentage
- Subject-wise attendance
- Daily attendance history
- Monthly attendance graph
- Attendance status summary
- Attendance warnings

---

## 5. 🗓️ Academic Calendar

The academic calendar can display:

- Working days
- Holidays
- Examination days
- College events
- Hackathons
- Workshops
- Seminars
- Semester start date
- Semester end date
- Assignment deadlines

### Calendar indicators

| Indicator | Meaning |
|---|---|
| 🟢 Green | Working Day |
| 🔴 Red | Holiday |
| 🔵 Blue | Examination |
| 🟠 Orange | Event |

The calendar can be implemented using **FullCalendar.js**.

---

## 6. 🤖 AI Academic Chatbot

The AI chatbot allows students to interact with their academic information using natural language.

### Example questions

```text
When is my Python examination?
What is the syllabus for DBMS?
What is my attendance percentage?
What are my internal marks?
Which subject am I weak in?
What should I study today?
What is today's timetable?
When will the results be published?
How can I improve my CGPA?
```

### Example response

> Your Python examination is scheduled for August 18. You currently have 82% attendance in Python and an average mark of 76%.

### Access control

The chatbot should use authenticated student information and must only return information that the currently logged-in student is authorized to access.

---

## 7. 🧠 AI Academic Overview

LearnMetrics AI goes beyond displaying raw numbers.

The AI overview explains academic performance in simple, actionable language.

### Performance insights

- Current GPA trend
- Strongest subject
- Weakest subject
- Attendance analysis
- Academic risk indicators
- Improvement suggestions
- Expected semester GPA
- Recommended study plan
- Target marks for the next examination

### Example

> Your current attendance is 82%. Python is your strongest subject, while Mathematics requires improvement. To achieve your target GPA, try to score at least 18 out of 20 in the next internal examination.

---

## 8. 📊 Power BI Dashboard

Power BI dashboards provide administrators and faculty with interactive academic analytics.

### Dashboard metrics

- Average attendance percentage
- Department comparison
- Top performers
- Lowest performers
- Pass percentage
- Average marks
- Subject-wise performance
- Performance heat map
- Semester comparison
- Monthly attendance trends
- At-risk students
- Attendance distribution
- Optional gender analysis

Power BI reports may be embedded into the web application using **Power BI Embedded**.

---

## 9. 🔮 AI Prediction

The system can use machine learning models and academic data to estimate:

- Students who may fail
- Students who may be academically at risk
- Expected semester GPA
- Attendance decline
- Weak subjects
- Future examination scores
- Performance trends

These predictions are intended to support academic intervention and should not be treated as final decisions.

---

## 10. 🔔 Notification System

Students can receive notifications for:

- Examination reminders
- Holiday announcements
- Assignment deadlines
- Attendance warnings
- Low marks warnings
- Marks publication
- New study materials
- Timetable changes
- Fee reminders
- Important academic announcements

---

# 🤖 AI & Analytics

The intelligence layer is designed around the following pipeline:

```text
Student Academic Data
        ↓
Data Validation
        ↓
Data Processing
        ↓
Performance Metrics
        ↓
Analytics
        ↓
AI / ML Processing
        ↓
Risk & Trend Indicators
        ↓
Personalized Recommendations
```

### Example insight categories

| Category | Example |
|---|---|
| Performance | Strongest and weakest subjects |
| Attendance | Attendance trend and warning |
| Risk | Potential academic risk |
| Goal | Target marks required |
| Recommendation | Suggested study focus |
| Trend | GPA / marks progression |

---

# 📊 Power BI Analytics

The Power BI layer is intended to provide an institutional view of academic performance.

### Suggested dashboard areas

```text
┌──────────────────────────────────────────────────────┐
│              LEARNMETRICS AI ANALYTICS              │
├──────────────┬──────────────┬────────────────────────┤
│ Avg Marks    │ Attendance   │ Pass Percentage        │
├──────────────┴──────────────┴────────────────────────┤
│                                                      │
│              Performance Trends                      │
│                                                      │
├─────────────────────────┬────────────────────────────┤
│ Subject Performance     │ Department Comparison      │
├─────────────────────────┼────────────────────────────┤
│ Attendance Distribution │ At-Risk Students          │
└─────────────────────────┴────────────────────────────┘
```

---

# ⚡ Workflow Automation

LearnMetrics AI can use **n8n** to automate recurring academic workflows.

## Attendance Alert

```text
Attendance falls below 75%
          ↓
n8n workflow is triggered
          ↓
Send email to student
          ↓
Send application notification
          ↓
Notify parent when configured
```

## Marks Published

```text
Faculty uploads marks
          ↓
Backend stores marks
          ↓
n8n workflow is triggered
          ↓
Send email notification
          ↓
Send application notification
```

## Examination Reminder

```text
One day before examination
          ↓
n8n checks examination schedule
          ↓
Send email reminder
          ↓
Send WhatsApp message when configured
          ↓
Send push notification
```

## Weekly AI Report

```text
Every Sunday
     ↓
Collect student performance data
     ↓
Generate AI-based summary
     ↓
Email report to student
     ↓
Email parent when configured
```

## Calendar Update

```text
Administrator updates calendar
          ↓
Backend stores holiday/event
          ↓
n8n workflow is triggered
          ↓
Notify relevant students and faculty
```

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, HTML5, CSS3, JavaScript, Bootstrap |
| Backend | Node.js, Express |
| Database | MySQL |
| Authentication | JWT, bcrypt |
| Charts | Chart.js |
| Analytics | Power BI Embedded |
| AI | OpenAI API or Gemini API |
| Automation | n8n |
| Calendar | FullCalendar.js |
| File Upload | Multer |
| Icons | Lucide Icons |
| Frontend Hosting | Vercel |
| Backend Hosting | Render or Railway |
| Development | Visual Studio Code |
| Version Control | Git, GitHub |

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      Students        │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │   React Frontend     │
                         │ Dashboard / UI / AI  │
                         └──────────┬───────────┘
                                    │ REST API
                         ┌──────────▼───────────┐
                         │ Node.js + Express    │
                         │ Backend Services      │
                         └─────┬──────┬─────────┘
                               │      │
                    ┌──────────▼─┐  ┌─▼──────────────┐
                    │   MySQL    │  │ AI / Analytics │
                    │  Database  │  │ Services       │
                    └────────────┘  └───────┬────────┘
                                             │
                              ┌──────────────▼──────────┐
                              │ Power BI + ML Insights  │
                              └─────────────────────────┘

                 ┌──────────────────────────────────────┐
                 │               n8n                     │
                 │ Notifications / Reports / Automation │
                 └──────────────────────────────────────┘
```

---

# 🗄️ Database Entities

The project organizes academic information around entities such as:

```text
Students
Admins
Faculty
Subjects
Marks
Attendance
Timetable
ExamSchedule
Calendar
Syllabus
Announcements
Assignments
Notes
Notifications
ChatHistory
Predictions
```

### Example relationship concept

```text
Student
  │
  ├── Marks ──────────► Subject
  │
  ├── Attendance ─────► Subject
  │
  ├── ExamSchedule
  │
  ├── Timetable
  │
  ├── Notifications
  │
  ├── ChatHistory
  │
  └── Predictions
```

---

# 📂 Project Structure

```text
learnmetrics/
│
├── README.md
├── LICENSE
├── .gitignore
├── package.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── assets/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── database/
│   ├── services/
│   ├── utils/
│   └── uploads/
│
├── powerbi/
│   ├── StudentPerformance.pbix
│   ├── datasets/
│   ├── dax/
│   └── screenshots/
│
├── n8n/
│   ├── attendance-alert.json
│   ├── exam-reminder.json
│   ├── marks-published.json
│   └── weekly-report.json
│
├── ai/
│   ├── prompts/
│   ├── models/
│   └── README.md
│
├── dataset/
│   └── student_learning_dataset_120_students.csv
│
├── database/
│   ├── schema.sql
│   ├── sample_data.sql
│   └── backup/
│
├── documentation/
│   ├── Project_Report.pdf
│   ├── ER_Diagram.png
│   ├── Flowchart.png
│   ├── UseCaseDiagram.png
│   ├── SRS.pdf
│   └── Presentation.pptx
│
└── tests/
    ├── frontend/
    ├── backend/
    └── test_cases.xlsx
```

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate a user |
| `POST` | `/api/auth/logout` | End the authenticated session |

## Students

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/students` | Retrieve students |
| `GET` | `/api/students/:studentId` | Retrieve a specific student |
| `POST` | `/api/students` | Create a student |
| `PUT` | `/api/students/:studentId` | Update a student |
| `DELETE` | `/api/students/:studentId` | Delete a student |

## Marks

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/marks` | Retrieve marks |
| `POST` | `/api/marks` | Create marks |
| `PUT` | `/api/marks/:markId` | Update marks |

## Attendance

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/attendance` | Retrieve attendance |
| `POST` | `/api/attendance` | Create attendance |
| `PUT` | `/api/attendance/:attendanceId` | Update attendance |

## Analytics & AI

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/analytics/overview` | Retrieve overall analytics |
| `GET` | `/api/analytics/student/:studentId` | Retrieve student analytics |
| `POST` | `/api/chatbot/message` | Send a chatbot message |

## Administration & Academic Data

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/admin/upload-csv` | Upload academic CSV data |
| `GET` | `/api/exams` | Retrieve examination schedule |
| `GET` | `/api/timetable` | Retrieve timetable |
| `GET` | `/api/notifications` | Retrieve notifications |

---

# 📂 Dataset & Data Processing

The project includes a sample student learning dataset:

```text
dataset/student_learning_dataset_120_students.csv
```

The backend can process CSV-based academic data using:

```text
backend/utils/csvParser.js
```

### Example processing flow

```text
CSV Dataset
    ↓
CSV Parser
    ↓
Validation
    ↓
Data Transformation
    ↓
MySQL
    ↓
Analytics / AI / Dashboard
```

---

# 🔐 Security

LearnMetrics AI is designed with role-based academic data access in mind.

### Security measures

- Password hashing using bcrypt
- JWT-based authentication where required
- Role-based authorization
- Protected API routes
- Input/form validation
- Secure session handling
- Controlled access to student information
- Secure error handling
- Environment variables for secrets
- `.env` excluded from version control

### Important principle

> A student should only be able to access their own authorized academic information.

---

# 🚀 Getting Started

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- MySQL
- Git
- Visual Studio Code

Optional services depending on the implementation:

- Power BI
- OpenAI API or Gemini API
- n8n

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd learnmetrics
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000
NODE_ENV=development

JWT_SECRET=your_jwt_secret

DB_HOST=localhost
DB_PORT=3306
DB_NAME=learnmetrics
DB_USER=root
DB_PASSWORD=your_database_password

AI_API_KEY=your_ai_api_key

POWERBI_WORKSPACE_ID=your_workspace_id
POWERBI_REPORT_ID=your_report_id

N8N_WEBHOOK_URL=your_n8n_webhook_url
```

> **Never commit real API keys, database passwords, JWT secrets, or webhook URLs to GitHub.**

---

# 🗃️ Database Setup

## 1. Create the Database

Open MySQL and run:

```sql
CREATE DATABASE learnmetrics;
```

## 2. Import the Schema

From the project root:

```bash
mysql -u root -p learnmetrics < database/schema.sql
```

## 3. Optional Sample Data

If sample data is available in the project:

```bash
mysql -u root -p learnmetrics < database/sample_data.sql
```

---

# ▶️ Running the Application

## Start the Backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend development server will display its local URL in the terminal.

---

# 📦 Production Build

## Build the Frontend

```bash
cd frontend
npm run build
```

## Preview the Production Build

```bash
npm run preview
```

## Backend

Use the backend's configured production start command:

```bash
npm start
```

---

# 🧪 Testing

The project can organize tests into:

```text
tests/
├── frontend/
├── backend/
└── test_cases.xlsx
```

### Suggested testing areas

- Authentication
- Role-based access
- Student CRUD operations
- Marks management
- Attendance calculations
- API validation
- CSV upload
- Dashboard metrics
- AI chatbot access control
- Notification workflows
- Database operations

---

# ☁️ Deployment

The project structure supports the following deployment approach:

| Component | Suggested Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render or Railway |
| Database | MySQL-compatible hosting |
| Analytics | Power BI |
| Automation | n8n |

### Deployment flow

```text
GitHub Repository
       │
       ├──────────────► Frontend ──► Vercel
       │
       └──────────────► Backend ───► Render / Railway
                              │
                              ▼
                            MySQL
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
             Power BI                    n8n
                 │                         │
                 └──────────┬──────────────┘
                            ▼
                     LearnMetrics AI
```

---

# 📚 Documentation

Project documentation can be maintained under:

```text
documentation/
├── Project_Report.pdf
├── ER_Diagram.png
├── Flowchart.png
├── UseCaseDiagram.png
├── SRS.pdf
└── Presentation.pptx
```

This keeps technical documentation, system diagrams, requirements, and presentation material separate from application code.

---

# 🔮 Future Enhancements

Potential future improvements include:

- 📱 Mobile application
- 🌐 Progressive Web App (PWA)
- 📈 Advanced student performance forecasting
- 🧠 More sophisticated ML models
- 🎯 Goal-based study planning
- 📚 AI-generated study schedules
- 📝 AI-assisted assignment support
- 🔍 Advanced academic search
- 📊 More Power BI dashboards
- 🔔 Real-time push notifications
- 💬 WhatsApp integration when configured
- 👨‍👩‍👧 Parent dashboard
- 🏫 Multi-college / multi-institution support
- 🌍 Multi-language support
- 📄 Automated academic report generation

---

# ⚠️ Responsible AI

LearnMetrics AI is intended to provide **academic support and decision assistance**, not to make irreversible decisions about students.

AI-generated predictions should be:

- Reviewed by authorized academic staff
- Interpreted alongside actual academic evidence
- Used to identify opportunities for support
- Protected from unauthorized access
- Communicated responsibly

> **Predictions are indicators, not guarantees.**

---

# 🤝 Contributing

Contributions can follow a simple workflow:

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Make your changes
git add .

# Commit
git commit -m "Add: your feature"

# Push
git push origin feature/your-feature
```

Then open a pull request describing:

- What was changed
- Why it was changed
- How it was tested
- Any limitations or follow-up work

---

# 📄 License

This project includes a `LICENSE` file in the repository.

Refer to the repository license for the terms governing use, modification, and distribution.

---

# 🌟 LearnMetrics AI

### Measure Learning. Predict Success. Improve Outcomes.

LearnMetrics AI brings together **academic management, data analytics, artificial intelligence, visualization, and workflow automation** to create a smarter and more actionable student performance platform.

```text
Manage → Analyze → Understand → Recommend → Improve
```

> Built to turn academic data into meaningful decisions.
