"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Budget Management Actions
export async function createBudget(formData: FormData) {
  const userId = formData.get("userId") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const totalAmount = Number.parseFloat(formData.get("totalAmount") as string)
  const currency = (formData.get("currency") as string) || "USD"
  const budgetType = (formData.get("budgetType") as string) || "monthly"
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string
  const alertThreshold = Number.parseFloat(formData.get("alertThreshold") as string) || 80

  try {
    const [budget] = await sql`
      INSERT INTO budgets (
        user_id, name, description, total_amount, currency, 
        budget_type, start_date, end_date, alert_threshold
      )
      VALUES (
        ${userId}, ${name}, ${description}, ${totalAmount}, ${currency},
        ${budgetType}, ${startDate}, ${endDate}, ${alertThreshold}
      )
      RETURNING *
    `

    return { success: true, budget, message: "Budget created successfully" }
  } catch (error) {
    console.error("Error creating budget:", error)
    return { success: false, error: "Failed to create budget" }
  }
}

export async function getUserBudgets(userId: string) {
  try {
    // Check if budgets table exists first
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'budgets'
      );
    `

    if (!tableExists[0]?.exists) {
      return { success: true, budgets: [] }
    }

    const budgets = await sql`
      SELECT 
        b.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'category_id', bc.category_id,
              'category_name', ec.name,
              'category_color', ec.color,
              'category_icon', ec.icon,
              'allocated_amount', bc.allocated_amount,
              'spent_amount', bc.spent_amount
            )
          ) FILTER (WHERE bc.id IS NOT NULL), 
          '[]'
        ) as categories
      FROM budgets b
      LEFT JOIN budget_categories bc ON b.id = bc.budget_id
      LEFT JOIN expense_categories ec ON bc.category_id = ec.id
      WHERE b.user_id = ${userId}
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `

    return { success: true, budgets }
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return { success: true, budgets: [] } // Return empty array instead of error
  }
}

// Expense Management Actions
export async function addExpense(formData: FormData) {
  const userId = formData.get("userId") as string
  const categoryId = formData.get("categoryId") as string
  const budgetId = (formData.get("budgetId") as string) || null
  const amount = Number.parseFloat(formData.get("amount") as string)
  const currency = (formData.get("currency") as string) || "USD"
  const description = formData.get("description") as string
  const merchantName = (formData.get("merchantName") as string) || null
  const location = (formData.get("location") as string) || null
  const paymentMethod = (formData.get("paymentMethod") as string) || "wallet"
  const walletId = (formData.get("walletId") as string) || null
  const tags = formData.get("tags") as string

  try {
    // Parse tags
    const tagArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    const [expense] = await sql`
      INSERT INTO expense_transactions (
        user_id, category_id, budget_id, amount, currency, description,
        merchant_name, location, payment_method, wallet_id, tags, transaction_date
      )
      VALUES (
        ${userId}, ${categoryId}, ${budgetId}, ${amount}, ${currency}, ${description},
        ${merchantName}, ${location}, ${paymentMethod}, ${walletId}, ${tagArray}, NOW()
      )
      RETURNING *
    `

    // If wallet payment, update wallet balance
    if (paymentMethod === "wallet" && walletId) {
      await sql`
        UPDATE wallet_accounts 
        SET balance = balance - ${amount}, updated_at = NOW()
        WHERE id = ${walletId} AND user_id = ${userId}
      `

      // Create corresponding wallet transaction
      const transactionId = `EXP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await sql`
        INSERT INTO transactions (
          transaction_id, user_id, from_wallet_id, transaction_type,
          amount, currency, status, description, completed_at
        )
        VALUES (
          ${transactionId}, ${userId}, ${walletId}, 'expense',
          ${amount}, ${currency}, 'completed', ${description}, NOW()
        )
      `
    }

    return { success: true, expense, message: "Expense added successfully" }
  } catch (error) {
    console.error("Error adding expense:", error)
    return { success: false, error: "Failed to add expense" }
  }
}

