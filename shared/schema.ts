import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (for authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Customer schema
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Contact schema (persons associated with a customer company)
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  position: text("position"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Brand schema (equipment brands)
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
});

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

// Category schema (equipment categories)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Equipment schema
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model"),
  serialNumber: text("serial_number"),
  brandId: integer("brand_id"),
  categoryId: integer("category_id"),
  purchaseDate: date("purchase_date"),
  purchasePrice: integer("purchase_price"),
  status: text("status").notNull().default("available"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  createdAt: true,
});

export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;

// Maintenance schema
export const maintenance = pgTable("maintenance", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  type: text("type").notNull(), // Scheduled, Emergency, Preventive
  description: text("description").notNull(),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  cost: integer("cost"),
  notes: text("notes"),
  status: text("status").notNull().default("scheduled"), // scheduled, in-progress, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMaintenanceSchema = createInsertSchema(maintenance).omit({
  id: true,
  createdAt: true,
});

export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;
export type Maintenance = typeof maintenance.$inferSelect;

// Rental schema
export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  returnDate: timestamp("return_date"),
  dailyRate: integer("daily_rate"),
  status: text("status").notNull().default("active"), // active, completed, overdue
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRentalSchema = createInsertSchema(rentals).omit({
  id: true,
  returnDate: true,
  createdAt: true,
});

export type InsertRental = z.infer<typeof insertRentalSchema>;
export type Rental = typeof rentals.$inferSelect;
