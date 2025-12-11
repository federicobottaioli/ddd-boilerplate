import { DomainException } from './domain.exception';
import ErrorCode from '../constants/error-codes';

/**
 * Exception thrown when an entity is not found.
 */
export class EntityNotFoundException extends DomainException {
    readonly code = ErrorCode.NOT_FOUND;
    readonly entityType: string;
    readonly entityId?: string;

    constructor(entityType: string, entityId?: string, cause?: unknown) {
        const message = entityId ? `${entityType} with id ${entityId} not found` : `${entityType} not found`;
        super(message, cause);
        this.entityType = entityType;
        this.entityId = entityId;
    }
}
