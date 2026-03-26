"use client";

import React from "react";
import MentorSessionsTabs from "../../_components/MentorTabs";
import { LuHistory } from "react-icons/lu";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 w-full">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div>
          <h1 className="text-3xl font-sora font-semibold tracking-tight text-slate-900 flex items-center gap-3">
            <LuHistory className="text-blue-600" />
            Session History
          </h1>
          <p className="text-muted-foreground font-inter mt-1">
            Browse and manage your pending requests, confirmed bookings, and historic sessions.
          </p>
        </div>

        {/* Sessions Data Mount Point */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 pb-10 overflow-hidden">
          <MentorSessionsTabs />
        </div>
      </div>
    </div>
  );
}
