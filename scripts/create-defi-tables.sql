-- Create defi_protocols table for supported DeFi protocols
CREATE TABLE IF NOT EXISTS defi_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    protocol_type VARCHAR(50) NOT NULL, -- 'lending', 'dex', 'yield_farming', 'staking'
    description TEXT,
    website_url VARCHAR(255),
    logo_url TEXT,
    chain VARCHAR(50) NOT NULL DEFAULT 'ethereum', -- 'ethereum', 'polygon', 'bsc', 'arbitrum'
    tvl DECIMAL(20, 2) DEFAULT 0,
    apy_range_min DECIMAL(5, 2) DEFAULT 0,
    apy_range_max DECIMAL(5, 2) DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'very_high'
    is_active BOOLEAN DEFAULT true,
    audit_status VARCHAR(50) DEFAULT 'unaudited', -- 'audited', 'unaudited', 'pending'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create defi_pools table for liquidity pools and yield farming opportunities
CREATE TABLE IF NOT EXISTS defi_pools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id UUID REFERENCES defi_protocols(id),
    pool_name VARCHAR(100) NOT NULL,
    base_token VARCHAR(10) NOT NULL,
    quote_token VARCHAR(10),
    token_pair VARCHAR(20), -- e.g., 'USDC/ETH'
    pool_type VARCHAR(50) NOT NULL, -- 'lending', 'liquidity', 'farming', 'staking'
    current_apy DECIMAL(5, 2) NOT NULL,
    tvl DECIMAL(20, 2) DEFAULT 0,
    minimum_deposit DECIMAL(20, 2) DEFAULT 0,
    maximum_deposit DECIMAL(20, 2),
    lock_period_days INTEGER DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'medium',
    audit_status VARCHAR(50) DEFAULT 'unaudited',
    rewards_token VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_defi_positions table for tracking user's DeFi investments
CREATE TABLE IF NOT EXISTS user_defi_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    protocol_id UUID REFERENCES defi_protocols(id),
    pool_id UUID REFERENCES defi_pools(id),
    position_type VARCHAR(50) NOT NULL, -- 'lending', 'liquidity_provision', 'yield_farming', 'staking'
    amount_deposited DECIMAL(20, 2) NOT NULL,
    current_value DECIMAL(20, 2) NOT NULL,
    entry_apy DECIMAL(5, 2) NOT NULL,
    current_apy DECIMAL(5, 2) NOT NULL,
    rewards_earned DECIMAL(20, 2) DEFAULT 0,
    rewards_claimed DECIMAL(20, 2) DEFAULT 0,
    lock_end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'withdrawn', 'locked'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create defi_transactions table for DeFi-related transactions
