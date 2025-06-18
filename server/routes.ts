import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { 
  categories,
  transactions,
  fixedMonthlyExpenses,
  expenseGroups,
  budgets,
  logs
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize database with sample data
  app.get("/api/init", async (req, res) => {
    try {
      // Check if categories exist
      const existingCategories = await db.select().from(categories).limit(1);
      
      if (existingCategories.length === 0) {
        // Insert default categories
        const defaultCategories = [
          { name: 'Alquiler vivienda', type: 'egreso' as const },
          { name: 'Comida', type: 'egreso' as const },
          { name: 'Deudas', type: 'egreso' as const },
          { name: 'Expensas vivienda', type: 'egreso' as const },
          { name: 'Gastos personales', type: 'egreso' as const },
          { name: 'Mascotas', type: 'egreso' as const },
          { name: 'Regalos', type: 'egreso' as const },
          { name: 'Salud/médicos', type: 'egreso' as const },
          { name: 'Servicios', type: 'egreso' as const },
          { name: 'Transporte/Auto', type: 'egreso' as const },
          { name: 'Viajes', type: 'egreso' as const },
          { name: 'Otros gastos', type: 'egreso' as const },
          { name: 'Apoyo familia', type: 'egreso' as const },
          { name: 'Sueldo Ale', type: 'ingreso' as const },
          { name: 'Sueldo Car', type: 'ingreso' as const },
          { name: 'Aguinaldo Ale', type: 'ingreso' as const },
          { name: 'Aguinaldo Car', type: 'ingreso' as const },
          { name: 'Otros ingresos', type: 'ingreso' as const },
          { name: 'Apoyo familia', type: 'ingreso' as const }
        ];
        
        await db.insert(categories).values(defaultCategories);
      }
      
      res.json({ message: "Database initialized successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Unknown error" });
    }
  });
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      // For now, create a demo user session
      const sessionId = Math.random().toString(36);
      const userId = "demo-user-id";
      sessions.set(sessionId, userId);
      
      res.json({ 
        success: true, 
        sessionId,
        user: { id: userId, email: "demo@example.com" }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ success: true });
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const result = await db.select().from(categories).orderBy(categories.name);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const result = await db.insert(categories).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertCategorySchema.partial().parse(req.body);
      const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(categories).where(eq(categories.id, id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const result = await db.select().from(transactions).orderBy(desc(transactions.transactionDate));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Unknown error" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const data = insertTransactionSchema.parse({
        ...req.body,
        userId: "demo-user-id" // TODO: Get from session
      });
      const result = await db.insert(transactions).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertTransactionSchema.partial().parse(req.body);
      const result = await db.update(transactions).set(data).where(eq(transactions.id, id)).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(transactions).where(eq(transactions.id, id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Expense groups routes
  app.get("/api/expense-groups", async (req, res) => {
    try {
      const result = await db.select().from(expenseGroups).orderBy(expenseGroups.name);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/expense-groups", async (req, res) => {
    try {
      const data = {
        ...req.body,
        userId: "demo-user-id" // TODO: Get from session
      };
      const result = await db.insert(expenseGroups).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Fixed monthly expenses routes
  app.get("/api/fixed-monthly-expenses", async (req, res) => {
    try {
      const { month } = req.query;
      
      let query = db.select({
        id: fixedMonthlyExpenses.id,
        month: fixedMonthlyExpenses.month,
        name: fixedMonthlyExpenses.name,
        dueDate: fixedMonthlyExpenses.dueDate,
        amount: fixedMonthlyExpenses.amount,
        paid: fixedMonthlyExpenses.paid,
        notes: fixedMonthlyExpenses.notes,
        paymentSource: fixedMonthlyExpenses.paymentSource,
        createdAt: fixedMonthlyExpenses.createdAt,
        updatedAt: fixedMonthlyExpenses.updatedAt,
        userId: fixedMonthlyExpenses.userId,
        expenseGroupId: fixedMonthlyExpenses.expenseGroupId,
        expenseGroups: {
          id: expenseGroups.id,
          name: expenseGroups.name
        }
      }).from(fixedMonthlyExpenses)
      .leftJoin(expenseGroups, eq(fixedMonthlyExpenses.expenseGroupId, expenseGroups.id));
      
      if (month) {
        query = query.where(eq(fixedMonthlyExpenses.month, month as string));
      }
      
      const result = await query.orderBy(fixedMonthlyExpenses.name);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/fixed-monthly-expenses", async (req, res) => {
    try {
      const data = insertFixedMonthlyExpenseSchema.parse({
        ...req.body,
        userId: "demo-user-id" // TODO: Get from session
      });
      const result = await db.insert(fixedMonthlyExpenses).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/fixed-monthly-expenses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertFixedMonthlyExpenseSchema.partial().parse(req.body);
      const result = await db.update(fixedMonthlyExpenses).set(data).where(eq(fixedMonthlyExpenses.id, id)).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/fixed-monthly-expenses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(fixedMonthlyExpenses).where(eq(fixedMonthlyExpenses.id, id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Budgets routes
  app.get("/api/budgets", async (req, res) => {
    try {
      const result = await db.select().from(budgets).orderBy(budgets.name);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const data = insertBudgetSchema.parse({
        ...req.body,
        userId: "demo-user-id" // TODO: Get from session
      });
      const result = await db.insert(budgets).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/budgets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertBudgetSchema.partial().parse(req.body);
      const result = await db.update(budgets).set(data).where(eq(budgets.id, id)).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/budgets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(budgets).where(eq(budgets.id, id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Logs routes (admin only)
  app.get("/api/logs", async (req, res) => {
    try {
      const result = await db.select().from(logs).orderBy(desc(logs.createdAt));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/logs", async (req, res) => {
    try {
      const data = {
        ...req.body,
        userId: "demo-user-id", // TODO: Get from session
        createdAt: new Date()
      };
      const result = await db.insert(logs).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Email notification routes (replacing Supabase Edge Functions)
  app.post("/api/send-push-notification", async (req, res) => {
    try {
      // TODO: Implement push notification logic
      res.json({ message: "Push notification sent" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/send-inactivity-notifications", async (req, res) => {
    try {
      // TODO: Implement inactivity notification logic
      res.json({ message: "Inactivity notifications sent" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/send-manual-email", async (req, res) => {
    try {
      // TODO: Implement manual email logic
      res.json({ message: "Manual email sent" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
