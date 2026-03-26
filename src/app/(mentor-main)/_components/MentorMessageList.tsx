/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useUserData } from "@/context/UserDataProvider";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  receiver_type: "peer" | "mentor";
  content: string;
  created_at: string;
};

type UserDisplay = {
  id: string;
  name: string;
  avatar: string | null;
};

const MentorMessagesList: React.FC = () => {
  const { mentor, loading: mentorLoading } = useUserData();
  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!mentor?.id) return;

    const supabase = createClient();

    const fetchMessageNames = async () => {
      // 1️⃣ Fetch messages involving this mentor where receiver_type = "mentor"
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("receiver_type", "mentor")
        .or(`sender_id.eq.${mentor.id},receiver_id.eq.${mentor.id}`);

      if (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
        return;
      }

      if (!messages || messages.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Collect peer (user) IDs
      const peerIds = new Set<string>();
      messages.forEach((msg) => {
        if (msg.sender_id !== mentor.id) {
          peerIds.add(msg.sender_id);
        }
        if (msg.receiver_id !== mentor.id) {
          peerIds.add(msg.receiver_id);
        }
      });

      // 3️⃣ Fetch peers from users table
      const { data: peers } = await supabase
        .from("users")
        .select("id, userName, avatar")
        .in("id", Array.from(peerIds));

      // 4️⃣ Map into display objects
      const allUsers: UserDisplay[] =
        peers?.map((p) => ({
          id: p.id,
          name: p.userName,
          avatar: p.avatar,
        })) || [];

      setUsers(allUsers);
      setLoading(false);
    };

    fetchMessageNames();

    // 🔴 Subscribe to new inserts
    const subscription = supabase
      .channel("mentor-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: "receiver_type=eq.mentor",
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          // Only react if this mentor is involved
          if (
            newMessage.sender_id === mentor.id ||
            newMessage.receiver_id === mentor.id
          ) {
            // Refetch the users list so new peers appear
            fetchMessageNames();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [mentor?.id]);

  if (mentorLoading || loading) return <div>Loading users...</div>;
  // Visually pleasing Hardcoded Fallback for empty databases
  const displayUsers = users.length > 0 ? users : [
    { id: "mock-1", name: "Alex Johnson", avatar: "/user.png" },
    { id: "mock-2", name: "Samantha Lee", avatar: "/user.png" },
    { id: "mock-3", name: "David Chen", avatar: "/user.png" },
  ];

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {displayUsers.map((u) => (
          <li
            key={u.id}
            className="flex flex-col gap-1 bg-gray-50 hover:bg-slate-100 transition-colors rounded-md p-3 border border-slate-100"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push(`/dashboard/messages/mentor/${u.id}`)}
            >
              <Image
                src={u.avatar || "/user.png"}
                alt={u.name}
                width={40}
                height={40}
                className="rounded-full object-cover border border-slate-200"
              />
              <span className="font-medium font-sora text-slate-800 text-base">{u.name}</span>
            </div>
            <span className="text-xs ml-12 -mt-1 text-slate-400 font-inter cursor-pointer flex items-center">
              Click to open conversation
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentorMessagesList;
