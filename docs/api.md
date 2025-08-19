# API Documentation

## Overview

The Campus Syllabus Hub API is a RESTful service built with Node.js, Express, and MongoDB. It provides endpoints for managing academic resources, user authentication, and learning roadmaps.

## Base URL

```
Development: http://localhost:4000/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

The API uses JWT-based authentication with access and refresh tokens stored in httpOnly cookies.

### Authentication Flow

1. **Register/Login**: Receive access token (15min) and refresh token (7 days)
2. **API Requests**: Access token sent automatically via httpOnly cookie
3. **Token Refresh**: Automatic refresh when access token expires

### Headers

```http
Content-Type: application/json
```

**Note**: Cookies are handled automatically by the browser.

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securePassword123",
  "role": "student"
}
```

**Response:**
```json
{
  "user": {
    "_id": "64f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-..."
  },
  "message": "Registration successful"
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Refresh Token
```http
POST /auth/refresh
```

#### Logout
```http
POST /auth/logout
```

### Users

#### Get Current User
```http
GET /users/me
```

#### Update Profile
```http
PATCH /users/me
```

### Catalog

#### Get Branches
```http
GET /catalog/branches
```

**Response:**
```json
[
  {
    "_id": "64f...",
    "code": "CSE",
    "name": "Computer Science & Engineering"
  },
  {
    "_id": "64f...", 
    "code": "ECE",
    "name": "Electronics & Communication Engineering"
  }
]
```

#### Get Semesters by Branch
```http
GET /catalog/{branch}/semesters
```

#### Get Subjects by Branch and Semester
```http
GET /catalog/{branch}/semesters/{semester}/subjects
```

### Subjects

#### Get Subject by Code
```http
GET /subjects/{code}
```

#### Get Subject Resources
```http
GET /subjects/{code}/resources
```

**Query Parameters:**
- `type`: Filter by resource type (syllabus, lecture, notes, book)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Resources

#### List Resources
```http
GET /resources
```

**Query Parameters:**
- `q`: Search query (full-text search)
- `type`: Resource type (syllabus, lecture, notes, book)
- `branch`: Branch code (CSE, ECE, etc.)
- `semester`: Semester number (1-8)
- `subject`: Subject code
- `addedBy`: User ID filter
- `isApproved`: Approval status (true/false)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (createdAt, qualityScore, title)
- `order`: Sort order (asc, desc)

**Response:**
```json
{
  "resources": [
    {
      "_id": "64f...",
      "type": "lecture",
      "title": "Introduction to Data Structures",
      "url": "https://youtube.com/watch?v=...",
      "description": "Comprehensive introduction to DSA concepts",
      "provider": "NPTEL",
      "subjectRef": {
        "code": "CS301",
        "name": "Data Structures & Algorithms"
      },
      "topics": ["arrays", "linked lists", "complexity"],
      "tags": ["beginner", "fundamentals"],
      "addedBy": {
        "name": "John Doe",
        "role": "moderator"
      },
      "isApproved": true,
      "qualityScore": 85,
      "createdAt": "2024-..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Create Resource (Moderator/Admin only)
```http
POST /resources
```

**Request Body:**
```json
{
  "type": "lecture",
  "title": "Advanced Graph Algorithms",
  "url": "https://youtube.com/watch?v=...",
  "description": "Deep dive into graph algorithms",
  "provider": "Gate Smashers",
  "subjectCode": "CS301",
  "topics": ["graph", "dijkstra", "floyd-warshall"],
  "tags": ["advanced", "algorithms"]
}
```

#### Update Resource (Moderator/Admin only)
```http
PATCH /resources/{id}
```

#### Delete Resource (Admin only)
```http
DELETE /resources/{id}
```

### Roadmaps

#### List Roadmaps
```http
GET /roadmaps
```

**Query Parameters:**
- `branch`: Filter by branch
- `type`: Filter by type (midsem, endsem, practical, general)
- `difficulty`: Filter by difficulty (beginner, intermediate, advanced)
- `subjectCode`: Filter by subject
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "roadmaps": [
    {
      "_id": "64f...",
      "title": "Data Structures Mid-Sem Preparation",
      "description": "Complete preparation guide for DS mid-semester exam",
      "type": "midsem",
      "difficulty": "intermediate",
      "estimatedHours": 40,
      "subjectRef": {
        "code": "CS301",
        "name": "Data Structures & Algorithms"
      },
      "tags": ["mid-sem", "preparation", "practice"],
      "steps": [
        {
          "title": "Arrays and Strings Basics",
          "description": "Master fundamental array operations",
          "estimatedHours": 8,
          "resources": [
            {
              "title": "Array Operations Tutorial",
              "url": "https://...",
              "type": "lecture"
            }
          ]
        }
      ],
      "createdBy": {
        "name": "Dr. Smith",
        "role": "moderator"
      },
      "averageRating": 4.2,
      "totalRatings": 15,
      "createdAt": "2024-..."
    }
  ],
  "pagination": { ... }
}
```

#### Get Roadmap by ID
```http
GET /roadmaps/{id}
```

#### Create Roadmap (Moderator/Admin only)
```http
POST /roadmaps
```

#### Update Roadmap (Moderator/Admin only)
```http
PATCH /roadmaps/{id}
```

#### Delete Roadmap (Admin only)
```http
DELETE /roadmaps/{id}
```

### Ratings

#### Get Ratings for Resource/Roadmap
```http
GET /ratings?resourceId={id}
GET /ratings?roadmapId={id}
```

#### Submit Rating
```http
POST /ratings
```

**Request Body:**
```json
{
  "resourceId": "64f...", // OR roadmapId
  "rating": 4,
  "comment": "Very helpful resource!"
}
```

### Search

#### Global Search
```http
GET /search
```

**Query Parameters:**
- `q`: Search query
- `type`: Filter results (resource, roadmap, subject)
- `branch`: Filter by branch
- `semester`: Filter by semester

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Search endpoints**: 30 requests per minute per IP
- **General endpoints**: 100 requests per minute per IP

## Data Models

### User
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'moderator' | 'admin';
  createdAt: Date;
}
```

### Resource
```typescript
interface Resource {
  _id: string;
  type: 'syllabus' | 'lecture' | 'notes' | 'book';
  title: string;
  url: string;
  description?: string;
  provider?: string;
  subjectRef: ObjectId;
  topics: string[];
  tags: string[];
  addedBy: ObjectId;
  isApproved: boolean;
  qualityScore: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}
```

### Roadmap
```typescript
interface Roadmap {
  _id: string;
  title: string;
  description: string;
  type: 'midsem' | 'endsem' | 'practical' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  subjectRef: ObjectId;
  tags: string[];
  steps: RoadmapStep[];
  createdBy: ObjectId;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
// Using fetch
const response = await fetch('/api/v1/resources', {
  credentials: 'include', // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// Using axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true
});

const resources = await api.get('/resources?branch=CSE&type=lecture');
```

### Python
```python
import requests

session = requests.Session()
session.cookies.update(cookies_from_login)

response = session.get(
    'http://localhost:4000/api/v1/resources',
    params={'branch': 'CSE', 'type': 'lecture'}
)
data = response.json()
```
