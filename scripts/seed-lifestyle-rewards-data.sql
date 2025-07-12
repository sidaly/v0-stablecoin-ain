-- Insert default lifestyle categories
INSERT INTO lifestyle_categories (id, user_id, name, description, category_type, icon, color, monthly_budget) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Fine Dining', 'Restaurants and upscale dining experiences', 'dining', 'ChefHat', '#F59E0B', 800.00),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Entertainment', 'Movies, concerts, shows, and events', 'entertainment', 'Music', '#8B5CF6', 400.00),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Travel & Experiences', 'Vacations, trips, and unique experiences', 'travel', 'Plane', '#06B6D4', 2000.00),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Fitness & Wellness', 'Gym, spa, wellness activities', 'fitness', 'Dumbbell', '#10B981', 300.00),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Luxury Shopping', 'Fashion, accessories, and luxury items', 'shopping', 'ShoppingBag', '#EC4899', 1200.00),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Personal Care', 'Beauty, grooming, and self-care', 'wellness', 'Sparkles', '#F97316', 250.00)
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert popular rewards programs
INSERT INTO rewards_programs (id, program_name, program_type, provider, description, reward_rate, minimum_redemption, expiration_months, featured) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Premium Cashback', 'cashback', 'StableCoin Bank', 'Earn up to 3% cashback on all purchases', 3.0000, 25.00, 0, TRUE),
('850e8400-e29b-41d4-a716-446655440002', 'Travel Rewards Plus', 'points', 'Global Travel Co', 'Earn 2x points on travel and dining', 2.0000, 10000.00, 24, TRUE),
('850e8400-e29b-41d4-a716-446655440003', 'Crypto Rewards', 'crypto', 'CryptoCard', 'Earn Bitcoin rewards on every purchase', 1.5000, 10.00, 0, TRUE),
('850e8400-e29b-41d4-a716-446655440004', 'Dining Elite', 'cashback', 'FoodieCard', 'Earn 5% cashback at restaurants', 5.0000, 20.00, 12, FALSE),
('850e8400-e29b-41d4-a716-446655440005', 'Lifestyle Points', 'points', 'Lifestyle Bank', 'Earn points for lifestyle purchases', 1.0000, 5000.00, 36, FALSE),
('850e8400-e29b-41d4-a716-446655440006', 'NFT Collector', 'nft', 'NFT Rewards', 'Earn exclusive NFTs for spending milestones', 0.5000, 100.00, 0, TRUE)
ON CONFLICT DO NOTHING;

-- Insert user rewards accounts
INSERT INTO user_rewards_accounts (id, user_id, program_id, account_number, current_balance, lifetime_earned, lifetime_redeemed, tier_level, linked_wallet_id) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '850e8400-e29b-41d4-a716-446655440001', 'CB001234567', 156.75, 892.50, 735.75, 'gold', '550e8400-e29b-41d4-a716-446655440001'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '850e8400-e29b-41d4-a716-446655440002', 'TR987654321', 24580.00, 45230.00, 20650.00, 'platinum', '550e8400-e29b-41d4-a716-446655440002'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '850e8400-e29b-41d4-a716-446655440003', 'CR555666777', 0.00125000, 0.00890000, 0.00765000, 'silver', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (user_id, program_id) DO NOTHING;

