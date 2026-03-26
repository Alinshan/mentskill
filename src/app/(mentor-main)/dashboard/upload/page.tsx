"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LuFileBox, LuCloudUpload, LuVideo, LuFileText, LuLink, LuCircleCheck } from "react-icons/lu";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function MentorUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setLoading(true);
    // Mock upload delay
    setTimeout(() => {
      setLoading(false);
      setFile(null);
      toast.success("Resource uploaded successfully!", {
        description: "Your mentees can now access this material in their tracks."
      });
      // reset form here if needed
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 w-full">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-sora font-semibold tracking-tight text-slate-900">
            Upload Resources
          </h1>
          <p className="text-muted-foreground font-inter mt-1">
            Share learning materials, video recordings, and external links with your mentees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Upload Area */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-white/50 border-b pb-4">
                <CardTitle className="font-inter text-xl text-slate-800">New Material</CardTitle>
                <CardDescription className="font-inter">Upload files up to 50MB directly to your workspace.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleUpload} className="space-y-6">
                  
                  {/* File Dropzone */}
                  <div 
                    className={`relative w-full h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all duration-200 ${
                      dragActive ? 'border-blue-500 bg-blue-50/50' : file ? 'border-green-400 bg-green-50/30' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleChange}
                    />
                    
                    {file ? (
                      <div className="flex flex-col items-center text-center space-y-2 pointer-events-none">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                          <LuCircleCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="font-sora font-semibold text-slate-800 text-lg">{file.name}</p>
                        <p className="font-inter text-slate-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center space-y-2 pointer-events-none">
                        <div className="h-16 w-16 bg-blue-100/50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                          <LuCloudUpload className="w-8 h-8" />
                        </div>
                        <p className="font-sora font-medium text-slate-700 text-lg">
                          Drag and drop your file here
                        </p>
                        <p className="font-inter text-slate-500 text-sm">
                          or click to browse from your computer
                        </p>
                        <div className="flex gap-4 mt-6 text-slate-400">
                          <LuFileText className="w-5 h-5" />
                          <LuVideo className="w-5 h-5" />
                          <LuFileBox className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Metadata fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-inter font-medium text-slate-700">Resource Title</Label>
                      <Input id="title" placeholder="e.g. System Design Interview Patterns" required className="font-inter" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="desc" className="font-inter font-medium text-slate-700">Description / Notes</Label>
                      <Textarea 
                        id="desc" 
                        placeholder="Briefly describe what this material covers..." 
                        rows={3} 
                        className="font-inter resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button 
                      disabled={loading || !file} 
                      type="submit" 
                      className="font-inter px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                      {loading ? "Uploading..." : "Publish Resource"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Stats */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
              <CardHeader>
                <CardTitle className="font-inter text-lg flex items-center gap-2">
                  <LuLink className="w-5 h-5 text-indigo-500" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => window.location.href = "/dashboard/video-call-Home"}
                  variant="outline" 
                  className="w-full justify-start font-inter bg-white hover:bg-slate-50 cursor-pointer"
                >
                  <LuVideo className="mr-2 w-4 h-4 text-slate-500" /> Host Live Session
                </Button>
                <Button 
                  onClick={() => toast.info("File Manager", { description: "The File Management viewer is currently under construction." })}
                  variant="outline" 
                  className="w-full justify-start font-inter bg-white hover:bg-slate-50 cursor-pointer"
                >
                  <LuFileBox className="mr-2 w-4 h-4 text-slate-500" /> Manage Existing Files
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-inter text-sm text-slate-500 uppercase tracking-wider">Storage Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-2">
                  <span className="font-sora text-3xl font-bold text-slate-800">1.2 GB</span>
                  <span className="font-inter text-sm text-slate-500 mb-1">/ 5.0 GB</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '24%' }} />
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
