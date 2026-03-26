"use client";

import React from "react";
import { LuMessageCircleHeart } from "react-icons/lu";

const Messages = () => {
  return (
    <div className="w-full bg-white border rounded-md h-full p-5 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center -mt-20 max-w-lg text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-100 mb-6 shadow-sm border border-blue-200">
          <LuMessageCircleHeart className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-sora font-semibold text-slate-900 tracking-tight">Welcome to Messages</h1>
        <p className="text-lg text-slate-500 font-inter mt-4 leading-relaxed">
          Discover students from your institution and start a conversation, or get connected with experts.
        </p>
      </div>
    </div>
  );
};

export default Messages;
