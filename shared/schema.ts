import { z } from "zod";

// Type definitions for Supabase tables
export type User = {
  id: string;
  email: string;
  password?: string;
  created_at: string;
};

export type Profile = {
  id: string;
  username?: string;
  theme: string;
  role: 'admin' | 'member';
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'ingreso' | 'egreso';
  created_at: string;
};

export type ExpenseGroup = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id?: string;
  amount: number;
  type: 'ingreso' | 'egreso' | 'ahorro';
  description?: string;
  date: string;
  created_at: string;
};

export type FixedMonthlyExpense = {
  id: string;
  user_id: string;
  expense_group_id?: string;
  name: string;
  amount: number;
  notes?: string;
  due_date: string;
  payment_source?: string;
  paid: boolean;
  month: string;
  created_at: string;
  updated_at: string;
  expense_groups?: {
    id: string;
    name: string;
  };
};

export type Budget = {
  id: string;
  user_id: string;
  category_id?: string;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  created_at: string;
};

export type Log = {
  id: string;
  user_id: string;
  action: string;
  details?: any;
  created_at: string;
};

export type PushSubscription = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
};

export type InactivityNotification = {
  id: string;
  user_id: string;
  sent_at: string;
  created_at: string;
};

// Insert schemas for form validation
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
});

export const insertProfileSchema = z.object({
  username: z.string().optional(),
  theme: z.string().default("dark"),
  role: z.enum(["admin", "member"]).default("member"),
});

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["ingreso", "egreso"]),
});

export const insertTransactionSchema = z.object({
  category_id: z.string().uuid().optional(),
  amount: z.number().positive(),
  type: z.enum(["ingreso", "egreso", "ahorro"]),
  description: z.string().optional(),
  date: z.string(),
});

export const insertFixedMonthlyExpenseSchema = z.object({
  expense_group_id: z.string().uuid().optional(),
  name: z.string().min(1),
  amount: z.number().positive(),
  notes: z.string().optional(),
  due_date: z.string().optional(),
  payment_source: z.string().optional(),
  paid: z.boolean().default(false),
  month: z.string(),
});

export const insertBudgetSchema = z.object({
  category_id: z.string().uuid().optional(),
  amount: z.number().positive(),
  period: z.enum(["monthly", "yearly"]),
  start_date: z.string(),
  end_date: z.string().optional(),
});

export const insertLogSchema = z.object({
  action: z.string().min(1),
  details: z.any().optional(),
});

export const insertPushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string(),
  auth: z.string(),
});

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertFixedMonthlyExpense = z.infer<typeof insertFixedMonthlyExpenseSchema>;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type InsertLog = z.infer<typeof insertLogSchema>;
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;