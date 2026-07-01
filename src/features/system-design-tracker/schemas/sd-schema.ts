import { z } from "zod";

export const SD_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "needs_revision",
] as const;

export const SD_TOPICS = [
  "Design URL Shortener",
  "Design Twitter",
  "Design YouTube",
  "Design Instagram",
  "Design WhatsApp",
  "Design Uber",
  "Design Netflix",
  "Design Amazon",
  "Design Google Search",
  "Design Google Drive",
  "Design Rate Limiter",
  "Design Notification System",
  "Design Chat System",
  "Design News Feed",
  "Design Web Crawler",
  "Design Payment System",
  "Design API Gateway",
  "Design Load Balancer",
  "Design CDN",
  "Design Distributed Cache",
  "Design Message Queue",
  "Design Distributed Lock",
  "Design Search Autocomplete",
  "Design Typeahead",
  "Design Recommendation System",
  "Other",
] as const;

export const SD_CONCEPTS = [
  "Load Balancing",
  "Caching",
  "Database Sharding",
  "Replication",
  "CAP Theorem",
  "Consistent Hashing",
  "Rate Limiting",
  "Message Queues",
  "API Design",
  "Microservices",
  "SQL vs NoSQL",
  "CDN",
  "Indexing",
  "Pub/Sub",
  "WebSockets",
  "Long Polling",
  "Event Sourcing",
  "CQRS",
  "Distributed Transactions",
  "Idempotency",
  "Availability",
  "Scalability",
  "Fault Tolerance",
  "Monitoring & Alerting",
  "Security",
] as const;

export const createSdSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  status: z.enum(SD_STATUSES),
  concepts: z.array(z.string()).optional(),
  notes: z.string().max(5000).optional(),
  resources: z.array(z.string().url("Must be a valid URL")).optional(),
});

export const updateSdSchema = createSdSchema.partial();

export type CreateSdInput = z.infer<typeof createSdSchema>;
export type UpdateSdInput = z.infer<typeof updateSdSchema>;
