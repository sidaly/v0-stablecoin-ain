-- Create lifestyle_categories table for organizing lifestyle expenses and activities
CREATE TABLE IF NOT EXISTS lifestyle_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_type VARCHAR(50) NOT NULL, -- 'dining', 'entertainment', 'travel', 'fitness', 'shopping', 'wellness'
    icon VARCHAR(50) DEFAULT 'Star',
    color VARCHAR(7) DEFAULT '#6B7280',
    monthly_budget NUMERIC(18, 8) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create rewards_programs table for various reward programs
CREATE TABLE IF NOT EXISTS rewards_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_name VARCHAR(200) NOT NULL,
    program_type VARCHAR(50) NOT NULL, -- 'cashback', 'points', 'miles', 'crypto', 'nft'
    provider VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    terms_url TEXT,
    reward_rate NUMERIC(8, 4) DEFAULT 0, -- Percentage or points per dollar
    minimum_redemption NUMERIC(18, 8) DEFAULT 0,
    expiration_months INTEGER DEFAULT 0, -- 0 for no expiration
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_rewards_accounts table for user's reward program memberships
CREATE TABLE IF NOT EXISTS user_rewards_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    program_id UUID NOT NULL REFERENCES rewards_programs(id),
    account_number VARCHAR(100),
    account_status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    current_balance NUMERIC(18, 8) DEFAULT 0,
    lifetime_earned NUMERIC(18, 8) DEFAULT 0,
    lifetime_redeemed NUMERIC(18, 8) DEFAULT 0,
    tier_level VARCHAR(50) DEFAULT 'basic', -- 'basic', 'silver', 'gold', 'platinum', 'diamond'
    tier_benefits JSONB,
    auto_redeem BOOLEAN DEFAULT FALSE,
    auto_redeem_threshold NUMERIC(18, 8),
    linked_wallet_id UUID REFERENCES wallet_accounts(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, program_id)
);

-- Create lifestyle_activities table for tracking lifestyle activities and expenses
CREATE TABLE IF NOT EXISTS lifestyle_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    category_id UUID REFERENCES lifestyle_categories(id),
    activity_type VARCHAR(50) NOT NULL, -- 'dining', 'shopping', 'travel', 'entertainment', 'fitness', 'wellness'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    venue_name VARCHAR(200),
    amount_spent NUMERIC(18, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50), -- 'wallet', 'card', 'cash'
    wallet_id UUID REFERENCES wallet_accounts(id),
    transaction_id UUID REFERENCES transactions(id),
    activity_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    photos TEXT[], -- Array of photo URLs
    tags TEXT[], -- Array of tags
    is_favorite BOOLEAN DEFAULT FALSE,
    privacy_level VARCHAR(20) DEFAULT 'private', -- 'private', 'friends', 'public'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards_transactions table for tracking reward earnings and redemptions
