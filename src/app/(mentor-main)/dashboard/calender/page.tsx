"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LuCalendarDays, 
  LuCalendarRange, 
  LuChevronLeft, 
  LuChevronRight, 
  LuClock, 
  LuPlus, 
  LuUsers 
} from "react-icons/lu";
import { toast } from "sonner";

// Define a type for dynamic events
type AvailabilitySlot = {
  id: string;
  title: string;
  type: string;
  time: string;
};

export default function MentorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlots, setActiveSlots] = useState<AvailabilitySlot[]>([]);
  
  // Google Sync State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleSyncing, setIsGoogleSyncing] = useState(false);
  const [isGoogleSynced, setIsGoogleSynced] = useState(false);

  // Form State
  const [slotTitle, setSlotTitle] = useState("");
  const [slotType, setSlotType] = useState("1:1 Mentorship");
  const [slotTime, setSlotTime] = useState("");

  const days = Array.from({ length: 35 }, (_, i) => i + 1);

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle || !slotTime) {
      toast.error("Please fill out all required fields!");
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: Math.random().toString(36).substr(2, 9),
      title: slotTitle,
      type: slotType,
      time: slotTime,
    };

    setActiveSlots([newSlot, ...activeSlots]);
    setIsOpen(false);
    toast.success("Availability Slot successfully published to your Calendar!");
    
    // Reset Form
    setSlotTitle("");
    setSlotType("1:1 Mentorship");
    setSlotTime("");
  };

  const handleSimulateGoogleSync = () => {
    setIsGoogleSyncing(true);
    // Simulate API Network Delay
    setTimeout(() => {
      setIsGoogleSyncing(false);
      setIsGoogleSynced(true);
      toast.success("Google Calendar successfully authorized and synchronized!");
      
      // Auto-close modal after success message
      setTimeout(() => {
        setIsGoogleModalOpen(false);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 w-full">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-sora font-semibold tracking-tight text-slate-900 flex items-center gap-3">
              <LuCalendarRange className="text-blue-600" />
              Schedule & Bookings
            </h1>
            <p className="text-muted-foreground font-inter mt-1">
              Manage your upcoming 1-on-1 sessions and mentor availability slots.
            </p>
          </div>
          <div className="flex gap-3">
            
            {/* Functional Google Sync Modal */}
            <Dialog open={isGoogleModalOpen} onOpenChange={setIsGoogleModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant={isGoogleSynced ? "default" : "outline"}
                  className={`font-inter ${isGoogleSynced ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent" : "bg-white"}`}
                >
                  {isGoogleSynced ? "Calendar Synced" : "Sync Google Calendar"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                {!isGoogleSynced ? (
                  <>
                    <DialogHeader>
                      <DialogTitle className="font-sora text-center text-xl">Connect Google Calendar</DialogTitle>
                      <DialogDescription className="font-inter text-center">
                        Grant Reskill 2.0 access to your calendar to automatically manage bookings and prevent overlapping timeslots.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-8 space-y-6">
                      <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shadow-inner">
                        <LuCalendarDays className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="w-full space-y-3 px-4">
                        <div className="flex items-center gap-3 text-sm text-slate-600 font-inter">
                          <LuClock className="w-4 h-4 text-slate-400" /> Real-time availability sync
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 font-inter">
                          <LuUsers className="w-4 h-4 text-slate-400" /> Automated Mentee invites
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-center">
                      <Button 
                        disabled={isGoogleSyncing}
                        onClick={handleSimulateGoogleSync}
                        className="w-full font-inter bg-[#4285F4] hover:bg-[#3367D6] text-white flex items-center gap-2"
                      >
                        {isGoogleSyncing ? "Authorizing Connection..." : "Sign in with Google"}
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                      <LuUsers className="w-10 h-10 text-emerald-600" />
                    </div>
                    <DialogTitle className="font-sora text-2xl font-semibold text-slate-900 border-none">Account Synced!</DialogTitle>
                    <p className="font-inter text-center text-slate-500 max-w-xs">
                      Your calendar is actively monitoring your primary timezone for booking collisions.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsGoogleSynced(false);
                        setIsGoogleModalOpen(false);
                      }}
                      className="mt-4 font-inter text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Disconnect Account
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Functional Dialog Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="font-inter bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  <LuPlus className="mr-2 w-4 h-4" /> New Availability Slot
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateSlot}>
                  <DialogHeader>
                    <DialogTitle className="font-sora">Create Availability Slot</DialogTitle>
                    <DialogDescription className="font-inter">
                      Define a new open time block for Mentees to book you.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right font-inter text-sm">Session Title</Label>
                      <Input
                        id="title"
                        value={slotTitle}
                        onChange={(e) => setSlotTitle(e.target.value)}
                        placeholder="e.g. Portfolio Review"
                        className="col-span-3 font-inter"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right font-inter text-sm">Type</Label>
                      <select 
                        id="type"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-inter"
                        value={slotType}
                        onChange={(e) => setSlotType(e.target.value)}
                      >
                        <option value="1:1 Mentorship">1:1 Mentorship</option>
                        <option value="Group Session">Group Session</option>
                        <option value="Mock Interview">Mock Interview</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right font-inter text-sm">Time Slot</Label>
                      <Input
                        id="time"
                        type="text"
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        placeholder="e.g. Tomorrow, 4:00 PM"
                        className="col-span-3 font-inter"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="font-inter bg-blue-600 hover:bg-blue-700">Publish Slot</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Calendar Grid */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b bg-white/50 px-6 py-4 flex flex-row items-center justify-between">
                <CardTitle className="font-sora text-xl text-slate-800">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  >
                    <LuChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-8 px-4 font-inter text-xs"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  >
                    <LuChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b bg-slate-50/80">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 uppercase tracking-wider font-inter">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Mock Grid */}
                <div className="grid grid-cols-7 h-[600px] bg-slate-100 gap-[1px] border-b border-x">
                  {days.map((day) => {
                    const mappedDay = day <= 31 ? day : day - 31;
                    
                    // Only show static mockup events if we are still organically examining the current month
                    const isLookingAtCurrentMonth = currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                    const isToday = isLookingAtCurrentMonth && day === 15; // static mock
                    const hasEvent = isLookingAtCurrentMonth && (day === 12 || day === 18 || day === 24);
                    const hasDynamicEvent = isLookingAtCurrentMonth && day === 15 && activeSlots.length > 0;
                    
                    return (
                      <div 
                        key={day} 
                        onClick={() => {
                          const monthName = currentDate.toLocaleString('default', { month: 'long' });
                          const yearName = currentDate.getFullYear();
                          setSlotTime(`${monthName} ${mappedDay}, ${yearName} - 10:00 AM`);
                          setIsOpen(true);
                        }}
                        className={`bg-white p-2 flex flex-col hover:bg-slate-50 transition-colors cursor-pointer group relative ${isToday ? 'ring-2 ring-inset ring-blue-500' : ''}`}
                      >
                        <span className={`text-sm font-inter font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700 group-hover:bg-slate-100'}`}>
                          {mappedDay}
                        </span>
                        
                        {hasDynamicEvent && (
                          <div className="mt-2 w-full">
                            <div className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-700 px-2 py-1 flex items-center gap-1 rounded font-inter truncate border border-emerald-200">
                              <LuUsers className="w-3 h-3 shrink-0" />
                              {activeSlots.length} New Opening{activeSlots.length > 1 ? 's' : ''}
                            </div>
                          </div>
                        )}

                        {hasEvent && (
                          <div className="mt-1 w-full">
                            <div className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2 py-1 flex items-center gap-1 rounded font-inter truncate border border-blue-200">
                              <LuUsers className="w-3 h-3 shrink-0" />
                              Mentorship
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Upcoming Events */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-sm h-full">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="font-inter text-lg flex items-center gap-2">
                  <LuCalendarDays className="w-5 h-5 text-indigo-500" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  
                  {/* Dynamically Created SLOTS */}
                  {activeSlots.map((slot) => (
                    <div key={slot.id} className="p-4 bg-emerald-50/50 hover:bg-emerald-50 transition-colors cursor-pointer border-l-4 border-l-emerald-500">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold font-sora text-emerald-800 text-sm">{slot.title}</h4>
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-inter text-[10px] border-none">{slot.type}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-emerald-600 font-inter flex items-center gap-2">
                          <LuClock className="w-3.5 h-3.5" /> {slot.time}
                        </p>
                        <p className="text-xs text-emerald-600 font-inter flex items-center gap-2">
                          <LuUsers className="w-3.5 h-3.5" /> Open for Booking
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Static Event 1 */}
                  <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold font-sora text-slate-800 text-sm">Resume Review</h4>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-inter text-[10px] border-none">1:1 Call</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-inter flex items-center gap-2">
                        <LuClock className="w-3.5 h-3.5" /> Today, 2:00 PM - 3:00 PM
                      </p>
                      <p className="text-xs text-slate-500 font-inter flex items-center gap-2">
                        <LuUsers className="w-3.5 h-3.5" /> Alex Johnson
                      </p>
                    </div>
                  </div>

                  {/* Static Event 2 */}
                  <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-indigo-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold font-sora text-slate-800 text-sm">System Architect</h4>
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-inter text-[10px] border-none">Group</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-inter flex items-center gap-2">
                        <LuClock className="w-3.5 h-3.5" /> Tomorrow, 10:00 AM
                      </p>
                      <p className="text-xs text-slate-500 font-inter flex items-center gap-2">
                        <LuUsers className="w-3.5 h-3.5" /> 4 Mentees enrolled
                      </p>
                    </div>
                  </div>

                  {/* Empty state padding */}
                  <div className="p-6 text-center">
                    <p className="text-sm font-inter text-slate-400">
                      No more sessions scheduled for this week.
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
