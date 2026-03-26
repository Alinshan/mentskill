"use client";

import { useUserData } from "@/context/UserDataProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LuCheck, LuCreditCard, LuZap } from "react-icons/lu";
import { toast } from "sonner";

export default function BillingPage() {
  const { user } = useUserData();

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 w-full">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-3xl font-sora font-bold tracking-tight text-gray-900">
            Billing & Plans
          </h1>
          <p className="text-muted-foreground font-inter">
            Manage your subscription, view payment history, and buy credits.
          </p>
        </div>

        {/* Current Plan Card */}
        <Card className="border-blue-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <LuCreditCard className="w-48 h-48" />
          </div>
          <CardHeader className="pb-4 relative">
            <CardTitle className="font-sora text-xl flex items-center justify-between">
              Your Current Plan
              {user?.isPro ? (
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-inter">Pro Member</Badge>
              ) : (
                <Badge variant="secondary" className="font-inter">Free Tier</Badge>
              )}
            </CardTitle>
            <CardDescription className="font-inter">
              You are currently on the {user?.isPro ? "Pro" : "Free"} tier.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="mt-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100/50 rounded-xl">
                  <LuZap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-lg font-sora leading-none">
                    {user?.remainingCredits || 0} Credits
                  </p>
                  <p className="text-sm text-muted-foreground font-inter mt-1">
                    Remaining balance
                  </p>
                </div>
              </div>
            </div>
            {/* Progress Bar showing arbitrary limit for design aesthetics */}
            <div className="mt-8">
              <div className="flex justify-between text-sm font-inter mb-2">
                <span className="text-gray-600 font-medium">Credits Used</span>
                <span className="text-gray-900 font-semibold">{100 - (user?.remainingCredits || 0)} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, 100 - (user?.remainingCredits || 0)))}%` }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 border-t mt-4 py-4 relative flex justify-between">
            <Button 
              variant="outline" 
              className="font-inter border-gray-200"
              onClick={() => toast.info("Invoice History", { description: "Your payment history will appear here once Stripe is connected." })}
            >
              View Invoice History
            </Button>
            <Button 
              className="font-inter bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => toast.info("Buy Credits", { description: "Credit purchasing is currently in development." })}
            >
              Buy More Credits
            </Button>
          </CardFooter>
        </Card>

        {/* Upgrade / Pricing Tiers */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-sora font-semibold text-gray-900">
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Free Tier */}
            <Card className="border-gray-200 shadow-sm relative overflow-hidden group hover:border-gray-300 transition-colors">
              <CardHeader>
                <CardTitle className="font-inter text-xl">Starter Plan</CardTitle>
                <CardDescription className="font-inter">Perfect for fresh graduates looking for basic assistance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-sora font-bold text-gray-900">$0</span>
                  <span className="text-muted-foreground font-inter"> / forever</span>
                </div>
                <ul className="space-y-3 font-inter text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <LuCheck className="w-4 h-4 text-green-500" />
                    5 AI Interviews per month
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCheck className="w-4 h-4 text-green-500" />
                    Basic Job Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCheck className="w-4 h-4 text-green-500" />
                    Standard Resume Reviews
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button disabled={!user?.isPro} variant="outline" className="w-full font-inter cursor-not-allowed">
                  Current Plan
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Tier */}
            <Card className="border-blue-200 bg-gradient-to-b from-blue-50/50 to-white shadow-md relative overflow-hidden group border-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <CardHeader>
                <div className="flex justify-between items-center w-full">
                  <CardTitle className="font-inter text-xl text-blue-900">Pro Career</CardTitle>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-inter border-none">Most Popular</Badge>
                </div>
                <CardDescription className="font-inter">Unlimited AI power to rapidly accelerate your career.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-sora font-bold text-gray-900">$19</span>
                  <span className="text-muted-foreground font-inter"> / month</span>
                </div>
                <ul className="space-y-3 font-inter text-sm text-gray-700 font-medium">
                  <li className="flex items-center gap-2">
                    <LuCheck className="w-4 h-4 text-blue-600 font-bold" />
                    Unlimited AI Career Coach
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCheck className="w-4 h-4 text-blue-600 font-bold" />
                    Unlimited High-Fidelity API Voice Mock Interviews
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCheck className="w-4 h-4 text-blue-600 font-bold" />
                    Advanced Roadmapping
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCheck className="w-4 h-4 text-blue-600 font-bold" />
                    Priority Support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    if (user?.isPro) {
                      toast.info("Manage Subscription", { description: "You are already a Pro Member! Billing portal coming soon." });
                    } else {
                      toast.info("Upgrade to Pro", { description: "Stripe checkout integration is coming soon!" });
                    }
                  }}
                  className={`w-full font-inter shadow-md transition-all ${user?.isPro ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  {user?.isPro ? "Manage Pro Subscription" : "Upgrade to Pro"}
                </Button>
              </CardFooter>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
