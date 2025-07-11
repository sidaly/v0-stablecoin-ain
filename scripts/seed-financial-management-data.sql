-- Insert default expense categories for demo user
INSERT INTO expense_categories (id, user_id, name, description, color, icon, is_system_category) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Food & Dining', 'Restaurants, groceries, and food delivery', '#10B981', 'Coffee', true),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Transportation', 'Gas, public transport, rideshare, parking', '#3B82F6', 'Car', true),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Shopping', 'Clothing, electronics, general merchandise', '#8B5CF6', 'ShoppingBag', true),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Entertainment', 'Movies, games, subscriptions, hobbies', '#F59E0B', 'Gamepad2', true),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Bills & Utilities', 'Rent, electricity, internet, phone', '#EF4444', 'Home', true),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Healthcare', 'Medical expenses, pharmacy, insurance', '#06B6D4', 'Heart', true),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Education', 'Courses, books, training, certifications', '#84CC16', 'BookOpen', true),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Travel', 'Flights, hotels, vacation expenses', '#F97316', 'Plane', true),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', 'Personal Care', 'Haircuts, cosmetics, gym memberships', '#EC4899', 'Scissors', true),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Miscellaneous', 'Other expenses not categorized', '#6B7280', 'MoreHorizontal', true)
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert sample budgets
INSERT INTO budgets (id, user_id, name, description, total_amount, currency, budget_type, start_date, end_date, alert_threshold) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Monthly Budget - January 2024', 'Overall monthly spending budget', 3000.00, 'USD', 'monthly', '2024-01-01', '2024-01-31', 85.00),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Food Budget', 'Monthly food and dining budget', 800.00, 'USD', 'monthly', '2024-01-01', '2024-01-31', 80.00),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Entertainment Budget', 'Monthly entertainment and leisure', 300.00, 'USD', 'monthly', '2024-01-01', '2024-01-31', 75.00)
ON CONFLICT DO NOTHING;

-- Insert budget categories
INSERT INTO budget_categories (budget_id, category_id, allocated_amount) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 800.00), -- Food
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 400.00), -- Transportation
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 500.00), -- Shopping
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 300.00), -- Entertainment
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440005', 1000.00), -- Bills
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 800.00), -- Food budget
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', 300.00) -- Entertainment budget
ON CONFLICT (budget_id, category_id) DO NOTHING;

-- Insert financial goals
INSERT INTO financial_goals (id, user_id, title, description, target_amount, current_amount, currency, target_date, goal_type, priority, linked_wallet_id) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Emergency Fund', 'Build emergency fund for 6 months expenses', 15000.00, 3500.00, 'USD', '2024-12-31', 'emergency_fund', 'high', '550e8400-e29b-41d4-a716-446655440001'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Vacation Fund', 'Save for summer vacation to Europe', 5000.00, 1200.00, 'USD', '2024-06-01', 'savings', 'medium', '550e8400-e29b-41d4-a716-446655440002'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'New Laptop', 'Save for MacBook Pro upgrade', 2500.00, 800.00, 'USD', '2024-03-15', 'savings', 'low', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT DO NOTHING;

-- Insert income sources
INSERT INTO income_sources (user_id, source_name, source_type, amount, currency, frequency, next_payment_date, tax_rate) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Software Engineer Salary', 'salary', 8000.00, 'USD', 'monthly', '2024-02-01', 22.00),
('550e8400-e29b-41d4-a716-446655440000', 'Freelance Web Development', 'freelance', 1500.00, 'USD', 'monthly', '2024-01-25', 15.00),
('550e8400-e29b-41d4-a716-446655440000', 'Investment Dividends', 'investment', 200.00, 'USD', 'monthly', '2024-01-30', 10.00)
ON CONFLICT DO NOTHING;

-- Insert sample expense transactions
INSERT INTO expense_transactions (
    user_id, category_id, budget_id, amount, currency, description, 
    merchant_name, payment_method, wallet_id, transaction_date, tags
) VALUES
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 45.67, 'USD', 'Grocery shopping at Whole Foods', 'Whole Foods Market', 'wallet', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days', ARRAY['groceries', 'organic']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 25.50, 'USD', 'Uber ride to downtown', 'Uber', 'wallet', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day', ARRAY['rideshare', 'work']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440001', 15.99, 'USD', 'Netflix monthly subscription', 'Netflix', 'wallet', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 days', ARRAY['streaming', 'subscription']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 28.75, 'USD', 'Lunch at Italian restaurant', 'Mama Mias', 'wallet', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '4 hours', ARRAY['restaurant', 'lunch']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 89.99, 'USD', 'New running shoes', 'Nike Store', 'wallet', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days', ARRAY['shoes', 'fitness']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440001', 1200.00, 'USD', 'Monthly rent payment', 'Property Management Co', 'wallet', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 week', ARRAY['rent', 'housing']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 12.50, 'USD', 'Coffee and pastry', 'Starbucks', 'wallet', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 hours', ARRAY['coffee', 'breakfast']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 65.00, 'USD', 'Gas station fill-up', 'Shell', 'wallet', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 days', ARRAY['gas', 'car']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440001', 150.00, 'USD', 'Doctor visit copay', 'Medical Center', 'wallet', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 week', ARRAY['medical', 'checkup']),
('550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440003', 45.00, 'USD', 'Movie tickets for two', 'AMC Theaters', 'wallet', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 days', ARRAY['movies', 'date'])
ON CONFLICT DO NOTHING;

-- Insert sample financial alerts
INSERT INTO financial_alerts (user_id, alert_type, title, message, severity, related_budget_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'budget_threshold', 'Budget Alert: Food Budget', 'You have spent 78% of your food budget for this month', 'warning', '750e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440000', 'goal_milestone', 'Goal Progress: Emergency Fund', 'Great job! You have reached 23% of your emergency fund goal', 'info', NULL)
ON CONFLICT DO NOTHING;

-- Update budget spent amounts based on expense transactions
UPDATE budgets SET spent_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM expense_transactions 
    WHERE budget_id = budgets.id
), updated_at = NOW();

-- Update budget category spent amounts
UPDATE budget_categories SET spent_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM expense_transactions 
    WHERE budget_id = budget_categories.budget_id 
    AND category_id = budget_categories.category_id
), updated_at = NOW();
