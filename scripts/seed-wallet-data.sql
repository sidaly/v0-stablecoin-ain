-- Insert sample wallet accounts for demo user
INSERT INTO wallet_accounts (id, user_id, wallet_address, currency, balance, wallet_type, is_primary, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '0x1234567890abcdef1234567890abcdef12345678', 'USDC', 2450.75, 'hot', true, 'active'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '0x2345678901bcdef12345678901bcdef123456789', 'USDT', 1200.00, 'hot', false, 'active'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '0x3456789012cdef123456789012cdef1234567890', 'DAI', 850.25, 'cold', false, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample contacts
INSERT INTO user_contacts (user_id, contact_name, contact_address, contact_type, is_favorite) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Alice Johnson', '0x9876543210fedcba9876543210fedcba98765432', 'wallet', true),
('550e8400-e29b-41d4-a716-446655440000', 'Bob Smith', '0x8765432109edcba98765432109edcba987654321', 'wallet', false),
('550e8400-e29b-41d4-a716-446655440000', 'Carol Davis', '0x7654321098dcba987654321098dcba9876543210', 'wallet', false)
ON CONFLICT (user_id, contact_address) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (
  transaction_id, user_id, from_wallet_id, transaction_type, amount, currency, 
  fee_amount, status, description, recipient_address, recipient_name, completed_at
) VALUES
('TXN_1704067200_abc123', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'transfer', 100.00, 'USDC', 0.10, 'completed', 'Payment for services', '0x9876543210fedcba9876543210fedcba98765432', 'Alice Johnson', NOW() - INTERVAL '2 days'),
('TXN_1704153600_def456', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'transfer', 50.00, 'USDT', 0.05, 'completed', 'Lunch payment', '0x8765432109edcba98765432109edcba987654321', 'Bob Smith', NOW() - INTERVAL '1 day'),
('TXN_1704240000_ghi789', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'transfer', 25.50, 'USDC', 0.03, 'pending', 'Coffee payment', '0x7654321098dcba987654321098dcba9876543210', 'Carol Davis', NULL)
ON CONFLICT (transaction_id) DO NOTHING;

-- Insert sample exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate, provider, valid_until) VALUES
('USD', 'USDC', 0.9998, 'coinbase', NOW() + INTERVAL '1 hour'),
('USD', 'USDT', 0.9999, 'coinbase', NOW() + INTERVAL '1 hour'),
('USD', 'DAI', 0.9997, 'coinbase', NOW() + INTERVAL '1 hour'),
('EUR', 'USDC', 1.0856, 'coinbase', NOW() + INTERVAL '1 hour'),
('EUR', 'USDT', 1.0857, 'coinbase', NOW() + INTERVAL '1 hour'),
('EUR', 'DAI', 1.0855, 'coinbase', NOW() + INTERVAL '1 hour')
ON CONFLICT (from_currency, to_currency, provider) DO UPDATE SET 
  rate = EXCLUDED.rate, 
  valid_until = EXCLUDED.valid_until, 
  created_at = NOW();
