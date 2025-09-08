import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare,
  Heart,
  Calendar,
  TrendingUp,
  Star,
  RotateCcw,
  CheckCircle2,
  Clock,
  Users,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckinAnswer {
  prompt: string;
  answer: string;
}

interface CheckinEntry {
  id: string;
  checkinDate: string;
  rating: number;
  answers: CheckinAnswer[];
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface WeeklyCheckinProps {
  className?: string;
}

export function WeeklyCheckin({ className }: WeeklyCheckinProps) {
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [currentAnswers, setCurrentAnswers] = useState<string[]>(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedThisWeek, setHasSubmittedThisWeek] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Mock check-in prompts (these could rotate weekly)
  const prompts = [
    "One thing that made you smile this week?",
    "One thing you appreciated about your partner?",
    "One small thing to try next week?"
  ];

  // Mock historical data
  const [checkinHistory] = useState<CheckinEntry[]>([
    {
      id: '1',
      checkinDate: '2025-01-20',
      rating: 8,
      answers: [
        { prompt: prompts[0], answer: 'Our impromptu dance party in the kitchen while making dinner - you always know how to make ordinary moments special!' },
        { prompt: prompts[1], answer: 'How patient and supportive you were when I was stressed about work. You listened and gave the best hugs.' },
        { prompt: prompts[2], answer: 'Plan a weekend morning hike together - we keep saying we want to but never do it!' }
      ],
      authorId: 'sarah',
      authorName: 'Sarah',
      createdAt: '2025-01-20T19:30:00'
    },
    {
      id: '2',
      checkinDate: '2025-01-13',
      rating: 9,
      answers: [
        { prompt: prompts[0], answer: 'Watching you get so excited about that book you\'ve been reading - your enthusiasm is contagious!' },
        { prompt: prompts[1], answer: 'The way you took care of me when I was feeling sick, bringing tea and your famous soup.' },
        { prompt: prompts[2], answer: 'Start that photography project we talked about - capturing little moments around the house.' }
      ],
      authorId: 'michael',
      authorName: 'Michael',
      createdAt: '2025-01-13T20:15:00'
    },
    {
      id: '3',
      checkinDate: '2025-01-06',
      rating: 7,
      answers: [
        { prompt: prompts[0], answer: 'New Year\'s Eve at home was perfect - just us, good wine, and terrible karaoke!' },
        { prompt: prompts[1], answer: 'How you helped me set realistic goals for the new year instead of letting me go overboard.' },
        { prompt: prompts[2], answer: 'Have a proper digital detox evening - phones in a drawer, just talking and connecting.' }
      ],
      authorId: 'sarah',
      authorName: 'Sarah',
      createdAt: '2025-01-06T21:00:00'
    }
  ]);

  // Check if there's already a check-in this week
  useEffect(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week
    weekStart.setHours(0, 0, 0, 0);

    const hasCheckin = checkinHistory.some(entry => {
      const entryDate = new Date(entry.checkinDate);
      return entryDate >= weekStart;
    });

    setHasSubmittedThisWeek(hasCheckin);
  }, [checkinHistory]);

  const handleRatingClick = (rating: number) => {
    setCurrentRating(rating);
  };

