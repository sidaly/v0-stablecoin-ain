"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Gift,
  Star,
  Trophy,
  Crown,
  Zap,
  Coffee,
  Plane,
  ShoppingBag,
  Gamepad2,
  Heart,
  Target,
  TrendingUp,
} from "lucide-react"
import { getLifestyleRewards, claimReward, getRewardHistory } from "@/lib/lifestyle-actions"

interface Reward {
  id: number
  title: string
  description: string
  points_required: number
  category: string
  image_url?: string
  is_claimed: boolean
  expires_at?: string
}

interface RewardHistory {
  id: number
  reward_title: string
  claimed_at: string
  points_used: number
}

export function LifestyleDashboard() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([])
  const [userPoints, setUserPoints] = useState(2450)
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<number | null>(null)

  useEffect(() => {
    loadRewards()
    loadRewardHistory()
  }, [])

  const loadRewards = async () => {
    try {
      const data = await getLifestyleRewards()
      setRewards(data)
    } catch (error) {
      console.error("Failed to load rewards:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRewardHistory = async () => {
    try {
      const data = await getRewardHistory()
      setRewardHistory(data)
    } catch (error) {
      console.error("Failed to load reward history:", error)
    }
  }

  const handleClaimReward = async (rewardId: number, pointsRequired: number) => {
    if (userPoints < pointsRequired) return

    setClaimingId(rewardId)
    try {
      await claimReward(rewardId)
      setUserPoints((prev) => prev - pointsRequired)
      setRewards((prev) => prev.map((reward) => (reward.id === rewardId ? { ...reward, is_claimed: true } : reward)))
      await loadRewardHistory()
    } catch (error) {
      console.error("Failed to claim reward:", error)
    } finally {
      setClaimingId(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "travel":
        return <Plane className="w-4 h-4" />
      case "dining":
        return <Coffee className="w-4 h-4" />
      case "shopping":
        return <ShoppingBag className="w-4 h-4" />
      case "entertainment":
        return <Gamepad2 className="w-4 h-4" />
      case "wellness":
        return <Heart className="w-4 h-4" />
      default:
        return <Gift className="w-4 h-4" />
    }
  }

  const getNextTierProgress = () => {
    const tiers = [
      { name: "Bronze", min: 0, max: 1000 },
      { name: "Silver", min: 1000, max: 2500 },
      { name: "Gold", min: 2500, max: 5000 },
      { name: "Platinum", min: 5000, max: 10000 },
    ]

    const currentTier = tiers.find((tier) => userPoints >= tier.min && userPoints < tier.max)
    if (!currentTier) return { tier: "Platinum", progress: 100, pointsToNext: 0 }

    const progress = ((userPoints - currentTier.min) / (currentTier.max - currentTier.min)) * 100
    const pointsToNext = currentTier.max - userPoints

    return { tier: currentTier.name, progress, pointsToNext }
  }

  const tierInfo = getNextTierProgress()

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-800/50 rounded-xl" />
        <div className="h-64 bg-gray-800/50 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Points & Tier Status */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-white">Reward Points</CardTitle>
                <CardDescription>Current tier: {tierInfo.tier}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">{userPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-400">points</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress to next tier</span>
              <span className="text-white">{tierInfo.pointsToNext} points to go</span>
            </div>
            <Progress value={tierInfo.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Rewards Tabs */}
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="claimed">Claimed</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4">
            {rewards
              .filter((reward) => !reward.is_claimed)
              .map((reward) => (
                <Card
                  key={reward.id}
                  className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 bg-purple-500/20 rounded-lg">{getCategoryIcon(reward.category)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{reward.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{reward.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                              {reward.category}
                            </Badge>
                            <div className="flex items-center space-x-1 text-sm text-yellow-400">
                              <Star className="w-3 h-3" />
                              <span>{reward.points_required} points</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleClaimReward(reward.id, reward.points_required)}
                        disabled={userPoints < reward.points_required || claimingId === reward.id}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        {claimingId === reward.id ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Claiming...</span>
                          </div>
                        ) : userPoints < reward.points_required ? (
                          "Insufficient Points"
                        ) : (
                          "Claim"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="claimed" className="space-y-4">
          <div className="grid gap-4">
            {rewards
              .filter((reward) => reward.is_claimed)
              .map((reward) => (
                <Card key={reward.id} className="bg-gray-800/30 border-gray-700/30">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Trophy className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{reward.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{reward.description}</p>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                          Claimed
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-3">
            {rewardHistory.map((item) => (
              <Card key={item.id} className="bg-gray-800/30 border-gray-700/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Target className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{item.reward_title}</h3>
                        <p className="text-sm text-gray-400">
                          Claimed on {new Date(item.claimed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-400">-{item.points_used}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-lg font-bold text-white">{rewardHistory.length}</div>
            <div className="text-sm text-gray-400">Rewards Claimed</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {rewardHistory.reduce((sum, item) => sum + item.points_used, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Points Spent</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
