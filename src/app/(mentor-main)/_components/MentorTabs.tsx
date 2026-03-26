"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MentorSession } from "@/lib/types/allTypes";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useUserData } from "@/context/UserDataProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LuEye } from "react-icons/lu";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConfirmTab from "./ConfirmTab";

export default function MentorSessionsTabs() {
  const supabase = createClient();
  const { mentor } = useUserData();
  const [activeTab, setActiveTab] = useState("pending");
  const [isMockSessionVisible, setIsMockSessionVisible] = useState(true);
  const [isSamanthaAccepted, setIsSamanthaAccepted] = useState(false);
  const [pendingSessions, setPendingSessions] = useState<
    (MentorSession & {
      userName: string;
      userEmail: string;
      avatar: string | null;
    })[]
  >([]);

  useEffect(() => {
    if (!mentor?.id) return;

    const fetchPending = async () => {
      const { data: sessions, error } = await supabase
        .from("mentor_sessions")
        .select("*")
        .eq("mentor_id", mentor.id)
        .eq("status", "pending")
        .order("requested_at", { ascending: false });

      if (error) {
        console.error("Error fetching pending sessions:", error);
        return;
      }

      if (!sessions || sessions.length === 0) {
        setPendingSessions([]);
        return;
      }

      // Get all unique student IDs
      const studentIds = [...new Set(sessions.map((s) => s.student_id))];

      // Fetch user details from `users` table
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, userName, userEmail, avatar")
        .in("id", studentIds);

      if (userError) {
        console.error("Error fetching user details:", userError);
        return;
      }

      // Merge sessions with their user info
      const merged = sessions.map((session) => {
        const user = users?.find((u) => u.id === session.student_id);
        return {
          ...session,
          userName: user?.userName || "Unknown User",
          userEmail: user?.userEmail || "No Email",
          avatar: user?.avatar || "/user.png",
        };
      });

      setPendingSessions(merged);
    };

    fetchPending();
  }, [mentor?.id]);

  // -----------------Subscribe to realtime updates-----------------------
  useEffect(() => {
    if (!mentor?.id) return;

    const channel = supabase
      .channel("mentor_sessions_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mentor_sessions" },
        async (payload) => {
          const newSession = payload.new as MentorSession;

          if (
            newSession.mentor_id === mentor.id &&
            newSession.status === "pending"
          ) {
            // Fetch user details for this student
            const { data: user, error: userError } = await supabase
              .from("users")
              .select("id, userName, userEmail, avatar")
              .eq("id", newSession.student_id)
              .single();

            if (userError) {
              console.error(
                "Error fetching user details for new session:",
                userError
              );
            }

            setPendingSessions((prev) => [
              {
                ...newSession,
                userName: user?.userName || "Unknown User",
                userEmail: user?.userEmail || "No Email",
                avatar: user?.avatar || "/user.png",
              },
              ...prev,
            ]);

            toast.success("New session request received!");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mentor?.id]);

  // -------------------------------------------------------
  // --------------------------ACCEPT / REJECT SESSION REQUEST-----------------------
  // ---------------------------------------------------------
  const handleAccept = async (sessionId: string) => {
    const { error } = await supabase
      .from("mentor_sessions")
      .update({ status: "accepted" })
      .eq("id", sessionId);

    if (error) {
      console.error("Error accepting session:", error);
      toast.error("Failed to accept session");
    } else {
      toast.success("Session accepted!");
      setPendingSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
    }
  };

  const handleReject = async (sessionId: string) => {
    const { error } = await supabase
      .from("mentor_sessions")
      .update({ status: "rejected" })
      .eq("id", sessionId);

    if (error) {
      console.error("Error rejecting session:", error);
      toast.error("Failed to reject session");
    } else {
      toast.info("Session rejected!");
      setPendingSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
    }
  };

  return (
    <Tabs
      defaultValue="pending"
      className="w-full max-w-[1080px] mx-auto mt-10 bg-gray-100 p-4 rounded-lg"
    >
      <TabsList className="grid w-full grid-cols-3 font-inter text-lg font-semibold">
        <TabsTrigger value="pending">Pending Request</TabsTrigger>
        <TabsTrigger value="accepted-rejected">Confirmed Request</TabsTrigger>
        <TabsTrigger value="completed">Ongoing Session</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="p-4 bg-white">
        {pendingSessions.length > 0 ? (
          <div className="space-y-3">
            {/* Header Row */}
            <div className="grid grid-cols-5 items-center font-inter font-semibold text-sm text-gray-800 border-b pb-3 mb-3 px-3">
              <p>User Details</p>
              <p className="text-center">Requested On</p>
              <p className="text-center">Scheduled On</p>
              <p className="text-center">Session Type</p>
              <p className="text-center">Action</p>
            </div>
            {pendingSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 rounded-md grid grid-cols-5 items-center p-3 gap-4"
              >
                <div className="flex gap-4 items-center">
                  <Image
                    src={session.avatar || "/user.png"}
                    alt="avatar"
                    height={100}
                    width={100}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex flex-col font-inter text-sm tracking-tight ">
                    <p className="font-semibold capitalize">
                      {session.userName}
                    </p>
                    <p className="text-xs text-slate-500">{session.userEmail}</p>
                  </div>
                </div>

                <p className="text-sm font-inter tracking-tight text-center">
                  {session.scheduled_at
                    ? new Date(session.requested_at).toLocaleDateString()
                    : "Date of requested"}
                </p>

                <p className="text-sm font-inter tracking-tight text-center">
                  {session.scheduled_at
                    ? new Date(session.scheduled_at).toLocaleString()
                    : "Not Scheduled"}
                </p>

                <div className="flex flex-col items-center justify-center gap-1">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-inter text-[11px] font-medium text-center">{session.session_type}</Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="font-inter tracking-tight cursor-pointer text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors mt-1">
                          View Note <LuEye className="inline w-3 h-3" />
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        {session.notes || "No note available"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* ACTIONS- ACCEPT/REJECT */}
                <div className="flex gap-3 justify-center">
                  <div
                    className="bg-emerald-500 hover:bg-emerald-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                    onClick={() => handleAccept(session?.id)}
                  >
                    <Check className="cursor-pointer text-white w-4 h-4" />
                  </div>
                  <div
                    className="bg-red-500 hover:bg-red-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                    onClick={() => handleReject(session?.id)}
                  >
                    <X className="cursor-pointer text-white w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // VISUALLY PLEASING MOCK FALLBACK (If Database is perfectly empty)
          <div className="space-y-4">
            <div className="grid grid-cols-5 items-center font-inter font-semibold text-sm text-gray-800 border-b pb-3 px-3">
              <p>User Details</p>
              <p className="text-center">Requested On</p>
              <p className="text-center">Scheduled On</p>
              <p className="text-center">Session Type</p>
              <p className="text-center">Action</p>
            </div>
            
            {isMockSessionVisible ? (
              <div className="border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-md grid grid-cols-5 items-center p-3 shadow-sm gap-4">
                  <div className="flex gap-4 items-center">
                    <Image src="/user.png" alt="avatar" height={100} width={100} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                    <div className="flex flex-col font-inter text-sm tracking-tight justify-center">
                      <p className="font-semibold text-slate-800">Samantha Lee</p>
                      <p className="text-xs text-slate-500">sam.lee@student.edu</p>
                    </div>
                  </div>
                  <p className="text-sm font-inter tracking-tight text-center text-slate-600">Today</p>
                  <p className="text-sm font-inter tracking-tight text-center text-slate-600">Tomorrow, 10:00 AM</p>
                  
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-inter text-[11px] font-medium text-center">1:1 Mentorship</Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="font-inter tracking-tight cursor-pointer text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors mt-1">
                            View Note <LuEye className="inline w-3 h-3" />
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>Looking for interview prep!</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <div className="bg-emerald-500 hover:bg-emerald-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-sm" onClick={() => { setIsMockSessionVisible(false); setIsSamanthaAccepted(true); toast.success("Mock Session Accepted!"); }}>
                      <Check className="cursor-pointer text-white w-4 h-4" />
                    </div>
                    <div className="bg-red-500 hover:bg-red-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-sm" onClick={() => { setIsMockSessionVisible(false); toast.info("Mock Session Rejected."); }}>
                      <X className="cursor-pointer text-white w-4 h-4" />
                    </div>
                  </div>
              </div>
            ) : (
              <div className="py-12">
                <p className="text-center font-inter text-slate-500">
                  No pending session requests yet.
                </p>
              </div>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="accepted-rejected" className="p-4 bg-white">
        <ConfirmTab isSamanthaAccepted={isSamanthaAccepted} />
      </TabsContent>

      <TabsContent value="completed" className="p-4 bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2 px-2">
             <h3 className="font-sora font-semibold text-slate-800 text-lg">Historic Sessions</h3>
             <Badge variant="outline" className="font-inter text-slate-500">2 Total</Badge>
          </div>
          <div className="grid grid-cols-4 font-inter font-semibold text-sm text-slate-600 border-b pb-2 px-3">
            <p className="col-span-2">Mentee Profile</p>
            <p>Completed Date</p>
            <p className="text-right">Session Type</p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 grid grid-cols-4 items-center gap-4 bg-slate-50">
            <div className="flex items-center gap-4 col-span-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold font-sora">MK</div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-slate-900 font-inter">Michael Kline</p>
                <p className="text-xs text-slate-500 font-inter">michael@reskill.com</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 font-inter">March 14, 2026</p>
            <div className="flex items-center justify-end gap-3">
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none font-inter text-[10px]">System Design</Badge>
              <Badge className="bg-slate-200 text-slate-700 border-none font-inter text-[10px]"><Check className="w-3 h-3 mr-1" /> Done</Badge>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 grid grid-cols-4 items-center gap-4 bg-slate-50">
            <div className="flex items-center gap-4 col-span-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold font-sora">AS</div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-slate-900 font-inter">Amelia Smith</p>
                <p className="text-xs text-slate-500 font-inter">amelia.s@university.edu</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 font-inter">March 11, 2026</p>
            <div className="flex items-center justify-end gap-3">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-inter text-[10px]">1:1 Mentorship</Badge>
              <Badge className="bg-slate-200 text-slate-700 border-none font-inter text-[10px]"><Check className="w-3 h-3 mr-1" /> Done</Badge>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
