# Home Appliance Tracker Backend

Express.js backend API for the Home Appliance Tracker application built with TypeScript, Drizzle ORM, and PostgreSQL.

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/appliance_tracker
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup

Make sure PostgreSQL is running and create the database:

```bash
# Connect to PostgreSQL and create database
createdb appliance_tracker
```

### 4. Generate and Run Migrations

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate
```

### 5. Seed Database (Optional)

```bash
# Populate database with sample data
npm run db:seed
```

### 6. Start Development Server

```bash
# Start with hot reload
npm run dev

# Or build and start production server
npm run build
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Base URL: `/api`

### Endpoints

#### Appliances

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appliances` | Get all appliances with optional filtering |
| GET | `/appliances/stats` | Get dashboard statistics |
| GET | `/appliances/:id` | Get specific appliance by ID |
| POST | `/appliances` | Create new appliance |
| PUT | `/appliances/:id` | Update appliance |
| DELETE | `/appliances/:id` | Delete appliance |

#### Query Parameters for GET `/appliances`

- `search` - Search in name, brand, model
- `filter` - Filter by warranty status (`all`, `active-warranty`, `expiring-soon`)
- `category` - Filter by appliance category
- `limit` - Limit number of results
- `offset` - Pagination offset

### Example Requests

#### Get All Appliances
```bash
GET /api/appliances
GET /api/appliances?search=samsung&filter=active-warranty&limit=10
```

#### Create Appliance
```bash
POST /api/appliances
Content-Type: application/json

{
  "name": "Smart TV",
  "brand": "Samsung",
  "model": "QN55Q80A",
  "serialNumber": "TV123456789",
  "category": "Entertainment",
  "location": "Living Room",
  "purchaseDate": "2023-01-15",
  "warrantyExpiration": "2025-01-15",
  "notes": "55-inch QLED TV"
}
```

## 🗄️ Database Schema

### Appliances Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Appliance name |
| brand | VARCHAR(100) | Brand name |
| model | VARCHAR(100) | Model number |
| serial_number | VARCHAR(100) | Serial number (unique) |
| category | VARCHAR(50) | Category |
| location | VARCHAR(100) | Location in home |
| purchase_date | DATE | Purchase date |
| warranty_expiration | DATE | Warranty end date |
| next_maintenance_date | DATE | Next maintenance (optional) |
| status | ENUM | Warranty status (calculated) |
| notes | TEXT | Additional notes (optional) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:migrate` - Apply migrations to database
- `npm run db:seed` - Seed database with sample data

### Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── database/       # Database schema and migrations
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── app.ts          # Main application file
├── dist/              # Compiled JavaScript files
├── .env               # Environment variables
├── drizzle.config.ts  # Drizzle ORM configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3001 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |

### TypeScript Configuration

The project uses strict TypeScript configuration with ES modules support.

## 🏗️ Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Development**: Hot reload with nodemon

## 🚦 Health Check

The server includes a health check endpoint:

```bash
GET /health
```

Returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📝 Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {...},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **Migration Errors**
   - Run `npm run db:generate` first
   - Check database permissions
   - Verify schema files exist

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process on port 3001

### Logs

Development logs include detailed information about:
- Database queries
- API requests and responses
- Error stack traces
- Performance metrics