"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function getUserLifestyleActivities(userId: string, limit = 10) {
  try {
    const activities = await sql`
      SELECT * FROM lifestyle_activities 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `
    return { success: true, activities }
  } catch (error) {
    console.error("Error fetching lifestyle activities:", error)
    return { success: false, activities: [] }
  }
}

export async function getUserRewardsAccounts(userId: string) {
  try {
    const accounts = await sql`
      SELECT * FROM rewards_accounts 
      WHERE user_id = ${userId}
    `
    return { success: true, accounts }
  } catch (error) {
    console.error("Error fetching rewards accounts:", error)
    return { success: false, accounts: [] }
  }
}

export async function getUserLifestyleGoals(userId: string) {
  try {
    const goals = await sql`
      SELECT * FROM lifestyle_goals 
      WHERE user_id = ${userId}
    `
    return { success: true, goals }
  } catch (error) {
    console.error("Error fetching lifestyle goals:", error)
    return { success: false, goals: [] }
  }
}

export async function getLifestyleRecommendations(userId: string) {
  try {
    const recommendations = await sql`
      SELECT * FROM lifestyle_recommendations 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return { success: true, recommendations }
  } catch (error) {
    console.error("Error fetching lifestyle recommendations:", error)
    return { success: false, recommendations: [] }
  }
}

export async function getLifestyleChallenges(userId: string) {
  try {
    const challenges = await sql`
      SELECT * FROM lifestyle_challenges 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return { success: true, challenges }
  } catch (error) {
    console.error("Error fetching lifestyle challenges:", error)
    return { success: false, challenges: [] }
  }
}

export async function getLifestyleInsights(userId: string) {
  try {
    const insights = await sql`
      SELECT * FROM lifestyle_insights 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return { success: true, insights }
  } catch (error) {
    console.error("Error fetching lifestyle insights:", error)
    return { success: false, insights: [] }
  }
}

export async function getLifestyleAnalytics(userId: string, period = "month") {
  try {
    const analytics = await sql`
      SELECT 
        category,
        SUM(cost) as total_spent,
        COUNT(*) as activity_count
      FROM lifestyle_activities 
      WHERE user_id = ${userId}
      AND created_at >= NOW() - INTERVAL '1 ${period}'
      GROUP BY category
    `

    const totalSpent = analytics.reduce((sum: number, item: any) => sum + Number.parseFloat(item.total_spent), 0)
    const totalRewards = totalSpent * 0.02 // 2% rewards rate

    return {
      success: true,
      analytics,
      totalSpent,
      totalRewards,
    }
  } catch (error) {
    console.error("Error fetching lifestyle analytics:", error)
    return {
      success: false,
      analytics: [],
      totalSpent: 0,
      totalRewards: 0,
    }
  }
}

// New functions for rewards management
export async function getLifestyleRewards() {
  // Mock data for rewards - in a real app, this would come from database
  return [
    {
      id: 1,
      title: "Premium Coffee Subscription",
      description: "Get 3 months of premium coffee delivered to your door",
      points_required: 500,
      category: "dining",
      is_claimed: false,
      expires_at: "2024-12-31",
    },
    {
      id: 2,
      title: "$50 Travel Credit",
      description: "Use towards your next flight or hotel booking",
      points_required: 1000,
      category: "travel",
      is_claimed: false,
      expires_at: "2024-12-31",
    },
    {
      id: 3,
      title: "Fitness Tracker",
      description: "Latest smartwatch with health monitoring features",
      points_required: 2000,
      category: "wellness",
      is_claimed: false,
      expires_at: "2024-12-31",
    },
    {
      id: 4,
      title: "Shopping Voucher",
      description: "$25 credit for online shopping",
      points_required: 750,
      category: "shopping",
      is_claimed: false,
      expires_at: "2024-12-31",
    },
    {
      id: 5,
      title: "Concert Tickets",
      description: "VIP access to exclusive music events",
      points_required: 1500,
      category: "entertainment",
      is_claimed: true,
      expires_at: "2024-12-31",
    },
  ]
}

export async function claimReward(rewardId: number) {
  // Mock implementation - in a real app, this would update the database
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

  console.log(`Claiming reward with ID: ${rewardId}`)
  return { success: true, message: "Reward claimed successfully!" }
}

export async function getRewardHistory() {
  // Mock data for reward history
  return [
    {
      id: 1,
      reward_title: "Concert Tickets",
      claimed_at: "2024-01-15T10:30:00Z",
      points_used: 1500,
    },
    {
      id: 2,
      reward_title: "Coffee Gift Card",
      claimed_at: "2024-01-10T14:20:00Z",
      points_used: 300,
    },
    {
      id: 3,
      reward_title: "Movie Tickets",
      claimed_at: "2024-01-05T16:45:00Z",
      points_used: 400,
    },
  ]
}