-- Insert sample lifestyle activities
INSERT INTO lifestyle_activities (id, user_id, category_id, activity_type, title, description, location, venue_name, amount_spent, activity_date, duration_minutes, rating, tags, is_favorite) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440001', 'dining', 'Dinner at Le Bernardin', 'Exquisite French seafood tasting menu', 'New York, NY', 'Le Bernardin', 285.50, NOW() - INTERVAL '2 days', 180, 5, ARRAY['fine-dining', 'seafood', 'french', 'michelin'], TRUE),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440002', 'entertainment', 'Broadway Show - Hamilton', 'Amazing musical performance on Broadway', 'New York, NY', 'Richard Rodgers Theatre', 175.00, NOW() - INTERVAL '5 days', 165, 5, ARRAY['broadway', 'musical', 'theater', 'hamilton'], TRUE),
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440004', 'fitness', 'Personal Training Session', 'One-on-one fitness training session', 'Manhattan, NY', 'Elite Fitness Club', 120.00, NOW() - INTERVAL '1 day', 60, 4, ARRAY['fitness', 'personal-training', 'workout'], FALSE),
('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440005', 'shopping', 'Designer Handbag Purchase', 'New luxury handbag from Gucci', 'Fifth Avenue, NY', 'Gucci Flagship Store', 1850.00, NOW() - INTERVAL '7 days', 45, 5, ARRAY['luxury', 'fashion', 'handbag', 'gucci'], TRUE),
('a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440006', 'wellness', 'Spa Day Package', 'Full day spa treatment and relaxation', 'SoHo, NY', 'Bliss Spa', 320.00, NOW() - INTERVAL '3 days', 240, 5, ARRAY['spa', 'wellness', 'relaxation', 'massage'], TRUE),
('a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440001', 'dining', 'Wine Tasting Experience', 'Premium wine tasting with sommelier', 'Napa Valley, CA', 'Opus One Winery', 195.00, NOW() - INTERVAL '10 days', 120, 4, ARRAY['wine', 'tasting', 'napa', 'sommelier'], FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample rewards transactions
INSERT INTO rewards_transactions (user_id, rewards_account_id, activity_id, transaction_type, amount, points_value, description, merchant_name, merchant_category, earning_rate, bonus_multiplier) VALUES
('550e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'earned', 14.28, 14.28, 'Cashback earned from dining purchase', 'Le Bernardin', 'dining', 5.00, 1.0),
('550e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 'earned', 350.00, 175.00, 'Points earned from entertainment purchase', 'Richard Rodgers Theatre', 'entertainment', 2.00, 1.0),
('550e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440004', 'earned', 55.50, 55.50, 'Cashback earned from luxury shopping', 'Gucci Flagship Store', 'shopping', 3.00, 1.0),
('550e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440005', 'earned', 0.00048000, 1.60, 'Bitcoin rewards from spa purchase', 'Bliss Spa', 'wellness', 1.50, 1.0)
ON CONFLICT DO NOTHING;

-- Insert lifestyle goals
INSERT INTO lifestyle_goals (id, user_id, goal_type, title, description, target_amount, current_amount, target_date, category_id, priority, status) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'experience', 'Michelin Star Restaurant Tour', 'Visit 12 Michelin-starred restaurants this year', 3600.00, 285.50, '2024-12-31', '750e8400-e29b-41d4-a716-446655440001', 'high', 'active'),
('b50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'savings', 'European Vacation Fund', 'Save for a luxury European vacation', 8000.00, 2450.00, '2024-08-15', '750e8400-e29b-41d4-a716-446655440003', 'high', 'active'),
('b50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'activity', 'Fitness Challenge', 'Complete 100 workout sessions this year', 0.00, 0.00, '2024-12-31', '750e8400-e29b-41d4-a716-446655440004', 'medium', 'active'),
('b50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'reward', 'Platinum Status Goal', 'Reach platinum tier in travel rewards program', 0.00, 0.00, '2024-06-30', NULL, 'medium', 'active')
ON CONFLICT DO NOTHING;

-- Insert lifestyle recommendations
INSERT INTO lifestyle_recommendations (user_id, recommendation_type, title, description, category, location, estimated_cost, potential_rewards, confidence_score, expiration_date, is_featured) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'activity', 'Wine & Dine Experience', 'Exclusive wine pairing dinner at a Michelin-starred restaurant', 'dining', 'Manhattan, NY', 450.00, 22.50, 0.85, NOW() + INTERVAL '7 days', TRUE),
('550e8400-e29b-41d4-a716-446655440000', 'deal', 'Spa Weekend Package', '20% off luxury spa weekend package at The Plaza', 'wellness', 'New York, NY', 800.00, 40.00, 0.75, NOW() + INTERVAL '14 days', FALSE),
('550e8400-e29b-41d4-a716-446655440000', 'experience', 'Private Art Gallery Tour', 'Exclusive after-hours tour of MoMA with curator', 'entertainment', 'New York, NY', 350.00, 17.50, 0.90, NOW() + INTERVAL '10 days', TRUE),
('550e8400-e29b-41d4-a716-446655440000', 'reward', 'Double Points Weekend', 'Earn 2x points on all dining purchases this weekend', 'dining', 'Nationwide', 0.00, 0.00, 1.00, NOW() + INTERVAL '3 days', TRUE)
ON CONFLICT DO NOTHING;

-- Insert lifestyle challenges
INSERT INTO lifestyle_challenges (id, challenge_name, description, challenge_type, category, difficulty_level, duration_days, target_value, reward_amount, reward_type, max_participants, start_date, end_date, is_featured) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'Foodie Explorer Challenge', 'Try 10 different cuisines in 30 days', 'activity', 'dining', 'medium', 30, 10.00, 100.00, 'cashback', 1000, NOW(), NOW() + INTERVAL '30 days', TRUE),
('c50e8400-e29b-41d4-a716-446655440002', 'Wellness Warrior', 'Complete 20 wellness activities in 60 days', 'activity', 'wellness', 'hard', 60, 20.00, 250.00, 'points', 500, NOW(), NOW() + INTERVAL '60 days', TRUE),
('c50e8400-e29b-41d4-a716-446655440003', 'Luxury Saver', 'Save $2000 on luxury purchases through smart shopping', 'saving', 'shopping', 'expert', 90, 2000.00, 500.00, 'cashback', 200, NOW(), NOW() + INTERVAL '90 days', FALSE),
('c50e8400-e29b-41d4-a716-446655440004', 'Culture Enthusiast', 'Attend 15 cultural events in 45 days', 'activity', 'entertainment', 'medium', 45, 15.00, 200.00, 'nft', 750, NOW(), NOW() + INTERVAL '45 days', TRUE)
ON CONFLICT DO NOTHING;

-- Insert user challenge participation
INSERT INTO user_challenge_participation (user_id, challenge_id, current_progress, progress_percentage, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440001', 3.00, 30.00, 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'c50e8400-e29b-41d4-a716-446655440004', 2.00, 13.33, 'active')
ON CONFLICT (user_id, challenge_id) DO NOTHING;

-- Insert lifestyle insights
INSERT INTO lifestyle_insights (user_id, insight_type, title, description, insight_data, category, priority, potential_savings, potential_rewards, confidence_score) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'spending_pattern', 'Dining Expense Optimization', 'You could save 15% on dining by using your premium cashback card more frequently', '{"monthly_dining": 850, "potential_savings": 127.50, "recommended_card": "Premium Cashback"}', 'dining', 'high', 127.50, 42.50, 0.88),
('550e8400-e29b-41d4-a716-446655440000', 'reward_optimization', 'Maximize Travel Points', 'Book your upcoming trip through the travel portal to earn 3x points', '{"upcoming_trip_value": 2500, "bonus_points": 7500, "portal_bonus": "3x"}', 'travel', 'medium', 0.00, 375.00, 0.92),
('550e8400-e29b-41d4-a716-446655440000', 'goal_progress', 'Michelin Star Goal Update', 'You are 8% complete with your Michelin star restaurant goal. 11 more restaurants to go!', '{"goal_progress": 8.0, "restaurants_visited": 1, "remaining": 11}', 'dining', 'medium', 0.00, 0.00, 1.00)
ON CONFLICT DO NOTHING;

-- Update goal progress percentages
UPDATE lifestyle_goals 
SET progress_percentage = CASE 
    WHEN target_amount > 0 THEN (current_amount / target_amount) * 100
    WHEN target_count > 0 THEN (current_count::NUMERIC / target_count) * 100
    ELSE 0
END;
