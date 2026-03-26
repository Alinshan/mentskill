"use client";

import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-sora text-gray-900 tracking-tight">Billing & Subscriptions</h1>
        <p className="text-gray-500 font-inter mt-1 tracking-tight">Manage your payment methods and Pro subscription.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Current Free Plan */}
        <div className="border border-gray-200 bg-white rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-24 h-24" />
          </div>
          <h2 className="text-xl font-sora font-semibold text-gray-800">Basic Tier</h2>
          <div className="mt-4 flex items-baseline text-5xl font-extrabold font-sora tracking-tighter">
            $0<span className="text-xl font-medium text-gray-500 ml-1">/mo</span>
          </div>
          <p className="text-gray-500 mt-4 text-sm font-inter">Your current active plan. Perfect for just getting started.</p>
          <ul className="mt-8 space-y-4 font-inter text-sm text-gray-600 flex-1">
            <li className="flex gap-3"><Check className="w-5 h-5 text-gray-400" /> Up to 5 Sessions / Month</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-gray-400" /> Standard Matchmaking</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-gray-400" /> Regular Support</li>
          </ul>
          <Button variant="outline" className="w-full mt-8 rounded-xl font-semibold disabled:opacity-50" disabled>
            Current Plan
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-indigo-500 bg-gradient-to-b from-indigo-50/50 to-white rounded-3xl p-8 shadow-xl flex flex-col relative overflow-hidden transform transition-all hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-600">
            <Zap className="w-24 h-24" />
          </div>
          <div className="inline-flex px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs mb-4 w-fit tracking-wide">RECOMMENDED</div>
          <h2 className="text-xl font-sora font-semibold text-indigo-900">Pro Tier</h2>
          <div className="mt-4 flex items-baseline text-5xl font-extrabold font-sora tracking-tighter text-indigo-600">
            $29<span className="text-xl font-medium text-indigo-400 ml-1">/mo</span>
          </div>
          <p className="text-indigo-900/60 mt-4 text-sm font-inter">Scale your mentoring career with unlimited capabilities.</p>
          <ul className="mt-8 space-y-4 font-inter text-sm text-indigo-900/80 flex-1">
            <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-500" /> Unlimited Sessions</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-500" /> Priority Matchmaking Algorithm</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-500" /> AI Assistant Co-pilot</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-500" /> 0% Platform Fees</li>
          </ul>
          <Button className="w-full mt-8 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
