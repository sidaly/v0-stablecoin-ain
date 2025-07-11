-- Create expense_categories table for organizing expenses
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280', -- Hex color code
    icon VARCHAR(50) DEFAULT 'DollarSign',
    parent_category_id UUID REFERENCES expense_categories(id),
    is_system_category BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create budgets table for budget management
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    total_amount NUMERIC(18, 8) NOT NULL,
    spent_amount NUMERIC(18, 8) DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    budget_type VARCHAR(50) NOT NULL DEFAULT 'monthly', -- 'weekly', 'monthly', 'yearly', 'custom'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'completed', 'exceeded'
    alert_threshold NUMERIC(5, 2) DEFAULT 80.00, -- Percentage threshold for alerts
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_categories table for linking budgets to categories
CREATE TABLE IF NOT EXISTS budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES expense_categories(id),
    allocated_amount NUMERIC(18, 8) NOT NULL,
    spent_amount NUMERIC(18, 8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(budget_id, category_id)
);

-- Create financial_goals table for savings and financial targets
CREATE TABLE IF NOT EXISTS financial_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_amount NUMERIC(18, 8) NOT NULL,
    current_amount NUMERIC(18, 8) DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    target_date DATE,
    goal_type VARCHAR(50) NOT NULL DEFAULT 'savings', -- 'savings', 'debt_payoff', 'investment', 'emergency_fund'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'completed', 'cancelled'
    auto_contribute BOOLEAN DEFAULT FALSE,
    auto_contribute_amount NUMERIC(18, 8),
    auto_contribute_frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly'
    linked_wallet_id UUID REFERENCES wallet_accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expense_transactions table for detailed expense tracking
