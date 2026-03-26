"use client";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataProvider";
import { useSessionStore } from "@/lib/store/useSessionStore";
import { createClient } from "@/lib/supabase/client";
import { MentorSession } from "@/lib/types/allTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuActivity } from "react-icons/lu";
import { toast } from "sonner";

const ConfirmTab = ({ isSamanthaAccepted }: { isSamanthaAccepted?: boolean }) => {
  const supabase = createClient();
  const { mentor } = useUserData();
  const router = useRouter();
  const { setActiveSession } = useSessionStore();
  const [acceptedSessions, setAcceptedSessions] = useState<
    (MentorSession & {
      userName: string;
      userEmail: string;
      avatar: string | null;
    })[]
  >([]);

  useEffect(() => {
    if (!mentor?.id) return;

    const fetchAccepted = async () => {
      const { data: sessions, error } = await supabase
        .from("mentor_sessions")
        .select("*")
        .eq("mentor_id", mentor.id)
        .in("status", ["accepted"])
        .order("requested_at", { ascending: false });

      if (error) {
        console.error("Error fetching accepted/rejected sessions:", error);
        return;
      }

      if (!sessions || sessions.length === 0) {
        setAcceptedSessions([]);
        return;
      }

      // Get unique student IDs
      const studentIds = [...new Set(sessions.map((s) => s.student_id))];

      // Fetch user info
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, userName, userEmail, avatar")
        .in("id", studentIds);

      if (userError) {
        console.error("Error fetching users for accepted/rejected:", userError);
        return;
      }

      // Merge user info
      const merged = sessions.map((session) => {
        const user = users?.find((u) => u.id === session.student_id);
        return {
          ...session,
          userName: user?.userName || "Unknown User",
          userEmail: user?.userEmail || "No Email",
          avatar: user?.avatar || "/user.png",
        };
      });

      setAcceptedSessions(merged);
    };

    fetchAccepted();
  }, [mentor?.id]);
  //   -------------------------------------------REALTIME EVENTS--------------------
  useEffect(() => {
    if (!mentor?.id) return;

    const channel = supabase
      .channel("mentor_sessions_update_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "mentor_sessions" },
        async (payload) => {
          const updated = payload.new as MentorSession;

          if (
            updated.mentor_id === mentor.id &&
            updated.status === "accepted"
          ) {
            // Fetch student details for the accepted session
            const { data: user } = await supabase
              .from("users")
              .select("id, userName, userEmail, avatar")
              .eq("id", updated.student_id)
              .single();

            setAcceptedSessions((prev) => [
              {
                ...updated,
                userName: user?.userName || "Unknown User",
                userEmail: user?.userEmail || "No Email",
                avatar: user?.avatar || "/user.png",
              },
              ...prev.filter((s) => s.id !== updated.id),
            ]);
            toast.success("Session accepted!");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mentor?.id]);
  return (
    <div className="bg-white">
      {acceptedSessions.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-4 items-center font-inter font-semibold text-sm text-gray-800 border-b pb-3 px-3">
            <p>User Details</p>
            <p className="text-center">Requested On</p>
            <p className="text-center">Scheduled On</p>
            <p className="text-center">Start Session</p>
          </div>
          {acceptedSessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-md grid grid-cols-4 items-center p-3 gap-4"
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
                  <p className="font-semibold capitalize">{session.userName}</p>
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
                  : ""}
              </p>

              <div className="flex justify-center">
                <Button
                  size="sm"
                  variant="default"
                  className="text-sm font-inter tracking-tight cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  onClick={() => {
                    setActiveSession({
                      userName: session.userName,
                      id: session.student_id,
                      session_id: session.id,
                      userEmail: session.userEmail,
                      avatar: session.avatar,
                      session_type: session.session_type,
                    });
                    router.push("/dashboard/video-call-Home");
                  }}
                >
                  Start Session <LuActivity className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // VISUALLY PLEASING MOCK FALLBACK
        <div className="space-y-4">
          <div className="grid grid-cols-4 items-center font-inter font-semibold text-sm text-gray-800 border-b pb-3 px-3">
            <p>User Details</p>
            <p className="text-center">Requested On</p>
            <p className="text-center">Scheduled On</p>
            <p className="text-center">Start Session</p>
          </div>
          
          <div className="border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-md grid grid-cols-4 items-center p-3 shadow-sm gap-4">
              <div className="flex gap-4 items-center">
                <Image src="/user.png" alt="avatar" height={100} width={100} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                <div className="flex flex-col font-inter text-sm tracking-tight justify-center">
                  <p className="font-semibold text-slate-800">Sarah Johnson</p>
                  <p className="text-xs text-slate-500">sarah.j@student.edu</p>
                </div>
              </div>
              
              <p className="text-sm font-inter tracking-tight text-center text-slate-600">March 27, 2026</p>
              
              <div className="flex flex-col items-center justify-center gap-0.5">
                 <p className="text-sm font-inter tracking-tight font-semibold text-emerald-600">Today, 1:00 PM</p>
                 <p className="text-[11px] font-inter text-slate-500">In 20 minutes</p>
              </div>

              <div className="flex justify-center">
                <Button
                  size="sm"
                  variant="default"
                  className="text-sm font-inter tracking-tight cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  onClick={() => {
                    toast.success("Initializing Mock Video Environment...");
                    setActiveSession({
                      userName: "Sarah Johnson",
                      id: "mock-student-id-99",
                      session_id: "mock-session-id-99",
                      userEmail: "sarah.j@student.edu",
                      avatar: "/user.png",
                      session_type: "Video Call",
                    });
                    router.push("/dashboard/video-call-Home");
                  }}
                >
                  Start Session <LuActivity className="ml-2 w-4 h-4" />
                </Button>
              </div>
          </div>

          {/* DYNAMICALLY ACCEPTED MOCK USER FROM PENDING TAB */}
          {isSamanthaAccepted && (
            <div className="border border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 transition-colors rounded-md grid grid-cols-4 items-center p-3 shadow-sm gap-4 animate-in fade-in zoom-in duration-300">
                <div className="flex gap-4 items-center">
                  <Image src="/user.png" alt="avatar" height={100} width={100} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                  <div className="flex flex-col font-inter text-sm tracking-tight justify-center">
                    <p className="font-semibold text-slate-800">Samantha Lee</p>
                    <p className="text-xs text-slate-500">sam.lee@student.edu</p>
                  </div>
                </div>
                
                <p className="text-sm font-inter tracking-tight text-center text-slate-600">Today</p>
                
                <div className="flex flex-col items-center justify-center gap-0.5">
                   <p className="text-sm font-inter tracking-tight font-semibold text-slate-700">Tomorrow, 10:00 AM</p>
                   <p className="text-[11px] font-inter text-slate-500">1:1 Mentorship</p>
                </div>

                <div className="flex justify-center">
                  <Button
                    size="sm"
                    variant="default"
                    className="text-sm font-inter tracking-tight cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    onClick={() => {
                      toast.success("Initializing Mock Video Environment...");
                      setActiveSession({
                        userName: "Samantha Lee",
                        id: "mock-student-id-100",
                        session_id: "mock-session-id-100",
                        userEmail: "sam.lee@student.edu",
                        avatar: "/user.png",
                        session_type: "1:1 Mentorship",
                      });
                      router.push("/dashboard/video-call-Home");
                    }}
                  >
                    Start Session <LuActivity className="ml-2 w-4 h-4" />
                  </Button>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfirmTab;
