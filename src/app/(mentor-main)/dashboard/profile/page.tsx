"use client";

import { useState } from "react";
import Image from "next/image";
import { useUserData } from "@/context/UserDataProvider";
import { Button } from "@/components/ui/button";
import { Camera, Mail, MapPin, Briefcase, DollarSign, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MentorProfilePage() {
  const { mentor } = useUserData();
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(mentor?.avatar || null);
  const [coverUrl, setCoverUrl] = useState<string | null>("/element7.png"); // Mock Default Cover

  const [formData, setFormData] = useState({
    fullName: mentor?.full_name || "Samantha Lee",
    headline: "Senior React Developer @ Vercel",
    location: "San Francisco, CA",
    hourlyRate: "120",
    bio: "I've been building scalable frontend architectures for over 8 years. I specialize in Next.js, Server Components, and advanced State Management. Let's get your next project off the ground!",
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      
      const file = e.target.files[0];
      
      // [MOCK INTERCEPTOR] Generate local Object URL instead of crashing on missing Supabase Buckets
      const localPreviewUrl = URL.createObjectURL(file);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAvatarUrl(localPreviewUrl);
      toast.success("Profile photo updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate network delay for Mock Save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Profile details saved successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-sora text-gray-900 tracking-tight">Mentor Profile</h1>
        <p className="text-gray-500 font-inter mt-1 tracking-tight">Manage your public persona, display rates, and portfolio details.</p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col relative">
        {/* Cover Photo Area */}
        <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-blue-100 to-indigo-200 group">
          {coverUrl && (
            <Image
              src={coverUrl}
              alt="Cover"
              layout="fill"
              objectFit="cover"
              className="opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
             <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-inter text-sm font-semibold flex items-center gap-2 text-gray-800 shadow-lg">
                <Camera className="w-4 h-4" /> Change Cover
             </div>
          </div>
        </div>

        {/* Profile Content Area */}
        <div className="px-6 md:px-10 pb-10">
          {/* Avatar Area (Overlaps Cover) */}
          <div className="relative -mt-16 sm:-mt-20 mb-6 flex justify-between items-end">
            <div className="relative group rounded-full p-1 bg-white inline-block shadow-lg">
              <Image
                src={avatarUrl || "/user.png"}
                alt="Avatar"
                width={140}
                height={140}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white"
              />
              <label className="absolute bottom-2 right-2 bg-indigo-600 p-2.5 rounded-full text-white cursor-pointer shadow-md hover:bg-indigo-700 hover:scale-105 transition-all z-10">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            
            <Button 
                onClick={handleSaveProfile} 
                className="mb-4 bg-indigo-600 hover:bg-indigo-700 shadow-md font-inter rounded-xl"
                disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-inter">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-inter text-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-inter">Professional Headline</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.headline}
                      onChange={(e) => setFormData({...formData, headline: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-inter text-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 font-inter">About Me (Bio)</label>
                <textarea 
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-inter text-gray-800 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-inter">Location / Timezone</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-inter text-gray-800"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-inter">Hourly Rate (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      type="number" 
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-inter text-gray-800"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Read-only Identity Card Preview */}
            <div className="space-y-6">
               <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-sora font-semibold text-gray-800 mb-4 tracking-tight">Account Integrations</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-white p-2 border border-gray-200 rounded-lg shrink-0">
                        <Mail className="w-5 h-5 text-gray-600" />
                     </div>
                     <div className="overflow-hidden">
                        <p className="font-semibold text-sm font-inter text-gray-800">Email Address</p>
                        <p className="text-sm font-inter text-gray-500 truncate">{mentor?.email || "mentor@example.com"}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="bg-white p-2 border border-blue-200 rounded-lg shrink-0 text-[#0E72ED]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                     </div>
                     <div className="overflow-hidden">
                        <p className="font-semibold text-sm font-inter text-gray-800">Google Calendar</p>
                        <p className="text-sm font-inter text-green-600 truncate">Synced & Active</p>
                     </div>
                  </div>
               </div>

               <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                     <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="font-sora font-semibold text-indigo-900 mb-2">Mentor Quick Link</h3>
                  <p className="text-sm text-indigo-800/70 py-1 mb-4 select-all">reskill.io/mentor/{mentor?.full_name?.replace(/\s+/g, '').toLowerCase() || 'samantha'}</p>
                  <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-100 font-semibold rounded-xl">Copy Share Link</Button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
