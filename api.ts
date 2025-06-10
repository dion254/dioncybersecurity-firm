import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema,
  insertFeedbackSubmissionSchema,
  insertNewsletterSubscriptionSchema,
  insertChatSessionSchema
} from "./schema";
import { z } from "zod";
import { getAIResponse } from "./lib/openai";
import { sendContactNotification, sendNewsletterWelcome } from "./lib/email";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Blog routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const category = req.query.category as string;
      const posts = await storage.getBlogPosts(category);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      try {
        await sendContactNotification(submission);
      } catch (emailError) {
        console.error("Failed to send contact notification:", emailError);
      }
      
      res.json({ message: "Contact form submitted successfully", id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Feedback form submission
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSubmissionSchema.parse(req.body);
      const feedback = await storage.createFeedbackSubmission(validatedData);
      
      res.json({ message: "Feedback submitted successfully", id: feedback.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error submitting feedback:", error);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  // Newsletter subscription
  app.post("
