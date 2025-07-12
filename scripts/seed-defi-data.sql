-- Insert popular DeFi protocols
INSERT INTO defi_protocols (id, name, protocol_type, description, website_url, chain, tvl, apy_range_min, apy_range_max, risk_level, audit_status) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Aave', 'lending', 'Decentralized lending and borrowing protocol', 'https://aave.com', 'ethereum', 15000000000, 2.5, 8.5, 'low', 'audited'),
('a50e8400-e29b-41d4-a716-446655440002', 'Compound', 'lending', 'Algorithmic money market protocol', 'https://compound.finance', 'ethereum', 8000000000, 2.0, 7.5, 'low', 'audited'),
('a50e8400-e29b-41d4-a716-446655440003', 'Uniswap V3', 'dex', 'Decentralized exchange with concentrated liquidity', 'https://uniswap.org', 'ethereum', 6000000000, 5.0, 25.0, 'medium', 'audited'),
('a50e8400-e29b-41d4-a716-446655440004', 'Curve Finance', 'dex', 'Stablecoin-focused automated market maker', 'https://curve.fi', 'ethereum', 4000000000, 3.0, 15.0, 'low', 'audited'),
('a50e8400-e29b-41d4-a716-446655440005', 'Yearn Finance', 'yield_farming', 'Yield optimization protocol', 'https://yearn.finance', 'ethereum', 2000000000, 8.0, 35.0, 'medium', 'audited'),
('a50e8400-e29b-41d4-a716-446655440006', 'Convex Finance', 'yield_farming', 'Curve yield farming optimization', 'https://convexfinance.com', 'ethereum', 3000000000, 10.0, 40.0, 'medium', 'audited'),
('a50e8400-e29b-41d4-a716-446655440007', 'Lido', 'staking', 'Liquid staking for Ethereum 2.0', 'https://lido.fi', 'ethereum', 12000000000, 4.0, 6.0, 'low', 'audited'),
('a50e8400-e29b-41d4-a716-446655440008', 'Rocket Pool', 'staking', 'Decentralized Ethereum staking', 'https://rocketpool.net', 'ethereum', 1500000000, 4.5, 6.5, 'medium', 'audited')
ON CONFLICT (name) DO NOTHING;

-- Insert DeFi pools/opportunities
INSERT INTO defi_pools (id, protocol_id, pool_name, pool_address, pool_type, token_pair, base_token, quote_token, reward_token, current_apy, tvl, minimum_deposit, lock_period_days, auto_compound, impermanent_loss_risk, fees_percentage) VALUES
-- Aave lending pools
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'USDC Lending', '0x8dAE6Cb04688C62d939ed9B68d32Bc62e49970b1', 'lending', NULL, 'USDC', NULL, 'AAVE', 4.25, 2500000000, 1, 0, FALSE, FALSE, 0.1),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'USDT Lending', '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', 'lending', NULL, 'USDT', NULL, 'AAVE', 3.85, 1800000000, 1, 0, FALSE, FALSE, 0.1),
('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440001', 'DAI Lending', '0x028171bCA77440897B824Ca71D1c56caC55b68A3', 'lending', NULL, 'DAI', NULL, 'AAVE', 4.15, 2200000000, 1, 0, FALSE, FALSE, 0.1),

