# API Documentation: Status-Based Filtering

## Overview
Enhanced the `/appliances` API endpoint with status-based filtering using database-level date comparisons for optimal performance.

## New Query Parameters

### `status` Parameter
Filter appliances based on warranty expiration status:

- **`active`**: Returns appliances where `warranty_expiration >= today`
- **`expiring-soon`**: Returns appliances where `warranty_expiration` is between today and 30 days from now
- **`expired`**: Returns appliances where `warranty_expiration < today`

### `includeCounts` Parameter (Optional)
When set to `true`, returns summary counts alongside the filtered results.

## API Examples

### Basic Status Filtering

```bash
# Get active appliances (warranties still valid)
GET /api/appliances?status=active

# Get appliances expiring within 30 days
GET /api/appliances?status=expiring-soon

# Get expired appliances
GET /api/appliances?status=expired
```

### Combined Filtering

```bash
# Active Samsung appliances
GET /api/appliances?status=active&search=Samsung

# Active appliances in Kitchen category with limit
GET /api/appliances?status=active&category=Kitchen&limit=10
```

### With Count Summary

```bash
# Get all appliances with status counts
GET /api/appliances?includeCounts=true

# Get active appliances with counts
GET /api/appliances?status=active&includeCounts=true
```

## Response Format

### Standard Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Refrigerator",
      "brand": "Samsung",
      "warrantyExpiration": "2026-01-15",
      // ... other fields
    }
  ],
  "count": 5
}
```

### Response with Counts
```json
{
  "success": true,
  "data": [/* appliances array */],
  "counts": {
    "active": 7,
    "expiringSoon": 1,
    "expired": 8
  },
  "count": 16
}
```

## Database Implementation

### Date Logic
- **Today's Date**: `new Date().toISOString().split('T')[0]` (YYYY-MM-DD format)
- **30 Days Future**: `new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)`

### Drizzle ORM Operators Used
- `gte()`: Greater than or equal (≥)
- `lte()`: Less than or equal (≤)
- `lt()`: Less than (<)
- `and()`: Logical AND for date ranges

### Database Queries
```typescript
// Active: warranty_expiration >= today
conditions.push(gte(appliances.warrantyExpiration, today));

// Expiring Soon: warranty_expiration BETWEEN today AND 30days
conditions.push(
  and(
    gte(appliances.warrantyExpiration, today),
    lte(appliances.warrantyExpiration, thirtyDaysFromNow)
  )
);

// Expired: warranty_expiration < today
conditions.push(lt(appliances.warrantyExpiration, today));
```

## Performance Optimizations

1. **Database-Level Filtering**: All date comparisons happen in PostgreSQL
2. **Efficient Aggregation**: Count queries use SQL `COUNT(*)` for performance
3. **Index-Friendly**: Queries utilize indexes on `warranty_expiration` column
4. **Minimal Data Transfer**: Only matching records are returned

## Backward Compatibility

- Existing `filter` parameter still works (`active-warranty`, `expiring-soon`)
- All existing query parameters remain functional
- Response format is backward compatible

## Railway Deployment Ready

The implementation is optimized for Railway deployment with:
- ✅ Environment variable support (`DATABASE_URL`, `PORT`)
- ✅ Production-ready error handling
- ✅ Proper TypeScript compilation
- ✅ Database connection pooling

## Testing

Use the provided test script:
```bash
# Run comprehensive API tests
./backend/test-status-filtering.ps1
```

## Error Handling

- Invalid status values return 400 with validation details
- Database errors are properly caught and logged
- Consistent error response format maintained

## Frontend Integration

### React Query Example
```typescript
// Fetch active appliances
const { data: activeAppliances } = useQuery({
  queryKey: ['appliances', { status: 'active' }],
  queryFn: () => fetch('/api/appliances?status=active').then(res => res.json())
});

// Fetch with counts for dashboard
const { data: appliancesWithCounts } = useQuery({
  queryKey: ['appliances', 'with-counts'],
  queryFn: () => fetch('/api/appliances?includeCounts=true').then(res => res.json())
});
```

This implementation provides efficient, scalable filtering with excellent performance for both small and large datasets.