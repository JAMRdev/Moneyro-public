import { pgTable, text, serial, integer, boolean, uuid, timestamp, numeric, date, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const transactionTypeEnum = pgEnum("transaction_type", ["ingreso", "egreso", "ahorro"]);
export const categoryTypeEnum = pgEnum("category_type", ["ingreso", "egreso"]);
export const appRoleEnum = pgEnum("app_role", ["admin", "member"]);

// Users table (for authentication)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  username: text("username"),
  theme: text("theme").notNull().default("dark"),
  role: appRoleEnum("role").notNull().default("member"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: categoryTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Expense groups table
export const expenseGroups = pgTable("expense_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  description: text("description"),
  transactionDate: date("transaction_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fixed monthly expenses table
export const fixedMonthlyExpenses = pgTable("fixed_monthly_expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  month: date("month").notNull(),
  expenseGroupId: uuid("expense_group_id").references(() => expenseGroups.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  dueDate: text("due_date"),
  amount: numeric("amount", { precision: 10, scale: 2 }).default("0"),
  paid: boolean("paid").default(false),
  notes: text("notes"),
  paymentSource: text("payment_source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Budgets table
export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id),
  period: text("period").default("monthly"),
  startDate: date("start_date").defaultNow(),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Logs table
export const logs = pgTable("logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  userEmail: text("user_email"),
  action: text("action").notNull(),
  location: text("location"),
  details: jsonb("details"),
  deviceInfo: text("device_info"),
});

// Push subscriptions table
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscription: jsonb("subscription").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Inactivity notifications table
export const inactivityNotifications = pgTable("inactivity_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  lastTransactionDate: timestamp("last_transaction_date"),
  notificationSentAt: timestamp("notification_sent_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  transactions: many(transactions),
  expenseGroups: many(expenseGroups),
  fixedMonthlyExpenses: many(fixedMonthlyExpenses),
  budgets: many(budgets),
  pushSubscriptions: many(pushSubscriptions),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.id],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
  budgets: many(budgets),
}));

export const expenseGroupsRelations = relations(expenseGroups, ({ one, many }) => ({
  user: one(users, {
    fields: [expenseGroups.userId],
    references: [users.id],
  }),
  fixedMonthlyExpenses: many(fixedMonthlyExpenses),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const fixedMonthlyExpensesRelations = relations(fixedMonthlyExpenses, ({ one }) => ({
  user: one(users, {
    fields: [fixedMonthlyExpenses.userId],
    references: [users.id],
  }),
  expenseGroup: one(expenseGroups, {
    fields: [fixedMonthlyExpenses.expenseGroupId],
    references: [expenseGroups.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertFixedMonthlyExpenseSchema = createInsertSchema(fixedMonthlyExpenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLogSchema = createInsertSchema(logs).omit({
  id: true,
  createdAt: true,
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type FixedMonthlyExpense = typeof fixedMonthlyExpenses.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type Log = typeof logs.$inferSelect;
export type ExpenseGroup = typeof expenseGroups.$inferSelect;
