# Order History Pagination

## Overview
The Order History API supports cursor-based pagination for efficient browsing of large result sets without loading unbounded history.

## Endpoint
GET /api/v1/coordinator/orders/history?limit=20&cursor={cursor}

## Parameters

### limit (optional)
- Type: `integer`
- Default: `20`
- Min: `1`
- Max: `100`
- Description: Number of orders to return per page

### cursor (optional)
- Type: `string` (base64url encoded)
- Description: Cursor from previous response to fetch next page
- Default: `null` (first page)

## Response

### Success (200)
```json
{
  "data": [
    {
      "id": "order_123",
      "createdAt": "2026-06-28T00:00:00Z",
      "status": "completed",
      "amount": 1000
    }
  ],
  "pagination": {
    "limit": 20,
    "cursor": null,
    "hasMore": true,
    "nextCursor": "eyJpZCI6Im9yZGVyXzEyMyIsInRzIjoxNjg5..."
  }
}
```

### Error (400)
```json
{
  "error": "Limit cannot exceed 100",
  "code": "LIMIT_TOO_LARGE",
  "status": 400
}
```

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_LIMIT_FORMAT` | 400 | Limit is not a valid number |
| `LIMIT_TOO_SMALL` | 400 | Limit is less than minimum (1) |
| `LIMIT_TOO_LARGE` | 400 | Limit exceeds maximum (100) |
| `INVALID_CURSOR` | 400 | Cursor is invalid or expired |
| `MALFORMED_CURSOR` | 400 | Cursor format is corrupted |

## Usage Examples

### First Page
```bash
curl "https://api.stellar.dev/api/v1/coordinator/orders/history?limit=20"
```

### Next Page
```bash
curl "https://api.stellar.dev/api/v1/coordinator/orders/history?limit=20&cursor=eyJpZCI6Im9yZGVyXzEyMyIsInRzIjoxNjg5..."
```

### Empty Result
If `hasMore` is `false`, you've reached the end of results.

## Stable Ordering
Results are ordered by:
1. Creation timestamp (descending)
2. Order ID (ascending)

This ensures stable pagination even if new orders are added.
