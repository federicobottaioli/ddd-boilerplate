# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication (for boilerplate purposes). In production, implement JWT or API key authentication.

## Payment Endpoints

### Create Payment

**POST** `/payments`

Creates a new payment in PENDING status.

**Request Body**:
```json
{
  "amount": 100.50,
  "currency": "USD",
  "cardToken": "tok_1234567890",
  "merchantReference": "ORD-12345",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "paymentStatusId": "550e8400-e29b-41d4-a716-446655440000",
  "metadata": {
    "orderId": "12345",
    "source": "web"
  }
}
```

**Response**: `201 Created`
```json
{
  "id": "payment-uuid",
  "amount": 100.50,
  "currency": "USD",
  "merchantReference": "ORD-12345",
  "customerId": "customer-uuid",
  "paymentStatusId": "status-uuid",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Process Payment

**POST** `/payments/{id}/process`

Processes a payment by authorizing and capturing it. Payment must be in PENDING status.

**Response**: `200 OK`
```json
{
  "id": "payment-uuid",
  "amount": 100.50,
  "currency": "USD",
  "merchantReference": "ORD-12345",
  "paymentStatusId": "captured-status-uuid",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Refund Payment

**POST** `/payments/{id}/refund`

Refunds a payment (full or partial). Payment must be in CAPTURED or PARTIALLY_REFUNDED status.

**Request Body** (optional):
```json
{
  "amount": 50.25
}
```

If amount is omitted, full refund is performed.

**Response**: `200 OK`
```json
{
  "id": "payment-uuid",
  "amount": 100.50,
  "currency": "USD",
  "merchantReference": "ORD-12345",
  "paymentStatusId": "refunded-status-uuid",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Get Payment by ID

**GET** `/payments/{id}`

Retrieves a payment with all relations and transactions.

**Response**: `200 OK`
```json
{
  "id": "payment-uuid",
  "amount": 100.50,
  "currency": "USD",
  "merchantReference": "ORD-12345",
  "customerId": "customer-uuid",
  "paymentStatusId": "status-uuid",
  "metadata": {},
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### List Payments

**GET** `/payments`

Retrieves payments with pagination and filters.

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `sortBy` (string, default: createdAt)
- `sortOrder` (ASC | DESC, default: DESC)
- `customerId` (UUID, optional)
- `paymentStatusId` (UUID, optional)
- `merchantReference` (string, optional)
- `minAmount` (number, optional)
- `maxAmount` (number, optional)
- `currency` (string, optional)

**Response**: `200 OK`
```json
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 100,
  "totalPages": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

## Customer Endpoints

### Create Customer

**POST** `/customers`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### List Customers

**GET** `/customers`

**Query Parameters**: `page`, `limit`, `name`, `email`, `sortBy`, `sortOrder`

### Get Customer by ID

**GET** `/customers/{id}`

### Update Customer

**PUT** `/customers/{id}`

### Delete Customer

**DELETE** `/customers/{id}`

## Payment Status Endpoints

### Create Payment Status

**POST** `/payment-statuses`

### List Payment Statuses

**GET** `/payment-statuses`

### Get Payment Status by ID

**GET** `/payment-statuses/{id}`

### Update Payment Status

**PUT** `/payment-statuses/{id}`

### Delete Payment Status

**DELETE** `/payment-statuses/{id}`

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request",
  "code": "VALIDATION_ERROR"
}
```

**Status Codes**:
- `400` - Bad Request (validation errors)
- `404` - Not Found (entity not found)
- `500` - Internal Server Error

## Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:3000/docs
```
