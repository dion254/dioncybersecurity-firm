import { pgTable, serial, varchar, boolean, timestamp, text, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  category: varchar("category", { length: 100 }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact Form Submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feedback Submissions
export const feedbackSubmissions = pgTable("feedback_submissions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }),
  rating: varchar("rating", { length: 10 }),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Newsletter Subscriptions
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat Sessions
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Validation Schemas using Zod

export const insertContactSubmissionSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export const insertFeedbackSubmissionSchema = z.object({
  email: z.string().email().optional(),
  rating: z.string().optional(),
  comments: z.string().optional(),
});

export const insertNewsletterSubscriptionSchema = z.object({
  email: z.string().email(),
});

export const insertChatSessionSchema = z.object({
  sessionId: z.string(),
  userMessage: z.string(),
  aiResponse: z.string(),
});