-- Compound lending pools
('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440002', 'USDC Supply', '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 'lending', NULL, 'USDC', NULL, 'COMP', 3.75, 1500000000, 1, 0, FALSE, FALSE, 0.05),
('b50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440002', 'USDT Supply', '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 'lending', NULL, 'DAI', NULL, 'COMP', 3.25, 1200000000, 1, 0, FALSE, FALSE, 0.05),

-- Uniswap V3 liquidity pools
('b50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440003', 'USDC/ETH 0.05%', '0x3416cF6C708Da44DB2624D63ea0AAef7113527C6', 'liquidity', 'USDC/ETH', 'USDC', 'ETH', 'UNI', 12.5, 800000000, 100, 0, FALSE, TRUE, 0.05),
('b50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440003', 'USDT/ETH 0.05%', '0x6c6Bc977E13Df9b0de53b251522280BB72383700', 'liquidity', 'USDT/ETH', 'USDT', 'ETH', 'UNI', 11.8, 600000000, 100, 0, FALSE, TRUE, 0.05),

-- Curve Finance pools
('b50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440004', '3Pool (USDC/USDT/DAI)', '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7', 'liquidity', '3Pool', 'USDC', 'USDT', 'CRV', 8.5, 1200000000, 10, 0, TRUE, FALSE, 0.04),
('b50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440004', 'FRAX Pool', '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B', 'liquidity', 'FRAX/USDC', 'FRAX', 'USDC', 'CRV', 9.2, 400000000, 10, 0, TRUE, FALSE, 0.04),

-- Yearn Finance vaults
('b50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440005', 'USDC Vault', '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE', 'yield_farming', NULL, 'USDC', NULL, 'YFI', 15.5, 300000000, 1, 0, TRUE, FALSE, 2.0),
('b50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440005', 'DAI Vault', '0x19D3364A399d251E894aC732651be8B0E4e85001', 'yield_farming', NULL, 'DAI', NULL, 'YFI', 14.8, 250000000, 1, 0, TRUE, FALSE, 2.0),

-- Convex Finance pools
('b50e8400-e29b-41d4-a716-446655440012', 'a50e8400-e29b-41d4-a716-446655440006', 'cvx3Pool', '0x0000000000000000000000000000000000000000', 'yield_farming', '3Pool', 'USDC', 'USDT', 'CVX', 18.5, 800000000, 10, 0, TRUE, FALSE, 0.04),
('b50e8400-e29b-41d4-a716-446655440013', 'a50e8400-e29b-41d4-a716-446655440006', 'cvxFRAX', '0x0000000000000000000000000000000000000000', 'yield_farming', 'FRAX/USDC', 'FRAX', 'USDC', 'CVX', 22.3, 200000000, 10, 0, TRUE, FALSE, 0.04),

-- Lido staking
('b50e8400-e29b-41d4-a716-446655440014', 'a50e8400-e29b-41d4-a716-446655440007', 'stETH Staking', '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', 'staking', NULL, 'ETH', NULL, 'LDO', 5.2, 8000000000, 0.01, 0, FALSE, FALSE, 1.0),

-- Rocket Pool staking
('b50e8400-e29b-41d4-a716-446655440015', 'a50e8400-e29b-41d4-a716-446655440008', 'rETH Staking', '0x0000000000000000000000000000000000000000', 'staking', NULL, 'ETH', NULL, 'RPL', 5.8, 1000000000, 0.01, 0, FALSE, FALSE, 1.0)
ON CONFLICT (protocol_id, pool_name) DO NOTHING;

-- Insert sample user DeFi positions for demo user
INSERT INTO user_defi_positions (id, user_id, protocol_id, pool_id, position_type, token_symbol, amount_deposited, current_value, rewards_earned, current_apy, wallet_id, status) VALUES
('c50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', 'lending', 'USDC', 5000.00, 5125.50, 125.50, 4.25, '550e8400-e29b-41d4-a716-446655440001', 'active'),
('c50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440008', 'liquidity_provision', 'USDC', 2500.00, 2687.25, 187.25, 8.5, '550e8400-e29b-41d4-a716-446655440001', 'active'),
('c50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440005', 'b50e8400-e29b-41d4-a716-446655440010', 'yield_farming', 'USDC', 1000.00, 1155.75, 155.75, 15.5, '550e8400-e29b-41d4-a716-446655440001', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample DeFi transactions
INSERT INTO defi_transactions (user_id, position_id, protocol_id, pool_id, transaction_type, token_in, amount_in, gas_fee, protocol_fee, transaction_hash, status, wallet_id, created_at, confirmed_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', 'deposit', 'USDC', 1500.00, 0.025, 1.50, '0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456789', 'confirmed', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440008', 'deposit', 'USDC', 800.00, 0.035, 0.32, '0x2345678901bcdef12345678901bcdef123456789012345678901bcdef1234567890', 'confirmed', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440005', 'b50e8400-e29b-41d4-a716-446655440010', 'deposit', 'USDC', 1200.00, 0.042, 24.00, '0x3456789012cdef123456789012cdef1234567890123456789012cdef12345678901', 'confirmed', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Insert sample rewards
INSERT INTO defi_rewards (user_id, position_id, protocol_id, reward_token, amount, usd_value, reward_type, distribution_date) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'AAVE', 2.5, 187.50, 'yield', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440004', 'CRV', 15.75, 23.63, 'liquidity_mining', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440005', 'YFI', 0.125, 875.00, 'yield', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insert market data for tokens
INSERT INTO defi_market_data (token_symbol, price_usd, price_change_24h, volume_24h, market_cap) VALUES
('USDC', 1.0001, 0.01, 2500000000, 55000000000),
('USDT', 0.9998, -0.02, 3200000000, 83000000000),
('DAI', 1.0003, 0.03, 180000000, 5300000000),
('AAVE', 85.50, 2.35, 125000000, 1200000000),
('COMP', 45.25, -1.85, 85000000, 950000000),
('UNI', 6.75, 3.25, 180000000, 5100000000),
('CRV', 0.85, 1.15, 95000000, 850000000),
('YFI', 8500.00, 4.85, 45000000, 850000000),
('LDO', 2.15, -0.85, 65000000, 1900000000),
('ETH', 2350.00, 1.75, 8500000000, 285000000000)
ON CONFLICT (token_symbol) DO UPDATE SET 
    price_usd = EXCLUDED.price_usd,
    price_change_24h = EXCLUDED.price_change_24h,
    volume_24h = EXCLUDED.volume_24h,
    market_cap = EXCLUDED.market_cap,
    last_updated = NOW();

-- Insert sample DeFi alerts
INSERT INTO defi_alerts (user_id, position_id, alert_type, title, message, severity) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440001', 'reward_available', 'Rewards Ready to Claim', 'You have $125.50 in AAVE rewards available for claiming', 'info'),
('550e8400-e29b-41d4-a716-446655440000', NULL, 'apy_change', 'APY Increase Alert', 'Curve 3Pool APY increased to 8.5% (+0.5%)', 'info')
ON CONFLICT DO NOTHING;
