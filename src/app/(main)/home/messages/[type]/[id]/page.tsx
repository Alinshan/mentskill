"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUserData } from "@/context/UserDataProvider"; // contains mentor
import Image from "next/image";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  receiver_type: "peer" | "mentor";
  content: string;
  created_at: string;
};

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
};

const StudentMessagesId = () => {
  const params = useParams();
  const supabase = createClient();
  const { user } = useUserData(); // ✅ logged in student
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const profileId = params.id as string;
  const profileType = params.type as "mentor" | "peer";

  // 🔹 Fetch peer profile (users table only)
  useEffect(() => {
    if (!profileId) return;

    // ----------- HARDCODED MOCK INTERCEPTOR -----------
    if (typeof profileId === "string" && profileId.startsWith("mock-")) {
      const isMentor = profileType === "mentor";
      const mockNames: Record<string, string> = {
        "mock-1": "Alex Johnson",
        "mock-2": "Samantha Lee",
        "mock-3": "David Chen",
        "mock-4": "Sarah Collins",
        "mock-5": "Michael Vance",
      };
      
      setProfile({
        id: profileId,
        name: mockNames[profileId] || (isMentor ? "Sandbox Mentor" : "Mock Student"),
        email: isMentor ? "mentor@reskill.io" : "student@university.edu",
        avatar: "/user.png",
      });
      setLoading(false);
      return;
    }
    // ----------- END MOCK INTERCEPTER -----------------

    const fetchProfile = async () => {
      setLoading(true);
      const table = profileType === "mentor" ? "mentors" : "users";
      const selectStr = profileType === "mentor" ? "id, full_name, email, avatar" : "id, userName, userEmail, avatar";

      const { data, error } = await supabase
        .from(table)
        .select(selectStr)
        .eq("id", profileId)
        .single();

      if (error) {
        console.warn(`[MOCK INTERCEPTOR] Error fetching ${profileType} profile:`, error.message);
        setProfile(null);
      } else {
        const d = data as any;
        setProfile({
          id: d.id.toString(),
          name: profileType === "mentor" ? d.full_name : d.userName,
          email: profileType === "mentor" ? d.email : d.userEmail,
          avatar: d.avatar,
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [profileId]);

  // 🔹 Fetch messages
  useEffect(() => {
    if (!profileId || !user?.id) return;

    // ----------- HARDCODED MOCK INTERCEPTOR -----------
    if (typeof profileId === "string" && profileId.startsWith("mock-")) {
      const mockNames: Record<string, string> = {
        "mock-1": "Alex Johnson",
        "mock-2": "Samantha Lee",
        "mock-3": "David Chen",
      };
      
      setMessages([
        {
          id: "msg-1",
          sender_id: profileId,
          receiver_id: user.id.toString(),
          receiver_type: profileType,
          content: profileType === "mentor" ? `Hello! I am ${mockNames[profileId] || "your Sandbox Mentor"}. How can I assist you with your career goals today?` : "Hey! I'm solving LeetCode problems, want to join?",
          created_at: new Date().toISOString(),
        }
      ]);
      return;
    }
    // ----------- END MOCK INTERCEPTER -----------------

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),` +
            `and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (error) console.error("Fetch error:", error);
      else setMessages(data || []);
    };

    fetchMessages();

    // 🔹 Realtime subscription
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;

          if (
              (newMessage.sender_id === user.id.toString() && newMessage.receiver_id === profileId) ||
              (newMessage.sender_id === profileId && newMessage.receiver_id === user.id.toString())
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profileId, user?.id, profileType]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text.trim() || !user?.id || !profileId) return;

    if (profileId.startsWith("mock-")) {
       setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          sender_id: user.id.toString(),
          receiver_id: profileId,
          receiver_type: profileType,
          content: text,
          created_at: new Date().toISOString()
       }]);
       setText("");
       return;
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: profileId,
      receiver_type: profileType, 
      content: text,
    });

    if (error) {
      console.error("Send error:", error);
    } else {
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden border">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Profile Header */}
          {profile && (
            <div className="flex items-center gap-3 p-3 border-b bg-blue-500 text-white">
              <Image
                src={profile.avatar || "/user.png"}
                alt={profile.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h2 className="font-medium">{profile.name}</h2>
                <p className="text-sm text-blue-100 capitalize">{profileType}</p>
              </div>
            </div>
          )}
          <p className="text-muted-foreground text-base font-inter px-6 my-2">
            Keep the conversation formal and professional. Any inappropriate
            messages will be Reported.
          </p>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-blue-100 ">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`mb-2 ${
                  m.sender_id === user?.id?.toString() ? "text-right" : "text-left"
                }`}
              >
                <span className={`inline-block px-3 py-2 rounded-lg ${m.sender_id === user?.id?.toString() ? "bg-blue-600 text-white" : "bg-white text-black"}`}>
                  {m.content}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex p-3 border-t">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentMessagesId;
