# Backend Documentation

NFL Journey Backend API - Node.js/Express server with MongoDB.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [Generating Documentation](#generating-documentation)

## 🔧 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or connection string)
- **npm** (comes with Node.js)

## 📦 Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
PORT=3001
MONGODB_URI=mongodb://localhost:27017/nfl-journey
JWT_SECRET=your-secret-key-here
```

## 🚀 Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## 📡 API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `GET /api/teams/name/:teamName` - Get team by name
- `GET /api/teams/conference/:conference` - Get teams by conference
- `POST /api/teams` - Create new team (Admin only)
- `PUT /api/teams/:id` - Update team (Admin only)
- `DELETE /api/teams/:id` - Delete team (Admin only)

### Stadiums
- `GET /api/stadiums/all-stadiums` - Get all stadiums
- `GET /api/stadiums/roof?roofType=Open` - Get stadiums by roof type
- `POST /api/stadiums` - Create stadium (Admin only)
- `PUT /api/stadiums/:id` - Update stadium (Admin only)
- `DELETE /api/stadiums/:id` - Delete stadium (Admin only)

### Graph Algorithms
- `GET /api/dfs?startTeam=TeamName` - Depth-First Search
- `GET /api/bfs?startTeam=TeamName` - Breadth-First Search
- `GET /api/dijkstra?startTeam=TeamName&endTeam=TeamName` - Dijkstra's Algorithm
- `GET /api/astar?startTeam=TeamName&endTeam=TeamName` - A* Algorithm
- `GET /api/kruskal` - Kruskal's Minimum Spanning Tree
- `POST /api/custom-route` - Calculate custom route
- `POST /api/recursive` - Calculate recursive route

### Souvenirs
- `GET /api/souvenirs` - Get all souvenirs
- `POST /api/souvenirs` - Create souvenir (Admin only)
- `PUT /api/souvenirs/:id` - Update souvenir (Admin only)
- `DELETE /api/souvenirs/:id` - Delete souvenir (Admin only)

### Purchases
- `POST /api/purchases/add-to-cart` - Add item to cart
- `PUT /api/purchases/update-cart/:itemId` - Update cart item
- `DELETE /api/purchases/remove-from-cart/:itemId` - Remove from cart
- `GET /api/purchases/cart` - Get current cart
- `POST /api/purchases/checkout` - Complete purchase
- `GET /api/purchases/history` - Get purchase history

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Create admin account

## 📁 Project Structure

```
backend/
├── controllers/          # Business logic
│   ├── teamService.js
│   ├── stadiumService.js
│   ├── graphService.js
│   ├── souvenirsService.js
│   ├── purchaseService.js
│   └── adminService.js
├── models/              # MongoDB schemas
│   ├── Team.js
│   ├── Purchase.js
│   ├── Admin.js
│   ├── Distance.js
│   └── Graph.js         # GraphService class
├── routes/              # API route definitions
│   ├── teamRoutes.js
│   ├── stadiumRoutes.js
│   ├── graphRoutes.js
│   └── ...
├── middleware/          # Express middleware
│   ├── basic.js         # Basic auth
│   ├── errorHandler.js  # Error handling
│   └── upload.js        # File upload
├── utils/               # Utility functions
│   ├── dataStructures.js  # MinHeap, PriorityQueue, UnionFind
│   └── stadiumCoordinates.js
├── scripts/             # Data import scripts (Python)
├── server.js            # Server entry point
└── app.js               # Express app configuration
```

## 🗄️ Data Models

### Team
- `teamName` (String, required, unique)
- `conference` (String, required)
- `division` (String, required)
- `stadium` (Object, embedded)
- `souvenirs` (Array of objects)
- `createdAt`, `updatedAt` (auto-generated)

### Purchase
- `sessionId` (String, required)
- `items` (Array of cart items)
- `totalAmount` (Number)
- `purchaseDate` (Date)
- `status` (String: 'pending' | 'completed')

### Admin
- `email` (String, required, unique)
- `password` (String, hashed)

## 📚 Generating Documentation

### Generate JSDoc documentation:
```bash
npm run docs
```

This creates HTML documentation in the `docs/` folder.

### Watch mode (auto-regenerate on file changes):
```bash
npm run docs:watch
```

### View documentation:
Open `docs/index.html` in your browser.

## 🛠️ Key Features

- **Graph Algorithms**: DFS, BFS, Dijkstra's, A*, Kruskal's MST
- **Data Structures**: MinHeap, PriorityQueue, UnionFind
- **RESTful API**: Clean REST endpoints
- **Authentication**: Basic auth for admin routes
- **MongoDB Integration**: Mongoose ODM
- **Error Handling**: Centralized error handling middleware

## 🧪 Testing

### Test MongoDB Connection:
```bash
node test-mongodb.js
```

### Test API Endpoint:
```bash
curl http://localhost:3001/api/teams
```

## 📝 Notes

- The server uses Express 5.x
- MongoDB connection is configured in `server.js`
- Admin routes require authentication
- Graph algorithms use adjacency matrix representation
- Documentation is generated using JSDoc

## 🔗 Related

- [Frontend Documentation](../frontend/README.md)
- [Main README](../README.md)

