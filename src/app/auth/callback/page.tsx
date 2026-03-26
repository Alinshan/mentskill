 
"use client";

import { useUserData } from "@/context/UserDataProvider";
import { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { SpinningText } from "@/components/magicui/spinning-text";

import { Briefcase, Users } from "lucide-react";
import { LuFlagTriangleRight, LuGraduationCap } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";
import Image from "next/image";
import { OnboardingCard } from "../_components/OnBoardingCard";

const steps = [
  {
    // Let's get to know you better. Share a few details to personalize your experience.
    id: 1,
    title: "Welcome",
    description: "Let's get to know you better",
    icon: LuFlagTriangleRight,
  },
  {
    // tell us what best describes you right now.
    id: 2,
    title: "Current Status",
    description: " what best describes you right now.",
    icon: Briefcase,
  },
  {
    // dynamiclly show on basis of step 1 , what they want to acheieve
    id: 3,
    title: "Your Focus",
    description: "Choose your main goals",
    icon: LuGraduationCap,
  },
  {
    id: 4,
    title: "Google workspace",
    description: "Connect your Google Workspace",
    icon: FaGoogle,
  },
  {
    id: 5,
    title: "Invite Friends",
    description: "Invite your friends on this platform",
    icon: Users,
  },
];

export default function CallbackPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, ensureUserInDB, isNewUser } = useUserData();

  // Exchange OAuth PKCE Code manually here because we are in a Page component!
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
           ensureUserInDB(); // Force explicit DB verification
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      const isOnboardingIncomplete =
        typeof window !== "undefined" &&
        localStorage.getItem("isOnboardingDone") === "false";

      if (isNewUser) {
        toast(`Welcome aboard, ${user?.userEmail}!`);
      } else if (isOnboardingIncomplete || user?.is_verified === false) {
        toast("Resuming your onboarding Process");
      } else {
        toast(`Welcome back, ${user?.userName}!`);
        router.push("/home");
      }
    }
  }, [isNewUser, loading, user]);

  // localStorage.setItem("isOnboardingDone", "true");

  async function signOut() {
    try {
      await supabase.auth.signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex items-center text-2xl font-raleway font-medium tracking-wide">
          <LuLoader className="animate-spin inlinr mr-4" />
          <p>Validating user...</p>
        </div>
        <p className="mt-8 font-inter text-xl tracking-wide">
          Please wait and tighten your seatbelt
        </p>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Profile Fetch Error</h1>
        <p className="text-gray-600 max-w-md text-center">
          We successfully authenticated your Google account, but we could not find or create your user profile in the database. 
          <br/><br/>
          <strong>Developer note:</strong> Have the `users` and `mentors` tables been configured in your new Supabase dashboard? Please check your browser developer tools console for specific database errors!
        </p>
        <div className="flex gap-4 mt-8">
          <Button onClick={() => {
              toast.info("Retrying verification...");
              ensureUserInDB();
          }} className="bg-blue-600 text-white hover:bg-blue-700">
            Retry Authentication
          </Button>
          <Button variant="outline" onClick={() => router.push("/auth")}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  const onboardingStatus =
    typeof window !== "undefined"
      ? localStorage.getItem("isOnboardingDone")
      : null;

  if (onboardingStatus === "false" || isNewUser) {
    return (
      <div className="w-full h-screen relative bg-white overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)",
          }}
        />
        <div className="absolute top-2 left-5">
          <div className="flex items-center ">
            <Image
              src="/clarioWhite.png"
              alt="logo"
              width={60}
              height={60}
              className=""
            />
            <h1 className="font-raleway text-3xl font-bold text-white">
              Clario
            </h1>
          </div>
        </div>
        <div className="absolute top-14 right-16">
          <SpinningText className="text-white tracking-wide">
            learn more • earn more • grow more •
          </SpinningText>
        </div>
        <main className="relative z-50 h-full w-full flex items-center justify-center">
          <OnboardingCard />
        </main>
      </div>
    );
  }
}
