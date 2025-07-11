"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, TrendingUp } from "lucide-react"
import { useState } from "react"

export function CurrencyConverter() {
  const [fromAmount, setFromAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("USDC")

  const exchangeRate = 0.9998 // Example rate
  const convertedAmount = Number.parseFloat(fromAmount || "0") * exchangeRate

  const fiatCurrencies = [
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  ]

  const stablecoins = [
    { code: "USDC", name: "USD Coin", icon: "💎" },
    { code: "USDT", name: "Tether", icon: "💚" },
    { code: "DAI", name: "Dai", icon: "🟡" },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Currency Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Currency */}
          <div className="space-y-3">
            <Label className="text-gray-300">From</Label>
            <div className="space-y-2">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {fiatCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <span className="flex items-center space-x-2">
                        <span>{currency.flag}</span>
                        <span>
                          {currency.code} - {currency.name}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white text-xl font-semibold"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-3">
            <Label className="text-gray-300">To</Label>
            <div className="space-y-2">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {stablecoins.map((coin) => (
                    <SelectItem key={coin.code} value={coin.code}>
                      <span className="flex items-center space-x-2">
                        <span>{coin.icon}</span>
                        <span>
                          {coin.code} - {coin.name}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
                <div className="text-white text-xl font-semibold">{convertedAmount.toFixed(4)}</div>
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Exchange Rate</span>
              <span className="text-white">
                1 {fromCurrency} = {exchangeRate} {toCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-400">Fee</span>
              <span className="text-white">0.1%</span>
            </div>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            Convert {fromAmount || "0"} {fromCurrency} to {toCurrency}
          </Button>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stablecoins.map((coin) => (
            <div key={coin.code} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{coin.icon}</span>
                <span className="text-white text-sm">{coin.code}/USD</span>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">$0.9998</div>
                <div className="text-green-400 text-xs">+0.01%</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