CREATE TABLE IF NOT EXISTS expense_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    transaction_id UUID REFERENCES transactions(id), -- Link to wallet transactions
    category_id UUID REFERENCES expense_categories(id),
    budget_id UUID REFERENCES budgets(id),
    amount NUMERIC(18, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    merchant_name VARCHAR(200),
    location VARCHAR(200),
    receipt_url TEXT,
    tags TEXT[], -- Array of tags for flexible categorization
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'yearly'
    recurring_end_date DATE,
    payment_method VARCHAR(50), -- 'wallet', 'card', 'bank_transfer', 'cash'
    wallet_id UUID REFERENCES wallet_accounts(id),
    card_id VARCHAR(100), -- Reference to card if used
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create income_sources table for tracking income
CREATE TABLE IF NOT EXISTS income_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    source_name VARCHAR(200) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'salary', 'freelance', 'investment', 'business', 'other'
    amount NUMERIC(18, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    frequency VARCHAR(20) NOT NULL, -- 'one_time', 'daily', 'weekly', 'bi_weekly', 'monthly', 'yearly'
    next_payment_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    tax_rate NUMERIC(5, 2) DEFAULT 0, -- Tax rate percentage
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_alerts table for budget and goal notifications
CREATE TABLE IF NOT EXISTS financial_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    alert_type VARCHAR(50) NOT NULL, -- 'budget_threshold', 'budget_exceeded', 'goal_milestone', 'unusual_spending'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical'
    is_read BOOLEAN DEFAULT FALSE,
    related_budget_id UUID REFERENCES budgets(id),
    related_goal_id UUID REFERENCES financial_goals(id),
    related_transaction_id UUID REFERENCES expense_transactions(id),
    action_required BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_reports table for storing generated reports
CREATE TABLE IF NOT EXISTS financial_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    report_type VARCHAR(50) NOT NULL, -- 'monthly_summary', 'budget_analysis', 'spending_trends', 'goal_progress'
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    report_data JSONB NOT NULL, -- Store report data as JSON
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expense_categories_user_id ON expense_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_status ON budgets(status);
CREATE INDEX IF NOT EXISTS idx_budget_categories_budget_id ON budget_categories(budget_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_status ON financial_goals(status);
CREATE INDEX IF NOT EXISTS idx_expense_transactions_user_id ON expense_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_transactions_category_id ON expense_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_expense_transactions_budget_id ON expense_transactions(budget_id);
CREATE INDEX IF NOT EXISTS idx_expense_transactions_date ON expense_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_income_sources_user_id ON income_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_alerts_user_id ON financial_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_alerts_unread ON financial_alerts(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_financial_reports_user_id ON financial_reports(user_id);

-- Create triggers to update spent amounts automatically
CREATE OR REPLACE FUNCTION update_budget_spent_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Update budget spent amount
    IF NEW.budget_id IS NOT NULL THEN
        UPDATE budgets 
        SET spent_amount = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM expense_transactions 
            WHERE budget_id = NEW.budget_id
        ),
        updated_at = NOW()
        WHERE id = NEW.budget_id;
        
        -- Update budget category spent amount
        UPDATE budget_categories 
        SET spent_amount = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM expense_transactions 
            WHERE budget_id = NEW.budget_id AND category_id = NEW.category_id
        ),
        updated_at = NOW()
        WHERE budget_id = NEW.budget_id AND category_id = NEW.category_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_budget_spent_amount
    AFTER INSERT OR UPDATE OR DELETE ON expense_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_spent_amount();

-- Create function to check budget alerts
CREATE OR REPLACE FUNCTION check_budget_alerts()
RETURNS TRIGGER AS $$
DECLARE
    budget_record RECORD;
    threshold_amount NUMERIC;
    alert_exists BOOLEAN;
BEGIN
    -- Get budget information
    SELECT * INTO budget_record FROM budgets WHERE id = NEW.budget_id;
    
    IF budget_record IS NOT NULL THEN
        threshold_amount := budget_record.total_amount * (budget_record.alert_threshold / 100);
        
        -- Check if threshold alert should be sent
        IF budget_record.spent_amount >= threshold_amount AND budget_record.spent_amount < budget_record.total_amount THEN
            -- Check if alert already exists
            SELECT EXISTS(
                SELECT 1 FROM financial_alerts 
                WHERE user_id = budget_record.user_id 
                AND related_budget_id = budget_record.id 
                AND alert_type = 'budget_threshold'
                AND created_at > NOW() - INTERVAL '1 day'
            ) INTO alert_exists;
            
            IF NOT alert_exists THEN
                INSERT INTO financial_alerts (
                    user_id, alert_type, title, message, severity, 
                    related_budget_id, action_required
                ) VALUES (
                    budget_record.user_id,
                    'budget_threshold',
                    'Budget Alert: ' || budget_record.name,
                    'You have spent ' || ROUND((budget_record.spent_amount / budget_record.total_amount) * 100, 1) || '% of your budget for ' || budget_record.name,
                    'warning',
                    budget_record.id,
                    TRUE
                );
            END IF;
        END IF;
        
        -- Check if budget exceeded
        IF budget_record.spent_amount > budget_record.total_amount THEN
            SELECT EXISTS(
                SELECT 1 FROM financial_alerts 
                WHERE user_id = budget_record.user_id 
                AND related_budget_id = budget_record.id 
                AND alert_type = 'budget_exceeded'
                AND created_at > NOW() - INTERVAL '1 day'
            ) INTO alert_exists;
            
            IF NOT alert_exists THEN
                INSERT INTO financial_alerts (
                    user_id, alert_type, title, message, severity, 
                    related_budget_id, action_required
                ) VALUES (
                    budget_record.user_id,
                    'budget_exceeded',
                    'Budget Exceeded: ' || budget_record.name,
                    'You have exceeded your budget for ' || budget_record.name || ' by $' || (budget_record.spent_amount - budget_record.total_amount),
                    'critical',
                    budget_record.id,
                    TRUE
                );
                
                -- Update budget status
                UPDATE budgets SET status = 'exceeded' WHERE id = budget_record.id;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_budget_alerts
    AFTER UPDATE OF spent_amount ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION check_budget_alerts();
