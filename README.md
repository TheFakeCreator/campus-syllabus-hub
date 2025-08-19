# 🎓 Campus Syllabus Hub

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A modern, comprehensive web application designed for college students to easily discover and access academic resources including syllabus, lecture videos, notes, book references, and guided learning roadmaps - all organized by branch, year, semester, and subject.

## 🌟 Features

### 📚 **Academic Resource Management**
- **Structured Organization**: Resources organized by Branch → Year → Semester → Subject
- **Multiple Resource Types**: Syllabus, lecture videos, notes, books, and reference materials
- **Quality Scoring**: Community-driven quality ratings for resources
- **Advanced Search**: Full-text search with filters by type, branch, semester, and subject
- **Provider Integration**: Support for popular educational platforms (NPTEL, Gate Smashers, CodeWithHarry, etc.)

### 🗺️ **Guided Learning Roadmaps**
- **Step-by-Step Learning Paths**: Structured roadmaps for exam preparation (midsems, endsems, practicals)
- **Progress Tracking**: Track completion status with local storage persistence
- **Difficulty Levels**: Beginner, intermediate, and advanced roadmaps
- **Resource Integration**: Direct links to relevant study materials within each step
- **Rating System**: Community ratings and feedback for roadmaps

### 👥 **User Management & Roles**
- **Role-Based Access Control**: Student, Moderator, and Admin roles
- **Secure Authentication**: JWT-based auth with refresh tokens and httpOnly cookies
- **Contribution System**: Moderators can add/edit resources, admins manage everything
- **User Profiles**: Track contributed resources and learning progress

### 🔧 **Developer Experience**
- **Modern Tech Stack**: React + TypeScript + Node.js + MongoDB
- **Monorepo Structure**: Clean separation between frontend and backend
- **Type Safety**: End-to-end TypeScript with shared type definitions
- **Quality Tools**: ESLint, Prettier, Husky, commitlint, comprehensive testing
- **Docker Support**: Easy development and deployment with Docker Compose

## 🏗️ Architecture

```
campus-syllabus-hub/
├── apps/
│   ├── web/          # React + Vite + Tailwind CSS frontend
│   └── api/          # Node.js + Express + MongoDB backend
├── packages/
│   ├── eslint-config/    # Shared ESLint configuration
│   └── tsconfig/         # Shared TypeScript configurations
└── docs/             # Comprehensive documentation
```

### 🎨 **Frontend (React + TypeScript)**
- **Framework**: Vite + React 18 with TypeScript
- **Styling**: Tailwind CSS v3 with dark mode support
- **Routing**: React Router v6 with future flags enabled
- **State Management**: Zustand for lightweight state management
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors for auth
- **Testing**: Vitest + React Testing Library

### ⚙️ **Backend (Node.js + TypeScript)**
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (access + refresh tokens) with httpOnly cookies
- **Validation**: Zod for request/response validation
- **Security**: Helmet, CORS, rate limiting, XSS protection, mongo sanitization
- **Logging**: Pino structured logging
- **Testing**: Jest/Vitest + Supertest for API testing

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **pnpm** 8+
- **MongoDB** 6+ (local installation or MongoDB Atlas)
- **Git** for version control

### 1. Clone and Install
```bash
git clone <repository-url>
cd campus-syllabus-hub
pnpm install
```

### 2. Environment Setup
```bash
# Backend environment
cp apps/api/.env.sample apps/api/.env
# Edit apps/api/.env with your MongoDB URI and JWT secrets

# Frontend environment  
cp apps/web/.env.sample apps/web/.env
# Edit apps/web/.env if needed (default values work for local development)
```

### 3. Database Setup
```bash
# Start MongoDB (if running locally)
# OR ensure MongoDB Atlas connection is configured

# Seed the database with sample data
cd apps/api
pnpm seed
```

### 4. Development Servers
```bash
# Terminal 1: Start API server
cd apps/api
pnpm dev

# Terminal 2: Start web server  
cd apps/web
pnpm dev
```

🎉 **Access the application**:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api/v1
- **API Health Check**: http://localhost:4000/healthz

## 📖 Documentation

- [**API Documentation**](./docs/api.md) - Complete API reference
- [**Frontend Guide**](./docs/frontend.md) - Component architecture and development
- [**Database Schema**](./docs/database.md) - MongoDB collections and relationships  
- [**Deployment Guide**](./docs/deployment.md) - Production deployment instructions
- [**Contributing Guide**](./docs/contributing.md) - How to contribute to the project
- [**Security Guide**](./docs/security.md) - Security best practices and guidelines

## 🛠️ Development Commands

```bash
# Root level commands
pnpm install              # Install all dependencies
pnpm -r build            # Build all packages
pnpm -r dev              # Start all dev servers
pnpm -r test             # Run all tests
pnpm -r lint             # Lint all packages
pnpm -r typecheck        # TypeScript type checking

# API specific
pnpm --filter api dev    # Start API dev server
pnpm --filter api test   # Run API tests
pnpm --filter api seed   # Seed database

# Web specific  
pnpm --filter web dev    # Start web dev server
pnpm --filter web test   # Run frontend tests
pnpm --filter web build # Build for production
```

## 🐳 Docker Development

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing

```bash
# Run all tests
pnpm -r test

# Run tests with coverage
pnpm -r test -- --coverage

# Run specific test suites
pnpm --filter api test
pnpm --filter web test
```

## 📦 Project Structure

```
├── apps/
│   ├── api/src/
│   │   ├── features/          # Feature-based modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── catalog/      # Academic structure (branches, subjects)  
│   │   │   ├── resources/    # Learning resources
│   │   │   └── roadmaps/     # Learning roadmaps
│   │   ├── middleware/       # Express middlewares
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript definitions
│   └── web/src/
│       ├── pages/           # Route components
│       ├── components/      # Reusable UI components
│       ├── lib/            # Utilities and API client
│       └── types/          # Frontend type definitions
├── packages/               # Shared packages
└── docs/                  # Documentation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details on:

- Code of conduct
- Development workflow  
- Pull request process
- Coding standards
- Testing requirements

## 📋 Roadmap

### 🎯 **Current Version (v1.0)**
- ✅ Core resource management
- ✅ Guided learning roadmaps  
- ✅ User authentication & authorization
- ✅ Search and filtering
- ✅ Progress tracking

### 🚀 **Future Enhancements**
- [ ] **Social Features**: Upvoting, commenting, resource recommendations
- [ ] **Admin Dashboard**: Analytics, content moderation, user management
- [ ] **Bulk Import**: CSV/Excel upload for batch resource addition
- [ ] **University Profiles**: Multi-university support with custom curricula
- [ ] **Mobile App**: React Native mobile application
- [ ] **Offline Support**: PWA with offline resource caching
- [ ] **AI Integration**: Smart resource recommendations and study path optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Educational Platforms**: NPTEL, Gate Smashers, CodeWithHarry for inspiring the resource structure
- **Open Source Community**: All the amazing libraries and tools that make this project possible
- **Contributors**: Everyone who helps make this platform better for students

---

**Built with ❤️ for students, by developers who understand the struggle of finding quality study materials.**