  const handleAnswerChange = (index: number, value: string) => {
    setCurrentAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (currentRating === 0 || currentAnswers.some(answer => !answer.trim())) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Submit to API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and mark as submitted
      setCurrentRating(0);
      setCurrentAnswers(['', '', '']);
      setHasSubmittedThisWeek(true);
      
      // In a real app, you'd refresh the history from API
      console.log('Check-in submitted!');
    } catch (error) {
      console.error('Failed to submit check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = currentRating > 0 && currentAnswers.every(answer => answer.trim().length > 0);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWeekRange = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return `${weekStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  };

  const getAverageRating = () => {
    if (checkinHistory.length === 0) return 0;
    const sum = checkinHistory.reduce((acc, entry) => acc + entry.rating, 0);
    return (sum / checkinHistory.length).toFixed(1);
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Weekly Check-in</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Share appreciation and set intentions together
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
          className="border-neutral-600 text-neutral-400 hover:text-white"
          data-testid="button-toggle-history"
        >
          {showHistory ? 'Current Week' : 'View History'}
        </Button>
      </div>

      {!showHistory ? (
        <div className="flex-1 space-y-6">
          {/* Current Week Status */}
          <Card className="bg-neutral-800 border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">This Week ({getWeekRange()})</h3>
                {hasSubmittedThisWeek ? (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-400">Check-in completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4 text-[#D4AF37]" />
                    <span className="text-sm text-[#D4AF37]">Ready for check-in</span>
                  </div>
                )}
              </div>
              
              {checkinHistory.length > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#D4AF37]">{getAverageRating()}</div>
                  <div className="text-xs text-neutral-400">avg rating</div>
                </div>
              )}
            </div>

            {!hasSubmittedThisWeek && (
              <div className="space-y-6">
                {/* Rating Scale */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    How would you rate this week together? (1-10)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleRatingClick(rating)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          currentRating >= rating
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                            : "border-neutral-600 text-neutral-400 hover:border-[#D4AF37]/50 hover:text-white"
                        )}
                        data-testid={`rating-${rating}`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompts */}
                <div className="space-y-4">
                  {prompts.map((prompt, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#D4AF37]" />
                        {prompt}
                      </label>
                      <Textarea
                        value={currentAnswers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="Share your thoughts..."
                        className="bg-neutral-900 border-neutral-600 text-white min-h-[100px] resize-none"
                        data-testid={`answer-${index}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
                  data-testid="button-submit-checkin"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Submit Check-in
                    </>
                  )}
                </Button>
              </div>
            )}

            {hasSubmittedThisWeek && (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-white mb-2">Thank you for this week's check-in!</p>
                <p className="text-sm text-neutral-400">
                  Come back next week to continue strengthening your connection.
                </p>
              </div>
            )}
          </Card>

          {/* Insights */}
          {checkinHistory.length > 0 && (
            <Card className="bg-neutral-800 border-neutral-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="text-lg font-semibold text-white">Quick Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#D4AF37]">{checkinHistory.length}</div>
                  <div className="text-xs text-neutral-400">check-ins completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#D4AF37]">{getAverageRating()}</div>
                  <div className="text-xs text-neutral-400">average rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    {Math.max(...checkinHistory.map(e => e.rating))}
                  </div>
                  <div className="text-xs text-neutral-400">highest week</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* History View */
        <div className="flex-1 overflow-y-auto space-y-4">
          {checkinHistory.map(entry => (
            <Card key={entry.id} className="bg-neutral-800 border-neutral-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-[#D4AF37]" />
                    <span className="text-white font-medium">{formatDate(entry.checkinDate)}</span>
                    <Badge className="bg-[#D4AF37] text-black">
                      <Star className="h-3 w-3 mr-1" />
                      {entry.rating}/10
                    </Badge>
                  </div>
                  <div className="text-sm text-neutral-400">by {entry.authorName}</div>
                </div>
              </div>

              <div className="space-y-4">
                {entry.answers.map((qa, index) => (
                  <div key={index}>
                    <div className="text-sm font-medium text-[#D4AF37] mb-2 flex items-center gap-2">
                      <Lightbulb className="h-3 w-3" />
                      {qa.prompt}
                    </div>
                    <p className="text-white text-sm bg-neutral-900 p-3 rounded-lg">
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {checkinHistory.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 mb-2">No check-ins yet</p>
              <p className="text-sm text-neutral-500">
                Start your first weekly check-in to begin tracking your connection.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Privacy Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-700">
        <p className="text-xs text-neutral-500 text-center flex items-center justify-center gap-2">
          <Users className="h-3 w-3" />
          Partners can see a simple sparkline of ratings • Individual responses stay private
        </p>
      </div>
    </div>
  );
}