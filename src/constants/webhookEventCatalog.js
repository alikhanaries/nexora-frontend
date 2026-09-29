/**
 * Mirrors backend PHASE_6_EXTERNAL_EVENT_ALLOWLIST (shared/events/event-catalog.js).
 * No GET endpoint exposes the catalog; backend validates eventTypes on create/update.
 */
export const WEBHOOK_DELIVERABLE_EVENT_TYPES = [
  'order.created',
  'order.confirmed',
  'order.status_changed',
  'order.cancelled',
  'shipment.created',
  'shipment.shipped',
  'shipment.delivered',
  'shipment.cancelled',
  'shipment.status_changed',
  'cancellation.created',
  'cancellation.completed',
  'return.created',
  'return.status_changed',
  'product.created',
  'product.updated',
  'product.status_changed',
  'inventory.inventory_changed',
  'inventory.inventory_reserved',
  'inventory.inventory_released',
  'offer.created',
  'offer.updated',
  'offer.status_changed',
  'channel.created',
  'channel.updated',
  'channel.status_changed',
  'price.created',
  'price.updated',
  'price.changed',
];
