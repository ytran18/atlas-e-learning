/**
 * Services Index
 *
 * Central export point for all services
 */

// API Client (for frontend usage)
export * from "./api.client";

// Note: Firestore and Storage services are exported separately to avoid naming conflicts
// Import them directly when needed:
// import { ... } from '@/services/firestore.service'
// import { ... } from '@/services/storage.service'