export async function getUserExpenses(userId: string, limit = 50) {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'expense_transactions'
      );
    `

    if (!tableExists[0]?.exists) {
      return { success: true, expenses: [] }
    }

    const expenses = await sql`
      SELECT 
        et.*,
        ec.name as category_name,
        ec.color as category_color,
        ec.icon as category_icon,
        b.name as budget_name
      FROM expense_transactions et
      LEFT JOIN expense_categories ec ON et.category_id = ec.id
      LEFT JOIN budgets b ON et.budget_id = b.id
      WHERE et.user_id = ${userId}
      ORDER BY et.transaction_date DESC
      LIMIT ${limit}
    `

    return { success: true, expenses }
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return { success: true, expenses: [] }
  }
}

// Category Management Actions
export async function getUserCategories(userId: string) {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'expense_categories'
      );
    `

    if (!tableExists[0]?.exists) {
      return { success: true, categories: [] }
    }

    const categories = await sql`
      SELECT * FROM expense_categories 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY name ASC
    `

    return { success: true, categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: true, categories: [] }
  }
}

export async function createCategory(formData: FormData) {
  const userId = formData.get("userId") as string
  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const color = (formData.get("color") as string) || "#6B7280"
  const icon = (formData.get("icon") as string) || "DollarSign"

  try {
    const [category] = await sql`
      INSERT INTO expense_categories (user_id, name, description, color, icon)
      VALUES (${userId}, ${name}, ${description}, ${color}, ${icon})
      RETURNING *
    `

    return { success: true, category, message: "Category created successfully" }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

// Financial Goals Actions
export async function createFinancialGoal(formData: FormData) {
  const userId = formData.get("userId") as string
  const title = formData.get("title") as string
  const description = (formData.get("description") as string) || null
  const targetAmount = Number.parseFloat(formData.get("targetAmount") as string)
  const currency = (formData.get("currency") as string) || "USD"
  const targetDate = (formData.get("targetDate") as string) || null
  const goalType = (formData.get("goalType") as string) || "savings"
  const priority = (formData.get("priority") as string) || "medium"
  const linkedWalletId = (formData.get("linkedWalletId") as string) || null

  try {
    const [goal] = await sql`
      INSERT INTO financial_goals (
        user_id, title, description, target_amount, currency,
        target_date, goal_type, priority, linked_wallet_id
      )
      VALUES (
        ${userId}, ${title}, ${description}, ${targetAmount}, ${currency},
        ${targetDate}, ${goalType}, ${priority}, ${linkedWalletId}
      )
      RETURNING *
    `

    return { success: true, goal, message: "Financial goal created successfully" }
  } catch (error) {
    console.error("Error creating financial goal:", error)
    return { success: false, error: "Failed to create financial goal" }
  }
}

export async function getUserFinancialGoals(userId: string) {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'financial_goals'
      );
    `

    if (!tableExists[0]?.exists) {
      return { success: true, goals: [] }
    }

    const goals = await sql`
      SELECT 
        fg.*,
        wa.currency as wallet_currency,
        wa.balance as wallet_balance
      FROM financial_goals fg
      LEFT JOIN wallet_accounts wa ON fg.linked_wallet_id = wa.id
      WHERE fg.user_id = ${userId}
      ORDER BY fg.priority DESC, fg.created_at DESC
    `

    return { success: true, goals }
  } catch (error) {
    console.error("Error fetching financial goals:", error)
    return { success: true, goals: [] }
  }
}

export async function updateGoalProgress(goalId: string, amount: number) {
  try {
    const [goal] = await sql`
      UPDATE financial_goals 
      SET current_amount = current_amount + ${amount}, updated_at = NOW()
      WHERE id = ${goalId}
      RETURNING *
    `

    // Check if goal is completed
    if (goal.current_amount >= goal.target_amount) {
      await sql`
        UPDATE financial_goals 
        SET status = 'completed', updated_at = NOW()
        WHERE id = ${goalId}
      `

      // Create completion alert
      await sql`
        INSERT INTO financial_alerts (
          user_id, alert_type, title, message, severity, related_goal_id
        )
        VALUES (
          ${goal.user_id}, 'goal_milestone', 'Goal Completed!', 
          'Congratulations! You have completed your goal: ' || ${goal.title},
          'info', ${goalId}
        )
      `
    }

    return { success: true, goal, message: "Goal progress updated" }
  } catch (error) {
    console.error("Error updating goal progress:", error)
    return { success: false, error: "Failed to update goal progress" }
  }
}

// Analytics Actions
export async function getSpendingAnalytics(userId: string, period = "month") {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'expense_transactions'
      );
    `

    if (!tableExists[0]?.exists) {
      return { success: true, analytics: [], totalSpent: 0 }
    }

    const periodCondition =
      period === "week"
        ? "transaction_date >= NOW() - INTERVAL '7 days'"
        : period === "year"
          ? "transaction_date >= NOW() - INTERVAL '1 year'"
          : "transaction_date >= DATE_TRUNC('month', NOW())"

    const analytics = await sql`
      SELECT 
        ec.name as category_name,
        ec.color as category_color,
        ec.icon as category_icon,
        SUM(et.amount) as total_amount,
        COUNT(et.id) as transaction_count,
        AVG(et.amount) as average_amount
      FROM expense_transactions et
      JOIN expense_categories ec ON et.category_id = ec.id
      WHERE et.user_id = ${userId} AND ${sql.unsafe(periodCondition)}
      GROUP BY ec.id, ec.name, ec.color, ec.icon
      ORDER BY total_amount DESC
    `

    const totalSpent = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expense_transactions 
      WHERE user_id = ${userId} AND ${sql.unsafe(periodCondition)}
    `

    return {
      success: true,
      analytics,
      totalSpent: totalSpent[0]?.total || 0,
    }
  } catch (error) {
    console.error("Error fetching spending analytics:", error)
    return { success: true, analytics: [], totalSpent: 0 }
  }
}

export async function getFinancialAlerts(userId: string) {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'financial_alerts'
      );
    `

    if (!tableExists[0]?.exists) {
      return { success: true, alerts: [] }
    }

    const alerts = await sql`
      SELECT 
        fa.*,
        b.name as budget_name,
        fg.title as goal_title
      FROM financial_alerts fa
      LEFT JOIN budgets b ON fa.related_budget_id = b.id
      LEFT JOIN financial_goals fg ON fa.related_goal_id = fg.id
      WHERE fa.user_id = ${userId}
      ORDER BY fa.created_at DESC
      LIMIT 20
    `

    return { success: true, alerts }
  } catch (error) {
    console.error("Error fetching financial alerts:", error)
    return { success: true, alerts: [] }
  }
}

