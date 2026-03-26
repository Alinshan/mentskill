"use client";

import { Sparkles, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AiAssistantPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-sora text-gray-900 tracking-tight">Clario AI Co-pilot</h1>
          <p className="text-gray-500 font-inter text-sm tracking-tight">Your intelligent mentoring assistant. Ask for session plans, tips, or student analysis.</p>
        </div>
      </div>

      <div className="flex-1 border border-gray-200 bg-white rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[bottom_1px_center] opacity-20" />
        
        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto z-10 space-y-6">
          <div className="flex justify-center text-xs text-gray-400 font-inter mb-4">Today, 9:41 AM</div>
          
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-2 rounded-full shrink-0">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 p-4 rounded-2xl rounded-tl-sm text-sm font-inter max-w-[80%] leading-relaxed">
              Hi! I'm Clario AI. I can help you prepare for your upcoming session with <strong>Samantha Lee</strong>. Would you like me to analyze her past mentorship goals or generate a 60-minute discussion curriculum for you?
            </div>
          </div>
          
          <div className="flex items-start gap-4 flex-row-reverse">
            <div className="bg-gray-100 p-2 rounded-full shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="bg-[#0E72ED] text-white p-4 rounded-2xl rounded-tr-sm text-sm font-inter max-w-[80%] leading-relaxed shadow-md">
              Generate a quick 60-minute curriculum for React architecture.
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 z-10">
          <div className="flex items-center gap-2 max-w-3xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Ask Clario AI anything..." 
              className="w-full bg-white border border-gray-300 rounded-full px-6 py-3.5 pr-14 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
            <Button size="icon" className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full w-10 h-10 bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
          <div className="flex justify-center mt-3 gap-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Powered by CLARIO-LLM v2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
