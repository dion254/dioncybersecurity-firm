import { Pool } from "pg";
import { drizzle } from "drizzle-orm/postgres-js";
import pg from "pg";
import {
  users,
  blogPosts,
  testimonials,
  contactSubmissions,
  feedbackSubmissions,
  newsletterSubscriptions,
  chatSessions,
} from "../schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mydb",
});

const db = drizzle(pool);

export const storage = {
  // Blog posts
  async getBlogPosts(category?: string) {
    if (category) {
      return await db.select().from(blogPosts).where(blogPosts.category.eq(category));
    }
    return await db.select().from(blogPosts);
  },

  async getBlogPost(id: number) {
    return await db.select().from(blogPosts).where(blogPosts.id.eq(id)).limit(1).then((rows) => rows[0]);
  },

  // Testimonials (approved only)
  async getApprovedTestimonials() {
    return await db.select().from(testimonials).where(testimonials.isApproved.eq(true));
  },

  // Contact submissions
  async createContactSubmission(data: any) {
    const [created] = await db.insert(contactSubmissions).values(data).returning();
    return created;
  },

  // Feedback submissions
  async createFeedbackSubmission(data: any) {
    const [created] = await db.insert(feedbackSubmissions).values(data).returning();
    return created;
  },

  // Newsletter subscription
  async getNewsletterSubscription(email: string) {
    const [subscription] = await db.select().from(newsletterSubscriptions).where(newsletterSubscriptions.email.eq(email));
    return subscription;
  },

  async createNewsletterSubscription(data: any) {
    const [created] = await db.insert(newsletterSubscriptions).values(data).returning();
    return created;
  },

  // Chat sessions
  async createChatSession(data: any) {
    const [created] = await db.insert(chatSessions).values(data).returning();
    return created;
  },

  async getChatHistory(sessionId: string) {
    return await db.select().from(chatSessions).where(chatSessions.sessionId.eq(sessionId));
  }
};
