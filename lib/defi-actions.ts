"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function getUserDefiPositions(userId: string) {
  try {
    const positions = await sql`
      SELECT 
        udp.*,
        dp.name as protocol_name,
        dp.protocol_type,
        dp.risk_level as protocol_risk_level,
        dpo.pool_name,
        dpo.base_token,
        dpo.quote_token,
        dpo.token_pair
      FROM user_defi_positions udp
      JOIN defi_protocols dp ON udp.protocol_id = dp.id
      LEFT JOIN defi_pools dpo ON udp.pool_id = dpo.id
      WHERE udp.user_id = ${userId} AND udp.status = 'active'
      ORDER BY udp.current_value DESC
    `

    // Calculate portfolio metrics
    const totalValue = positions.reduce((sum, pos) => sum + Number.parseFloat(pos.current_value), 0)
    const totalDeposited = positions.reduce((sum, pos) => sum + Number.parseFloat(pos.amount_deposited), 0)
    const totalRewards = positions.reduce((sum, pos) => sum + Number.parseFloat(pos.rewards_earned), 0)
    const totalReturn = totalValue - totalDeposited
    const totalReturnPercentage = totalDeposited > 0 ? (totalReturn / totalDeposited) * 100 : 0

    const portfolioMetrics = {
      current_value: totalValue.toString(),
      total_deposited: totalDeposited.toString(),
      total_rewards: totalRewards.toString(),
      total_return: totalReturn.toString(),
      total_return_percentage: totalReturnPercentage.toString(),
    }

    return {
      success: true,
      positions,
      portfolioMetrics,
    }
  } catch (error) {
    console.error("Error fetching user DeFi positions:", error)
    return {
      success: false,
      error: "Failed to fetch DeFi positions",
    }
  }
}

export async function getDefiProtocols() {
  try {
    const protocols = await sql`
      SELECT * FROM defi_protocols 
      WHERE is_active = true 
      ORDER BY tvl DESC
    `

    return {
      success: true,
      protocols,
    }
  } catch (error) {
    console.error("Error fetching DeFi protocols:", error)
    return {
      success: false,
      error: "Failed to fetch DeFi protocols",
    }
  }
}

export async function getTopDefiOpportunities(limit = 10) {
  try {
    const opportunities = await sql`
      SELECT 
        dpo.*,
        dp.name as protocol_name,
        dp.protocol_type,
        dp.audit_status,
        dp.risk_level
      FROM defi_pools dpo
      JOIN defi_protocols dp ON dpo.protocol_id = dp.id
      WHERE dpo.is_active = true AND dp.is_active = true
      ORDER BY dpo.current_apy DESC
      LIMIT ${limit}
    `

    return {
      success: true,
      opportunities,
    }
  } catch (error) {
    console.error("Error fetching DeFi opportunities:", error)
    return {
      success: false,
      error: "Failed to fetch DeFi opportunities",
    }
  }
}

export async function getDefiAlerts(userId: string) {
  try {
    const alerts = await sql`
      SELECT * FROM defi_alerts 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    return {
      success: true,
      alerts,
    }
  } catch (error) {
    console.error("Error fetching DeFi alerts:", error)
    return {
      success: false,
      error: "Failed to fetch DeFi alerts",
    }
  }
}

export async function getMarketData(tokens: string[]) {
  try {
    const marketData = await sql`
      SELECT * FROM market_data 
      WHERE token_symbol = ANY(${tokens})
      ORDER BY market_cap DESC
    `

    return {
      success: true,
      marketData,
    }
  } catch (error) {
    console.error("Error fetching market data:", error)
    return {
      success: false,
      error: "Failed to fetch market data",
    }
  }
}

export async function createDefiPosition(
  userId: string,
  protocolId: string,
  poolId: string,
  positionType: string,
  amount: number,
) {
  try {
    // Get pool information
    const pool = await sql`
      SELECT dpo.*, dp.name as protocol_name
      FROM defi_pools dpo
      JOIN defi_protocols dp ON dpo.protocol_id = dp.id
      WHERE dpo.id = ${poolId}
    `

    if (pool.length === 0) {
      return {
        success: false,
        error: "Pool not found",
      }
    }

    const poolData = pool[0]

    // Create new position
    const position = await sql`
      INSERT INTO user_defi_positions (
        user_id, protocol_id, pool_id, position_type, 
        amount_deposited, current_value, entry_apy, current_apy
      ) VALUES (
        ${userId}, ${protocolId}, ${poolId}, ${positionType},
        ${amount}, ${amount}, ${poolData.current_apy}, ${poolData.current_apy}
      )
      RETURNING *
    `

    // Create transaction record
    await sql`
      INSERT INTO defi_transactions (
        user_id, position_id, transaction_type, amount, token, status
      ) VALUES (
        ${userId}, ${position[0].id}, 'deposit', ${amount}, ${poolData.base_token}, 'confirmed'
      )
    `

    return {
      success: true,
      position: position[0],
    }
  } catch (error) {
    console.error("Error creating DeFi position:", error)
    return {
      success: false,
      error: "Failed to create DeFi position",
    }
  }
}

export async function withdrawDefiPosition(positionId: string, amount: number) {
  try {
    // Get position details
    const position = await sql`
      SELECT * FROM user_defi_positions WHERE id = ${positionId}
    `

    if (position.length === 0) {
      return {
        success: false,
        error: "Position not found",
      }
    }

    const positionData = position[0]
    const currentValue = Number.parseFloat(positionData.current_value)

    if (amount > currentValue) {
      return {
        success: false,
        error: "Insufficient balance",
      }
    }

    // Update position
    const newValue = currentValue - amount
    const status = newValue <= 0 ? "withdrawn" : "active"

    await sql`
      UPDATE user_defi_positions 
      SET current_value = ${newValue}, status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${positionId}
    `

    // Create transaction record
    await sql`
      INSERT INTO defi_transactions (
        user_id, position_id, transaction_type, amount, token, status
      ) VALUES (
        ${positionData.user_id}, ${positionId}, 'withdraw', ${amount}, 'USDC', 'confirmed'
      )
    `

    return {
      success: true,
      message: "Withdrawal successful",
    }
  } catch (error) {
    console.error("Error withdrawing from DeFi position:", error)
    return {
      success: false,
      error: "Failed to withdraw from position",
    }
  }
}

export async function claimDefiRewards(positionId: string) {
  try {
    // Get position details
    const position = await sql`
      SELECT * FROM user_defi_positions WHERE id = ${positionId}
    `

    if (position.length === 0) {
      return {
        success: false,
        error: "Position not found",
      }
    }

    const positionData = position[0]
    const rewardsEarned = Number.parseFloat(positionData.rewards_earned)

    if (rewardsEarned <= 0) {
      return {
        success: false,
        error: "No rewards to claim",
      }
    }

    // Update position - reset rewards earned
    await sql`
      UPDATE user_defi_positions 
      SET rewards_earned = 0, rewards_claimed = rewards_claimed + ${rewardsEarned}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${positionId}
    `

    // Create transaction record
    await sql`
      INSERT INTO defi_transactions (
        user_id, position_id, transaction_type, amount, token, status
      ) VALUES (
        ${positionData.user_id}, ${positionId}, 'claim_rewards', ${rewardsEarned}, 'AAVE', 'confirmed'
      )
    `

    return {
      success: true,
      amount: rewardsEarned,
      message: "Rewards claimed successfully",
    }
  } catch (error) {
    console.error("Error claiming DeFi rewards:", error)
    return {
      success: false,
      error: "Failed to claim rewards",
    }
  }
}
