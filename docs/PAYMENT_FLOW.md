# Payment Processing Flow

## Overview

This document describes the complete payment processing flow from creation to refund.

## Payment States

```
PENDING → PROCESSING → AUTHORIZED → CAPTURED
                              ↓
                           FAILED
                              ↓
                    REFUNDED / PARTIALLY_REFUNDED
```

## Flow Diagrams

### 1. Create Payment

```
Client Request
    ↓
PaymentController.createPayment()
    ↓
PaymentService.createPayment()
    ├─ Validate payment data
    ├─ Verify customer exists
    ├─ Verify payment status exists
    └─ Create payment in PENDING status
    ↓
PaymentRepository.create()
    ↓
Database (payments table)
```

### 2. Process Payment (Authorize + Capture)

```
Client Request
    ↓
PaymentController.processPayment()
    ↓
PaymentService.processPayment()
    ├─ Validate payment can be processed (status = PENDING)
    ├─ Update status to PROCESSING
    ├─ Authorize via PaymentGatewayPort
    │   ├─ Create AUTHORIZATION transaction
    │   └─ Update status to AUTHORIZED
    ├─ Capture via PaymentGatewayPort
    │   ├─ Create CAPTURE transaction
    │   └─ Update status to CAPTURED
    └─ Handle errors → Update status to FAILED
    ↓
Database Transaction (all or nothing)
```

### 3. Refund Payment

```
Client Request
    ↓
PaymentController.refundPayment()
    ↓
PaymentService.refundPayment()
    ├─ Validate payment can be refunded (status = CAPTURED or PARTIALLY_REFUNDED)
    ├─ Find capture transaction
    ├─ Refund via PaymentGatewayPort
    │   └─ Create REFUND transaction
    └─ Update status to REFUNDED or PARTIALLY_REFUNDED
    ↓
Database Transaction
```

## Transaction Tracking

Every payment operation creates a transaction record:

- **AUTHORIZATION**: When payment is authorized
- **CAPTURE**: When authorized payment is captured
- **REFUND**: When payment is refunded

Each transaction stores:
- Gateway transaction ID
- Gateway response (full JSON)
- Status (SUCCESS/FAILED)
- Amount

## Error Handling

### Authorization Failure
- Payment status → FAILED
- Transaction status → FAILED
- Error details stored in transaction

### Capture Failure
- Payment status → FAILED
- Authorization transaction → SUCCESS
- Capture transaction → FAILED

### Refund Failure
- Payment status unchanged
- Refund transaction → FAILED
- Error details available for retry

## Business Rules

1. **Payment Creation**
   - Must have valid customer
   - Must start in PENDING status
   - Amount must be between MIN_AMOUNT and MAX_AMOUNT

2. **Payment Processing**
   - Can only process PENDING payments
   - Must authorize before capture
   - Both operations must succeed

3. **Payment Refund**
   - Can only refund CAPTURED or PARTIALLY_REFUNDED payments
   - Refund amount cannot exceed original amount
   - Full refund → REFUNDED status
   - Partial refund → PARTIALLY_REFUNDED status

## Gateway Integration

The payment gateway port abstracts the actual gateway implementation:

```typescript
abstract class PaymentGatewayPort {
    abstract authorize(request): Promise<GatewayResponse>;
    abstract capture(transactionId, amount): Promise<GatewayResponse>;
    abstract refund(transactionId, amount): Promise<GatewayResponse>;
}
```

Adapters implement this interface:
- `MpgsPaymentAdapter`
- `CyberSourcePaymentAdapter`

## Example Sequence

```
1. Create Payment (PENDING)
   POST /api/payments
   → Payment created with status PENDING

2. Process Payment
   POST /api/payments/{id}/process
   → Authorize → AUTHORIZED
   → Capture → CAPTURED
   → 2 transactions created

3. Refund Payment (Partial)
   POST /api/payments/{id}/refund
   Body: { "amount": 50.00 }
   → Refund → PARTIALLY_REFUNDED
   → 1 transaction created
```

## Database Schema

### payments
- Stores payment information
- References customer and payment_status
- Soft delete support

### transactions
- Tracks all payment operations
- References payment (cascade delete)
- Stores gateway responses

## Testing Considerations

- Mock payment gateway adapters in tests
- Test state transitions
- Test error scenarios
- Test transaction rollback on failures
