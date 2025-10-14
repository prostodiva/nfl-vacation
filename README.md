# Fullstack Project Template

A modern fullstack application template with React frontend and Express backend.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```
   If not installed, download from [nodejs.org](https://nodejs.org/)

2. **MongoDB** (for database)
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

### 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fullstack-project-setup
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### 🏃‍♂️ Running the Application

1. **Start MongoDB** (if not already running)
   ```bash
   brew services start mongodb-community
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on: `http://localhost:3001`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

4. **Open your browser** and visit: `http://localhost:5173`

## 📁 Project Structure

```
fullstack-project-setup/
├── backend/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── middleware/         # Express middleware
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles with Tailwind
│   ├── vite.config.ts      # Vite configuration
│   └── package.json
└── README.md
```

## 🛠️ Available Scripts

### Backend
```bash
cd backend
npm run dev          # Start development server with nodemon
npm run start        # Start production server
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run preview      # Preview production build
```

## 🧪 Testing

### Test MongoDB Connection
```bash
cd backend
node test-mongodb.js
```

### Test API Endpoint
```bash
curl http://localhost:3001/api/test
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development server

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🔧 Configuration

### Environment Variables
Create `.env` files in the backend directory:
```bash
# backend/.env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key
```

### Database
- MongoDB runs on `localhost:27017`
- Default database: `test-database`
- Connection string: `mongodb://localhost:27017/your-database`

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Run `npm run build` (if applicable)
3. Start with `npm start`

### Frontend Deployment
1. Run `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   - The backend now uses port 3001 by default

2. **MongoDB connection failed**
   - Ensure MongoDB service is running: `brew services start mongodb-community`

3. **Frontend build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

4. **CORS errors**
   - Backend has CORS configured for development

### Getting Help
- Check the console for error messages
- Ensure all services are running
- Verify all dependencies are installed 