CREATE TABLE IF NOT EXISTS defi_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    position_id UUID REFERENCES user_defi_positions(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'deposit', 'withdraw', 'claim_rewards', 'compound'
    amount DECIMAL(20, 2) NOT NULL,
    token VARCHAR(10) NOT NULL,
    transaction_hash VARCHAR(66),
    gas_fee DECIMAL(20, 8),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create defi_rewards table for tracking reward distributions
CREATE TABLE IF NOT EXISTS defi_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    position_id UUID REFERENCES user_defi_positions(id),
    reward_token VARCHAR(10) NOT NULL,
    amount_earned DECIMAL(20, 2) NOT NULL,
    amount_claimed DECIMAL(20, 2) DEFAULT 0,
    reward_date DATE NOT NULL,
    is_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create defi_strategies table for automated DeFi strategies
CREATE TABLE IF NOT EXISTS defi_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    strategy_name VARCHAR(200) NOT NULL,
    strategy_type VARCHAR(50) NOT NULL, -- 'yield_optimization', 'rebalancing', 'dollar_cost_averaging', 'arbitrage'
    description TEXT,
    target_protocols UUID[], -- Array of protocol IDs
    allocation_percentages NUMERIC(5, 2)[], -- Corresponding allocation percentages
    min_apy_threshold NUMERIC(8, 4) DEFAULT 0,
    max_risk_level VARCHAR(20) DEFAULT 'medium',
    rebalance_frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly', 'manual'
    auto_compound BOOLEAN DEFAULT TRUE,
    total_allocated NUMERIC(18, 8) DEFAULT 0,
    current_value NUMERIC(18, 8) DEFAULT 0,
    total_rewards NUMERIC(18, 8) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    last_rebalance_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create defi_alerts table for DeFi-specific notifications
CREATE TABLE IF NOT EXISTS defi_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    position_id UUID REFERENCES user_defi_positions(id),
    alert_type VARCHAR(50) NOT NULL, -- 'apy_change', 'reward_available', 'lock_expiring', 'risk_change'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create defi_market_data table for tracking token prices and market data
CREATE TABLE IF NOT EXISTS defi_market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_symbol VARCHAR(20) NOT NULL,
    price_usd NUMERIC(18, 8) NOT NULL,
    price_change_24h NUMERIC(8, 4) DEFAULT 0,
    volume_24h NUMERIC(20, 8) DEFAULT 0,
    market_cap NUMERIC(20, 8) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(token_symbol)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_defi_protocols_type ON defi_protocols(protocol_type);
CREATE INDEX IF NOT EXISTS idx_defi_protocols_chain ON defi_protocols(chain);
CREATE INDEX IF NOT EXISTS idx_defi_pools_protocol_id ON defi_pools(protocol_id);
CREATE INDEX IF NOT EXISTS idx_defi_pools_type ON defi_pools(pool_type);
CREATE INDEX IF NOT EXISTS idx_defi_pools_apy ON defi_pools(current_apy DESC);
CREATE INDEX IF NOT EXISTS idx_user_defi_positions_user_id ON user_defi_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_defi_positions_protocol_id ON user_defi_positions(protocol_id);
CREATE INDEX IF NOT EXISTS idx_user_defi_positions_status ON user_defi_positions(status);
CREATE INDEX IF NOT EXISTS idx_defi_transactions_user_id ON defi_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_defi_transactions_status ON defi_transactions(status);
CREATE INDEX IF NOT EXISTS idx_defi_transactions_created_at ON defi_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_defi_rewards_user_id ON defi_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_defi_rewards_position_id ON defi_rewards(position_id);
CREATE INDEX IF NOT EXISTS idx_defi_strategies_user_id ON defi_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_defi_alerts_user_id ON defi_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_defi_alerts_unread ON defi_alerts(user_id, is_read) WHERE is_read = FALSE;

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_position_value()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current value based on market data and rewards
    UPDATE user_defi_positions 
    SET current_value = amount_deposited + rewards_earned,
        updated_at = NOW()
    WHERE id = NEW.position_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_position_value
    AFTER INSERT OR UPDATE ON defi_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_position_value();

-- Create function to calculate portfolio performance
CREATE OR REPLACE FUNCTION calculate_defi_portfolio_performance(p_user_id UUID)
RETURNS TABLE(
    total_deposited NUMERIC,
    current_value NUMERIC,
    total_rewards NUMERIC,
    unrealized_pnl NUMERIC,
    total_return_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(udp.amount_deposited), 0) as total_deposited,
        COALESCE(SUM(udp.current_value), 0) as current_value,
        COALESCE(SUM(udp.rewards_earned), 0) as total_rewards,
        COALESCE(SUM(udp.current_value - udp.amount_deposited), 0) as unrealized_pnl,
        CASE 
            WHEN SUM(udp.amount_deposited) > 0 
            THEN ((SUM(udp.current_value) - SUM(udp.amount_deposited)) / SUM(udp.amount_deposited)) * 100
            ELSE 0
        END as total_return_percentage
    FROM user_defi_positions udp
    WHERE udp.user_id = p_user_id AND udp.status = 'active';
END;
$$ LANGUAGE plpgsql;
