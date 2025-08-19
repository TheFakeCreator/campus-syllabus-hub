# Database Schema Documentation

## Overview

The Campus Syllabus Hub uses MongoDB as its primary database with Mongoose as the ODM. The database is designed to support a hierarchical academic structure with flexible resource management and user-generated content.

## Database Architecture

```
Academic Hierarchy:
Branch → Program → Year → Semester → Subject → Resources

User System:
User → Resources (created by)
User → Roadmaps (created by) 
User → Ratings (given by)
```

## Collections

### 1. Users Collection

Stores user accounts with role-based access control.

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;           // Unique index
  passwordHash: string;    // Hidden in JSON output
  role: 'student' | 'moderator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `email: 1` (unique)
- `role: 1`
- `createdAt: -1`

**Example Document:**
```json
{
  "_id": "64f8b1234567890abcdef123",
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "passwordHash": "$2b$12$encrypted_password_hash",
  "role": "student",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Branches Collection

Academic branches/departments (CSE, ECE, ME, etc.).

```typescript
interface Branch {
  _id: ObjectId;
  code: string;           // Unique, e.g., "CSE", "ECE"
  name: string;           // Full name
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `code: 1` (unique)
- `name: 1`

**Example Document:**
```json
{
  "_id": "64f8b1234567890abcdef001",
  "code": "CSE",
  "name": "Computer Science & Engineering",
  "description": "Comprehensive computer science and software engineering program",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Programs Collection

Degree programs (B.Tech, M.Tech, etc.).

```typescript
interface Program {
  _id: ObjectId;
  code: string;           // Unique, e.g., "BTECH", "MTECH"
  name: string;
  durationYears: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `code: 1` (unique)
- `durationYears: 1`

### 4. Years Collection

Academic years within programs.

```typescript
interface Year {
  _id: ObjectId;
  number: number;         // 1, 2, 3, 4
  programRef: ObjectId;   // Reference to Program
  name?: string;          // e.g., "First Year", "Final Year"
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `{ programRef: 1, number: 1 }` (unique compound)
- `programRef: 1`

### 5. Semesters Collection

Semesters within academic years.

```typescript
interface Semester {
  _id: ObjectId;
  number: number;         // 1, 2, 3, ..., 8
  yearRef: ObjectId;      // Reference to Year
  name?: string;          // e.g., "Semester 1", "Semester 2"
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `{ yearRef: 1, number: 1 }` (unique compound)
- `yearRef: 1`

### 6. Subjects Collection

Individual subjects/courses.

```typescript
interface Subject {
  _id: ObjectId;
  code: string;           // Unique, e.g., "CS301", "EE201"
  name: string;
  branchRef: ObjectId;    // Reference to Branch
  semesterRef: ObjectId;  // Reference to Semester
  credits: number;
  description?: string;
  topics: string[];       // Array of topic keywords
  prerequisites?: string[]; // Array of prerequisite subject codes
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `code: 1` (unique)
- `{ branchRef: 1, semesterRef: 1 }`
- `branchRef: 1`
- `semesterRef: 1`
- `{ name: 'text', topics: 'text' }` (text index for search)

**Example Document:**
```json
{
  "_id": "64f8b1234567890abcdef301",
  "code": "CS301",
  "name": "Data Structures & Algorithms",
  "branchRef": "64f8b1234567890abcdef001",
  "semesterRef": "64f8b1234567890abcdef201",
  "credits": 4,
  "description": "Fundamental data structures and algorithmic techniques",
  "topics": ["arrays", "linked lists", "trees", "graphs", "sorting", "searching"],
  "prerequisites": ["CS101", "CS201"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 7. Resources Collection

Learning resources (lectures, notes, books, syllabus).

```typescript
interface Resource {
  _id: ObjectId;
  type: 'syllabus' | 'lecture' | 'notes' | 'book';
  title: string;
  url: string;
  description?: string;
  provider?: string;      // e.g., "NPTEL", "Gate Smashers"
  subjectRef: ObjectId;   // Reference to Subject
  topics: string[];       // Specific topics covered
  tags: string[];         // Difficulty, type tags
  addedBy: ObjectId;      // Reference to User
  isApproved: boolean;    // Moderation status
  qualityScore: number;   // 0-100, calculated from ratings
  viewCount: number;      // Track popularity
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `subjectRef: 1`
- `type: 1`
- `{ isApproved: 1, qualityScore: -1 }`
- `addedBy: 1`
- `tags: 1`
- `{ title: 'text', description: 'text', topics: 'text', tags: 'text' }` (text index)
- `createdAt: -1`

**Example Document:**
```json
{
  "_id": "64f8b1234567890abcdef401",
  "type": "lecture",
  "title": "Introduction to Binary Trees",
  "url": "https://www.youtube.com/watch?v=example",
  "description": "Comprehensive introduction to binary tree data structure with examples",
  "provider": "NPTEL",
  "subjectRef": "64f8b1234567890abcdef301",
  "topics": ["binary trees", "tree traversal", "tree operations"],
  "tags": ["beginner", "fundamentals", "video"],
  "addedBy": "64f8b1234567890abcdef123",
  "isApproved": true,
  "qualityScore": 87,
  "viewCount": 1250,
  "createdAt": "2024-01-10T14:30:00.000Z",
  "updatedAt": "2024-01-15T09:45:00.000Z"
}
```

### 8. Roadmaps Collection

Structured learning paths for exam preparation.

```typescript
interface Roadmap {
  _id: ObjectId;
  title: string;
  description: string;
  type: 'midsem' | 'endsem' | 'practical' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  subjectRef: ObjectId;   // Reference to Subject
  tags: string[];
  steps: RoadmapStep[];   // Embedded array of steps
  createdBy: ObjectId;    // Reference to User
  averageRating: number;  // Calculated from ratings
  totalRatings: number;   // Count of ratings
  completedBy: ObjectId[]; // Users who completed this roadmap
  createdAt: Date;
  updatedAt: Date;
}

interface RoadmapStep {
  title: string;
  description: string;
  estimatedHours: number;
  resources: StepResource[]; // Embedded resources
  prerequisites?: string[];  // Other step titles
}

interface StepResource {
  title: string;
  url: string;
  type: 'lecture' | 'notes' | 'practice' | 'reference';
  description?: string;
}
```

**Indexes:**
- `subjectRef: 1`
- `type: 1`
- `difficulty: 1`
- `{ averageRating: -1, totalRatings: -1 }`
- `createdBy: 1`
- `tags: 1`
- `{ title: 'text', description: 'text', tags: 'text' }` (text index)
- `createdAt: -1`

**Example Document:**
```json
{
  "_id": "64f8b1234567890abcdef501",
  "title": "Data Structures Mid-Sem Preparation",
  "description": "Complete preparation roadmap for mid-semester examination",
  "type": "midsem",
  "difficulty": "intermediate",
  "estimatedHours": 40,
  "subjectRef": "64f8b1234567890abcdef301",
  "tags": ["mid-sem", "preparation", "practice"],
  "steps": [
    {
      "title": "Arrays and Strings Fundamentals",
      "description": "Master basic array operations and string manipulation",
      "estimatedHours": 8,
      "resources": [
        {
          "title": "Array Operations Tutorial",
          "url": "https://example.com/arrays",
          "type": "lecture",
          "description": "Comprehensive array operations guide"
        }
      ]
    }
  ],
  "createdBy": "64f8b1234567890abcdef123",
  "averageRating": 4.2,
  "totalRatings": 15,
  "completedBy": ["64f8b1234567890abcdef124", "64f8b1234567890abcdef125"],
  "createdAt": "2024-01-05T16:20:00.000Z",
  "updatedAt": "2024-01-20T11:30:00.000Z"
}
```

### 9. Ratings Collection

User ratings and reviews for resources and roadmaps.

```typescript
interface Rating {
  _id: ObjectId;
  rating: number;         // 1-5 stars
  comment?: string;
  userId: ObjectId;       // Reference to User
  resourceId?: ObjectId;  // Reference to Resource (if rating a resource)
  roadmapId?: ObjectId;   // Reference to Roadmap (if rating a roadmap)
  isHelpful?: boolean;    // User feedback on rating helpfulness
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `{ userId: 1, resourceId: 1 }` (unique compound, prevents duplicate ratings)
- `{ userId: 1, roadmapId: 1 }` (unique compound)
- `resourceId: 1`
- `roadmapId: 1`
- `rating: 1`
- `createdAt: -1`

**Example Document:**
```json
{
  "_id": "64f8b1234567890abcdef601",
  "rating": 4,
  "comment": "Very helpful tutorial, well explained concepts",
  "userId": "64f8b1234567890abcdef124",
  "resourceId": "64f8b1234567890abcdef401",
  "isHelpful": true,
  "createdAt": "2024-01-12T13:45:00.000Z",
  "updatedAt": "2024-01-12T13:45:00.000Z"
}
```

## Relationships and Population

### Common Population Patterns

#### Resources with Subject and Branch Info
```javascript
await Resource.find()
  .populate({
    path: 'subjectRef',
    select: 'code name credits',
    populate: {
      path: 'branchRef',
      select: 'code name'
    }
  })
  .populate('addedBy', 'name role')
  .exec();
```

#### Roadmaps with Complete Context
```javascript
await Roadmap.find()
  .populate({
    path: 'subjectRef',
    select: 'code name',
    populate: {
      path: 'branchRef',
      select: 'code name'
    }
  })
  .populate('createdBy', 'name role')
  .exec();
```

### Aggregation Pipelines

#### Resource Statistics by Subject
```javascript
db.resources.aggregate([
  {
    $match: { isApproved: true }
  },
  {
    $group: {
      _id: '$subjectRef',
      totalResources: { $sum: 1 },
      averageQuality: { $avg: '$qualityScore' },
      resourceTypes: { $addToSet: '$type' },
      totalViews: { $sum: '$viewCount' }
    }
  },
  {
    $lookup: {
      from: 'subjects',
      localField: '_id',
      foreignField: '_id',
      as: 'subject'
    }
  },
  {
    $sort: { totalResources: -1 }
  }
]);
```

#### Popular Roadmaps by Branch
```javascript
db.roadmaps.aggregate([
  {
    $lookup: {
      from: 'subjects',
      localField: 'subjectRef',
      foreignField: '_id',
      as: 'subject'
    }
  },
  {
    $lookup: {
      from: 'branches',
      localField: 'subject.branchRef',
      foreignField: '_id',
      as: 'branch'
    }
  },
  {
    $group: {
      _id: '$branch.code',
      roadmaps: {
        $push: {
          title: '$title',
          rating: '$averageRating',
          completions: { $size: '$completedBy' }
        }
      },
      avgRating: { $avg: '$averageRating' }
    }
  },
  {
    $sort: { avgRating: -1 }
  }
]);
```

## Data Validation

### Mongoose Schema Validation

```javascript
// Example: Resource Schema with Validation
const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['syllabus', 'lecture', 'notes', 'book']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL must be valid HTTP/HTTPS URL'
    }
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  topics: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 20; // Max 20 topics
      },
      message: 'Cannot have more than 20 topics'
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});
```

## Performance Considerations

### Indexing Strategy

1. **Query Patterns**: Indexes designed for common query patterns
2. **Compound Indexes**: For multi-field queries (branch + semester)
3. **Text Indexes**: For full-text search across resources and roadmaps
4. **Sparse Indexes**: For optional fields with frequent null values

### Query Optimization

1. **Projection**: Only select needed fields
2. **Pagination**: Use limit/skip with proper sorting
3. **Population Limits**: Avoid deep population chains
4. **Aggregation**: Use aggregation pipelines for complex queries

### Caching Strategy

1. **Application Level**: Cache frequently accessed data (branches, subjects)
2. **Database Level**: MongoDB's internal caching
3. **CDN**: Cache static content and API responses
4. **Redis**: For session storage and temporary data

## Backup and Migration

### Backup Strategy
```bash
# Daily backup
mongodump --uri="mongodb://localhost:27017/campus_syllabus_hub" --out=/backups/$(date +%Y%m%d)

# Backup with compression
mongodump --uri="mongodb://localhost:27017/campus_syllabus_hub" --gzip --archive=/backups/backup_$(date +%Y%m%d).gz
```

### Migration Scripts
```javascript
// Example: Add new field to existing documents
db.resources.updateMany(
  { viewCount: { $exists: false } },
  { $set: { viewCount: 0 } }
);

// Example: Data transformation
db.subjects.updateMany(
  { topics: { $type: "string" } },
  [{ $set: { topics: { $split: ["$topics", ","] } } }]
);
```

## Security Considerations

1. **Input Sanitization**: Use mongo-sanitize to prevent injection
2. **Field Selection**: Never expose sensitive fields (passwordHash)
3. **Access Control**: Implement proper role-based access
4. **Audit Logging**: Track data modifications
5. **Connection Security**: Use SSL/TLS for database connections

## Development Tools

### Useful MongoDB Commands
```javascript
// Find resources with poor quality scores
db.resources.find({ qualityScore: { $lt: 30 } }).sort({ qualityScore: 1 });

// Count resources by type
db.resources.aggregate([
  { $group: { _id: "$type", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Find subjects with no resources
db.subjects.aggregate([
  {
    $lookup: {
      from: "resources",
      localField: "_id",
      foreignField: "subjectRef",
      as: "resources"
    }
  },
  { $match: { "resources": { $size: 0 } } },
  { $project: { code: 1, name: 1 } }
]);
```

### Database Seeding

The application includes a comprehensive seeding script that populates:
- Academic structure (branches, programs, years, semesters)
- Sample subjects for different branches
- Educational resources from popular platforms
- Example roadmaps for exam preparation
- Test users with different roles

Run with: `pnpm --filter api seed`
