# Zameen360

3D Real Estate Visualization website

## Tech Stack

- **Frontend:** React.js + Vite + TypeScript + Three.js + socket.io Client + Axios + Lucide + Hot Toast
- **Backend:** Node.js + Express.js + Socket.IO + JWT + Cloudinary + Multer + Stripe + Nodemailer + bcrypt + Google Gemini AI
- **Database:** PostgreSQL + Prisma ORM
- **Architecture:** Monorepo + Featured Based folder Structure
- **Visualization:** 3D Property Rendering (Web-based)

---

## MonoRepo

```
zameen360/
├── client/
├── server/
```

---

## Features

- 3D visualization of real estate properties
- REST API backend
- Fast and responsive UI
- Monorepo structure

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/zameen360.git
cd zameen360
```

---

### 2. Setup Server

```bash
cd server
npm install
npm run dev
```

---

### 3. Setup Client

```bash
cd client
npm install
npm run dev
```

### 4. DataBase Setup

```bash
cd server
npm install
npx prisma generate
npx prisma migrate
npm run dev
```

---

## 🐋 Alternative: Installation & Setup using Docker

For a fast setup without manual environment configuration, database installations, or dependency matching, you can run the entire Zameen360 ecosystem using Docker Compose.

### Prerequisites

Make sure you have Docker and Docker Compose Plugin installed

### 1. Clone the repository

```bash
git clone https://github.com/your-username/zameen360.git
cd zameen360
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory if you need custom credentials. By default, the Docker composition links to the database container out-of-the-box using:

```env
DATABASE_URL=postgres://postgres:password@postgres:5432/main360
```

### 3. Spin up the Containers

Run the following command in the root folder to build and execute the application suite in the background:

```bash
docker compose up -d --build
```

### 4. Apply Database Migrations

Once the database container is fully initialized, push your database schemas and run structural migrations inside the isolated environment by executing:

```bash
docker compose exec backend npx prisma migrate dev --name init
```

### 5. Access the Project Platforms

- 🖥️ **Frontend Interface (Vite App):** [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend REST API Server:** [http://localhost:5000](http://localhost:5000)
- 🐘 **Database Instance:** Exposed locally at port `5432`

### 5. Stripe Setup

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## Architecture

- **Client (React):**
  3D rendering
- **Server (Node + Express):**
- **Database (PostgreSQL)**

---

## Goals of This Project

- Learn and implement **PERN-stack architecture**
- Practice **3D web visualization techniques**

---

## Author

**Muhammad Mubashir**
Software Engineering Student

## Collaborators

**Umair**
Trainee Software Engineering
**Shazaib**
Trainee Software Engineering

---

## License

- This project is licensed under the MIT License
