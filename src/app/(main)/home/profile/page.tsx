"use client";

import { useUserData } from "@/context/UserDataProvider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  LuCamera,
  LuCreditCard,
  LuMail,
  LuSparkles,
  LuUser,
} from "react-icons/lu";
import { toast } from "sonner";
import { useState, useRef } from "react";

const ProfilePage = () => {
  const { user, setUser } = useUserData();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setUser) {
      const objectUrl = URL.createObjectURL(file);
      setUser((prev) => (prev ? { ...prev, avatar: objectUrl } : null));
      toast.success("Avatar updated (Sandbox Memory Mode)");
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 w-full">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-3xl font-sora font-bold tracking-tight text-gray-900">
            Account Settings
          </h1>
          <p className="text-muted-foreground font-inter">
            Manage your profile details, credits, and subscription status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Stats */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-none shadow-md overflow-hidden relative">
              <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 w-full" />
              <CardContent className="pt-0 relative flex flex-col items-center">
                <div 
                  className="relative -mt-12 group cursor-pointer inline-block"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                  />
                  <Image
                    src={user?.avatar || "/user.png"}
                    alt="User Avatar"
                    width={100}
                    height={100}
                    className="rounded-full w-24 h-24 border-4 border-white shadow-lg object-cover bg-white"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <LuCamera className="text-white w-6 h-6" />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <h2 className="font-semibold text-xl font-inter capitalize">
                    {user?.userName || "Anonymous User"}
                  </h2>
                  <p className="text-sm text-gray-500 font-inter mt-1 truncate max-w-[200px] mx-auto">
                    {user?.userEmail || "No email linked"}
                  </p>
                </div>

                <div className="w-full mt-6 space-y-4">
                  {/* Credits */}
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <LuSparkles className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-inter text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          Credits
                        </p>
                        <p className="font-sora font-semibold text-lg text-gray-900 leading-tight">
                          {user?.remainingCredits || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <LuCreditCard className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-inter text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          Current Plan
                        </p>
                        <p className="font-sora font-semibold text-lg text-gray-900 leading-tight capitalize">
                          {user?.isPro ? "Pro Member" : "Free Plan"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-gray-200/60 shadow-sm p-1">
              <CardContent className="p-6">
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg font-inter flex items-center gap-2">
                      <LuUser className="w-5 h-5 text-gray-500" />
                      Personal Information
                    </h3>
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="font-inter font-medium text-gray-700"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          defaultValue={user?.userName || ""}
                          placeholder="John Doe"
                          className="font-inter"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="font-inter font-medium text-gray-700"
                        >
                          Email Address
                        </Label>
                        <div className="relative">
                          <LuMail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            defaultValue={user?.userEmail || ""}
                            disabled
                            className="font-inter pl-9 bg-gray-50/50 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground font-inter mt-1">
                          Email cannot be changed directly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <h3 className="font-semibold text-lg font-inter">
                      Preferences
                    </h3>
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="role"
                          className="font-inter font-medium text-gray-700"
                        >
                          Current Role
                        </Label>
                        <Input
                          id="role"
                          placeholder="e.g. Software Engineer"
                          className="font-inter"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="company"
                          className="font-inter font-medium text-gray-700"
                        >
                          Company / School
                        </Label>
                        <Input
                          id="company"
                          placeholder="e.g. Google"
                          className="font-inter"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="font-inter px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all text-white shadow-md"
                    >
                      {loading ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
