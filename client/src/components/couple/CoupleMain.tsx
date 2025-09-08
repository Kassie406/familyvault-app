import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { IdeasList } from '@/components/couple/IdeasList';
import { 
  Heart, 
  Calendar, 
  BookOpen, 
  MessageSquare,
  Lightbulb,
  Clock,
  Star,
  Plus,
  ArrowLeft
} from 'lucide-react';

interface CoupleMainProps {
  onClose: () => void;
}

export function CoupleMain({ onClose }: CoupleMainProps) {
  const [activeTab, setActiveTab] = useState('ideas');

  // Mock data for demonstration
  const upcomingDate = {
    title: 'Italian place near home',
    date: 'Fri 7:30 PM',
    timeUntil: '2 days'
  };

  const openDateSuggestions = [
    { title: 'Coffee & Walk', time: '30 min', cost: '$10' },
    { title: 'Movie Night', time: '2 hours', cost: '$25' },
    { title: 'Cooking Together', time: '1 hour', cost: '$15' }
  ];

  return (
    <div className="h-full flex flex-col bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-700">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
            data-testid="button-close-couple-main"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-white">Our Connection</h1>
          </div>
        </div>
        
        {/* Next Date Preview */}
        {upcomingDate && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-white">Next date:</span>
            <span className="text-[#D4AF37]">{upcomingDate.date}</span>
            <span className="text-neutral-400">• {upcomingDate.title}</span>
          </div>
        )}
      </div>

      {/* Open Date Banner */}
      <Card className="mx-6 mt-6 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border-[#D4AF37]/20">
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Star className="h-5 w-5 text-[#D4AF37]" />
            You saved 7–9 PM for each other. Try one of these?
          </h3>
          <div className="flex gap-3">
            {openDateSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                data-testid={`button-date-suggestion-${index}`}
              >
                {suggestion.title}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {suggestion.time} • {suggestion.cost}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-800 border border-neutral-700">
            <TabsTrigger 
              value="ideas" 
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black"
              data-testid="tab-ideas"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Ideas
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black"
              data-testid="tab-calendar"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="journal" 
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black"
              data-testid="tab-journal"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Journal
            </TabsTrigger>
            <TabsTrigger 
              value="checkin" 
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black"
              data-testid="tab-checkin"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Check-in
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 h-[calc(100%-3rem)] overflow-hidden">
            <TabsContent value="ideas" className="h-full">
              <IdeasTab />
            </TabsContent>
            
            <TabsContent value="calendar" className="h-full">
              <CalendarTab />
            </TabsContent>
            
            <TabsContent value="journal" className="h-full">
              <JournalTab />
            </TabsContent>
            
            <TabsContent value="checkin" className="h-full">
              <CheckinTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Privacy Footer */}
      <div className="px-6 py-3 border-t border-neutral-700">
        <p className="text-xs text-neutral-500 text-center">
          🔒 Only the two of you can see this
        </p>
      </div>
    </div>
  );
}

// Tab Components
function IdeasTab() {
  return <IdeasList className="h-full" />;
}

function CalendarTab() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Calendar className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Couple Calendar</h3>
        <p className="text-neutral-400 mb-4">Plan dates and see conflicts with family schedule</p>
        <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black" data-testid="button-add-event">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Date
        </Button>
      </div>
    </div>
  );
}

function JournalTab() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Private Journal</h3>
        <p className="text-neutral-400 mb-4">Capture memories and special moments together</p>
        <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black" data-testid="button-add-journal-entry">
          <Plus className="h-4 w-4 mr-2" />
          Add Memory
        </Button>
      </div>
    </div>
  );
}

function CheckinTab() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <MessageSquare className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Weekly Check-in</h3>
        <p className="text-neutral-400 mb-4">Share appreciation and set intentions together</p>
        <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black" data-testid="button-start-checkin">
          <Plus className="h-4 w-4 mr-2" />
          Start Check-in
        </Button>
      </div>
    </div>
  );
}