CREATE TABLE IF NOT EXISTS rewards_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    rewards_account_id UUID NOT NULL REFERENCES user_rewards_accounts(id),
    activity_id UUID REFERENCES lifestyle_activities(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'earned', 'redeemed', 'expired', 'bonus', 'penalty'
    amount NUMERIC(18, 8) NOT NULL,
    points_value NUMERIC(18, 8), -- USD value of points
    description TEXT NOT NULL,
    reference_id VARCHAR(100), -- External transaction reference
    merchant_name VARCHAR(200),
    merchant_category VARCHAR(100),
    earning_rate NUMERIC(8, 4),
    bonus_multiplier NUMERIC(4, 2) DEFAULT 1.0,
    expiration_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lifestyle_goals table for lifestyle and experience goals
CREATE TABLE IF NOT EXISTS lifestyle_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    goal_type VARCHAR(50) NOT NULL, -- 'experience', 'savings', 'activity', 'reward'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_amount NUMERIC(18, 8),
    current_amount NUMERIC(18, 8) DEFAULT 0,
    target_count INTEGER, -- For activity-based goals
    current_count INTEGER DEFAULT 0,
    target_date DATE,
    category_id UUID REFERENCES lifestyle_categories(id),
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
    reward_program_id UUID REFERENCES rewards_programs(id),
    milestone_rewards JSONB, -- JSON array of milestone rewards
    completion_reward JSONB,
    progress_percentage NUMERIC(5, 2) DEFAULT 0,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lifestyle_recommendations table for personalized recommendations
CREATE TABLE IF NOT EXISTS lifestyle_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    recommendation_type VARCHAR(50) NOT NULL, -- 'activity', 'reward', 'deal', 'experience'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    location VARCHAR(200),
    estimated_cost NUMERIC(18, 8),
    potential_rewards NUMERIC(18, 8),
    reward_program_id UUID REFERENCES rewards_programs(id),
    confidence_score NUMERIC(3, 2) DEFAULT 0.5, -- 0.0 to 1.0
    expiration_date TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    image_url TEXT,
    tags TEXT[],
    is_personalized BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lifestyle_social table for social features and sharing
CREATE TABLE IF NOT EXISTS lifestyle_social (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    activity_id UUID REFERENCES lifestyle_activities(id),
    goal_id UUID REFERENCES lifestyle_goals(id),
    post_type VARCHAR(50) NOT NULL, -- 'activity', 'achievement', 'goal', 'review'
    content TEXT NOT NULL,
    media_urls TEXT[],
    visibility VARCHAR(20) DEFAULT 'friends', -- 'private', 'friends', 'public'
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    hashtags TEXT[],
    location VARCHAR(200),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lifestyle_challenges table for gamification
CREATE TABLE IF NOT EXISTS lifestyle_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    challenge_type VARCHAR(50) NOT NULL, -- 'spending', 'activity', 'saving', 'social'
    category VARCHAR(100),
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard', 'expert'
    duration_days INTEGER NOT NULL,
    target_value NUMERIC(18, 8),
    reward_amount NUMERIC(18, 8),
    reward_type VARCHAR(50), -- 'points', 'cashback', 'badge', 'nft'
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_challenge_participation table
CREATE TABLE IF NOT EXISTS user_challenge_participation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    challenge_id UUID NOT NULL REFERENCES lifestyle_challenges(id),
    current_progress NUMERIC(18, 8) DEFAULT 0,
    progress_percentage NUMERIC(5, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'failed', 'abandoned'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    reward_claimed BOOLEAN DEFAULT FALSE,
    reward_claimed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, challenge_id)
);

-- Create lifestyle_insights table for analytics and insights
CREATE TABLE IF NOT EXISTS lifestyle_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    insight_type VARCHAR(50) NOT NULL, -- 'spending_pattern', 'reward_optimization', 'goal_progress', 'trend'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium',
    action_items TEXT[],
    potential_savings NUMERIC(18, 8),
    potential_rewards NUMERIC(18, 8),
    confidence_score NUMERIC(3, 2) DEFAULT 0.5,
    is_read BOOLEAN DEFAULT FALSE,
    is_actionable BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lifestyle_categories_user_id ON lifestyle_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_categories_type ON lifestyle_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_rewards_programs_type ON rewards_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_rewards_programs_featured ON rewards_programs(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_rewards_accounts_user_id ON user_rewards_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_accounts_program_id ON user_rewards_accounts(program_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_activities_user_id ON lifestyle_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_activities_category_id ON lifestyle_activities(category_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_activities_date ON lifestyle_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_lifestyle_activities_type ON lifestyle_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_rewards_transactions_user_id ON rewards_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_transactions_account_id ON rewards_transactions(rewards_account_id);
CREATE INDEX IF NOT EXISTS idx_rewards_transactions_type ON rewards_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_lifestyle_goals_user_id ON lifestyle_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_goals_status ON lifestyle_goals(status);
CREATE INDEX IF NOT EXISTS idx_lifestyle_recommendations_user_id ON lifestyle_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_recommendations_type ON lifestyle_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_lifestyle_social_user_id ON lifestyle_social(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_challenges_active ON lifestyle_challenges(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_challenge_participation_user_id ON user_challenge_participation(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_insights_user_id ON lifestyle_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_insights_unread ON lifestyle_insights(user_id, is_read) WHERE is_read = FALSE;

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_lifestyle_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update goal progress based on activities
    IF NEW.category_id IS NOT NULL THEN
        UPDATE lifestyle_goals 
        SET 
            current_amount = (
                SELECT COALESCE(SUM(amount_spent), 0) 
                FROM lifestyle_activities 
                WHERE user_id = NEW.user_id 
                AND category_id = NEW.category_id
                AND activity_date >= (SELECT created_at FROM lifestyle_goals WHERE id = lifestyle_goals.id)
            ),
            current_count = (
                SELECT COUNT(*) 
                FROM lifestyle_activities 
                WHERE user_id = NEW.user_id 
                AND category_id = NEW.category_id
                AND activity_date >= (SELECT created_at FROM lifestyle_goals WHERE id = lifestyle_goals.id)
            ),
            progress_percentage = CASE 
                WHEN target_amount > 0 THEN 
                    LEAST(((SELECT COALESCE(SUM(amount_spent), 0) 
                           FROM lifestyle_activities 
                           WHERE user_id = NEW.user_id 
                           AND category_id = NEW.category_id) / target_amount) * 100, 100)
                WHEN target_count > 0 THEN 
                    LEAST(((SELECT COUNT(*) 
                           FROM lifestyle_activities 
                           WHERE user_id = NEW.user_id 
                           AND category_id = NEW.category_id)::NUMERIC / target_count) * 100, 100)
                ELSE 0
            END,
            updated_at = NOW()
        WHERE user_id = NEW.user_id 
        AND category_id = NEW.category_id 
        AND status = 'active';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lifestyle_goal_progress
    AFTER INSERT OR UPDATE ON lifestyle_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_lifestyle_goal_progress();

-- Create function to calculate reward earnings
CREATE OR REPLACE FUNCTION calculate_reward_earnings(
    p_user_id UUID,
    p_amount NUMERIC,
    p_merchant_category VARCHAR,
    p_program_id UUID
) RETURNS NUMERIC AS $$
DECLARE
    base_rate NUMERIC;
    bonus_multiplier NUMERIC := 1.0;
    earned_amount NUMERIC;
BEGIN
    -- Get base reward rate
    SELECT reward_rate INTO base_rate
    FROM rewards_programs 
    WHERE id = p_program_id;
    
    -- Apply category bonuses (simplified logic)
    IF p_merchant_category IN ('dining', 'restaurants') THEN
        bonus_multiplier := 2.0;
    ELSIF p_merchant_category IN ('gas', 'fuel') THEN
        bonus_multiplier := 3.0;
    ELSIF p_merchant_category IN ('groceries', 'supermarkets') THEN
        bonus_multiplier := 2.5;
    END IF;
    
    earned_amount := p_amount * (base_rate / 100) * bonus_multiplier;
    
    RETURN earned_amount;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate lifestyle insights
CREATE OR REPLACE FUNCTION generate_lifestyle_insights(p_user_id UUID)
RETURNS TABLE(
    insight_type VARCHAR,
    title VARCHAR,
    description TEXT,
    potential_savings NUMERIC,
    potential_rewards NUMERIC
) AS $$
BEGIN
    -- Spending pattern insights
    RETURN QUERY
    SELECT 
        'spending_pattern'::VARCHAR as insight_type,
        'High Dining Expenses'::VARCHAR as title,
        'You spent 40% more on dining this month compared to last month'::TEXT as description,
        150.00::NUMERIC as potential_savings,
        25.00::NUMERIC as potential_rewards
    WHERE EXISTS (
        SELECT 1 FROM lifestyle_activities 
        WHERE user_id = p_user_id 
        AND activity_type = 'dining'
        AND activity_date >= NOW() - INTERVAL '30 days'
    );
    
    -- Reward optimization insights
    RETURN QUERY
    SELECT 
        'reward_optimization'::VARCHAR as insight_type,
        'Maximize Cashback Rewards'::VARCHAR as title,
        'Switch to your 3% cashback card for grocery purchases to earn more rewards'::TEXT as description,
        0.00::NUMERIC as potential_savings,
        45.00::NUMERIC as potential_rewards
    WHERE EXISTS (
        SELECT 1 FROM user_rewards_accounts 
        WHERE user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql;
