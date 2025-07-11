"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function getUserWallets(userId: string) {
  try {
    const wallets = await sql`
      SELECT id, wallet_address, currency, balance, wallet_type, is_primary
      FROM wallet_accounts 
      WHERE user_id = ${userId} AND status = 'active'
      ORDER BY is_primary DESC, currency ASC
    `
    return { success: true, wallets }
  } catch (error) {
    console.error("Error fetching wallets:", error)
    return { success: false, error: "Failed to fetch wallets" }
  }
}

export async function getUserContacts(userId: string) {
  try {
    const contacts = await sql`
      SELECT id, contact_name, contact_address, contact_type, is_favorite, last_used_at
      FROM user_contacts 
      WHERE user_id = ${userId}
      ORDER BY is_favorite DESC, last_used_at DESC NULLS LAST, contact_name ASC
      LIMIT 10
    `
    return { success: true, contacts }
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return { success: false, error: "Failed to fetch contacts" }
  }
}

export async function addContact(userId: string, contactName: string, contactAddress: string, contactType = "wallet") {
  try {
    const [contact] = await sql`
      INSERT INTO user_contacts (user_id, contact_name, contact_address, contact_type)
      VALUES (${userId}, ${contactName}, ${contactAddress}, ${contactType})
      ON CONFLICT (user_id, contact_address) 
      DO UPDATE SET contact_name = ${contactName}, updated_at = NOW()
      RETURNING *
    `
    return { success: true, contact }
  } catch (error) {
    console.error("Error adding contact:", error)
    return { success: false, error: "Failed to add contact" }
  }
}

export async function createTransfer(formData: FormData) {
  const userId = formData.get("userId") as string
  const fromWalletId = formData.get("fromWalletId") as string
  const toAddress = formData.get("toAddress") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const currency = formData.get("currency") as string
  const description = (formData.get("description") as string) || ""
  const recipientName = (formData.get("recipientName") as string) || ""

  try {
    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Calculate fee (0.1% of amount, minimum 0.01)
    const feeAmount = Math.max(amount * 0.001, 0.01)

    // Check wallet balance
    const [wallet] = await sql`
      SELECT balance FROM wallet_accounts 
      WHERE id = ${fromWalletId} AND user_id = ${userId}
    `

    if (!wallet || Number.parseFloat(wallet.balance) < amount + feeAmount) {
      return { success: false, error: "Insufficient balance" }
    }

    // Create transaction record
    const [transaction] = await sql`
      INSERT INTO transactions (
        transaction_id, user_id, from_wallet_id, transaction_type, 
        amount, currency, fee_amount, status, description, 
        recipient_address, recipient_name
      )
      VALUES (
        ${transactionId}, ${userId}, ${fromWalletId}, 'transfer',
        ${amount}, ${currency}, ${feeAmount}, 'pending', ${description},
        ${toAddress}, ${recipientName}
      )
      RETURNING *
    `

    // Update wallet balance
    await sql`
      UPDATE wallet_accounts 
      SET balance = balance - ${amount + feeAmount}, updated_at = NOW()
      WHERE id = ${fromWalletId}
    `

    // Simulate processing delay
    setTimeout(async () => {
      try {
        await sql`
          UPDATE transactions 
          SET status = 'completed', completed_at = NOW(), confirmation_count = 12
          WHERE id = ${transaction.id}
        `
      } catch (error) {
        console.error("Error updating transaction status:", error)
      }
    }, 3000)

    return {
      success: true,
      transaction,
      message: `Transfer of ${amount} ${currency} initiated successfully`,
    }
  } catch (error) {
    console.error("Error creating transfer:", error)
    return { success: false, error: "Failed to process transfer" }
  }
}

export async function createPaymentRequest(formData: FormData) {
  const requesterId = formData.get("requesterId") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const currency = formData.get("currency") as string
  const description = (formData.get("description") as string) || ""

  try {
    const requestId = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

    const [request] = await sql`
      INSERT INTO transfer_requests (
        request_id, requester_id, amount, currency, description, expires_at
      )
      VALUES (${requestId}, ${requesterId}, ${amount}, ${currency}, ${description}, ${expiresAt})
      RETURNING *
    `

    return {
      success: true,
      request,
      message: `Payment request for ${amount} ${currency} created successfully`,
    }
  } catch (error) {
    console.error("Error creating payment request:", error)
    return { success: false, error: "Failed to create payment request" }
  }
}

export async function getTransactionHistory(userId: string, limit = 20) {
  try {
    const transactions = await sql`
      SELECT 
        t.*,
        wa_from.currency as from_currency,
        wa_to.currency as to_currency
      FROM transactions t
      LEFT JOIN wallet_accounts wa_from ON t.from_wallet_id = wa_from.id
      LEFT JOIN wallet_accounts wa_to ON t.to_wallet_id = wa_to.id
      WHERE t.user_id = ${userId}
      ORDER BY t.created_at DESC
      LIMIT ${limit}
    `
    return { success: true, transactions }
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return { success: false, error: "Failed to fetch transaction history" }
  }
}

export async function getExchangeRate(fromCurrency: string, toCurrency: string) {
  try {
    // In a real app, you'd fetch from an external API
    // For demo purposes, we'll use mock rates
    const mockRates: Record<string, number> = {
      USD_USDC: 0.9998,
      USD_USDT: 0.9999,
      USD_DAI: 0.9997,
      EUR_USDC: 1.0856,
      EUR_USDT: 1.0857,
      EUR_DAI: 1.0855,
      GBP_USDC: 1.2734,
      GBP_USDT: 1.2735,
      GBP_DAI: 1.2733,
    }

    const rateKey = `${fromCurrency}_${toCurrency}`
    const rate = mockRates[rateKey] || 1.0

    // Store in database
    await sql`
      INSERT INTO exchange_rates (from_currency, to_currency, rate, provider, valid_until)
      VALUES (${fromCurrency}, ${toCurrency}, ${rate}, 'mock_provider', NOW() + INTERVAL '1 hour')
      ON CONFLICT (from_currency, to_currency, provider)
      DO UPDATE SET rate = ${rate}, valid_until = NOW() + INTERVAL '1 hour', created_at = NOW()
    `

    return { success: true, rate }
  } catch (error) {
    console.error("Error fetching exchange rate:", error)
    return { success: false, error: "Failed to fetch exchange rate", rate: 1.0 }
  }
}