export async function markAlertAsRead(alertId: string) {
  try {
    await sql`
      UPDATE financial_alerts 
      SET is_read = true 
      WHERE id = ${alertId}
    `

    return { success: true, message: "Alert marked as read" }
  } catch (error) {
    console.error("Error marking alert as read:", error)
    return { success: false, error: "Failed to mark alert as read" }
  }
}

// Income Management Actions
export async function getUserIncomeSourcesData(userId: string) {
  try {
    const incomeSources = await sql`
      SELECT * FROM income_sources 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY amount DESC
    `

    const totalMonthlyIncome = await sql`
      SELECT 
        SUM(
          CASE 
            WHEN frequency = 'monthly' THEN amount
            WHEN frequency = 'yearly' THEN amount / 12
            WHEN frequency = 'weekly' THEN amount * 4.33
            WHEN frequency = 'bi_weekly' THEN amount * 2.17
            WHEN frequency = 'daily' THEN amount * 30
            ELSE 0
          END
        ) as total_monthly
      FROM income_sources 
      WHERE user_id = ${userId} AND is_active = true
    `

    return {
      success: true,
      incomeSources,
      totalMonthlyIncome: totalMonthlyIncome[0]?.total_monthly || 0,
    }
  } catch (error) {
    console.error("Error fetching income sources:", error)
    return { success: false, error: "Failed to fetch income sources" }
  }
}
