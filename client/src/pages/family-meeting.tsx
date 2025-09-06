import { useParams } from "wouter";
import { ArrowLeft, Copy, Users, Mic, MicOff, Video, VideoOff, Settings, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LiveKitRoom, GridLayout, ParticipantTile, RoomAudioRenderer, ControlBar, PreJoin } from "@livekit/components-react";
import "@livekit/components-styles";

interface Meeting {
  id: string;
  roomName: string;
  title: string;
  createdBy: string;
  createdAt: string;
  status: 'active' | 'ended';
  participants: Array<{
    id: string;
    name: string;
    joinedAt: string;
    status: 'connected' | 'disconnected';
  }>;
  shareableLink: string;
  livekitUrl: string;
}

interface LiveKitToken {
  token: string;
  serverUrl: string;
  roomName: string;
  meeting: Meeting;
}

export default function FamilyMeeting() {
  const { meetingId } = useParams();
  const { toast } = useToast();
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [livekitToken, setLivekitToken] = useState<LiveKitToken | null>(null);
  const [isGettingToken, setIsGettingToken] = useState(false);
  
  // Check for token in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');

  // Fetch meeting details
  const { data: meeting, isLoading } = useQuery({
    queryKey: [`/api/family/meeting/${meetingId}`],
    queryFn: async () => {
      const response = await fetch(`/api/family/meeting/${meetingId}`);
      if (!response.ok) {
        throw new Error('Meeting not found');
      }
      return response.json() as Meeting;
    },
    retry: false
  });

  // Generate or use existing token for LiveKit
  useEffect(() => {
    if (urlToken && meeting) {
      // Use token from URL
      setLivekitToken({
        token: urlToken,
        serverUrl: meeting.livekitUrl,
        roomName: meeting.roomName,
        meeting
      });
    } else if (meeting && !livekitToken && !isGettingToken) {
      // Get fresh token from API
      setIsGettingToken(true);
      fetch(`/api/family/meeting/${meetingId}/token`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setLivekitToken(data);
          setIsGettingToken(false);
        })
        .catch(error => {
          console.error('Failed to get LiveKit token:', error);
          toast({
            title: "Connection Error",
            description: "Failed to get meeting token. Please try refreshing.",
            variant: "destructive"
          });
          setIsGettingToken(false);
        });
    }
  }, [meeting, urlToken, livekitToken, isGettingToken, meetingId, toast]);

  const copyMeetingLink = async () => {
    if (!meeting) return;
    try {
      await navigator.clipboard.writeText(meeting.shareableLink);
      toast({
        title: "Link Copied",
        description: "Meeting link copied to clipboard. Share with family members.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const joinMeeting = () => {
    if (livekitToken) {
      setHasJoined(true);
      toast({
        title: "Joined Meeting",
        description: "You've joined the family video meeting.",
      });
    }
  };

  const leaveMeeting = () => {
    if (confirm('Are you sure you want to leave the family meeting?')) {
      window.close();
    }
  };

  if (isLoading || (meeting && !livekitToken && !isGettingToken)) {
    return (
      <div className="min-h-screen bg-[var(--bg-900)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)] mx-auto mb-4"></div>
          <p className="text-white/70">
            {isLoading ? 'Loading family meeting...' : 'Preparing secure connection...'}
          </p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-[var(--bg-900)] text-white flex items-center justify-center">
        <Card className="bg-[var(--bg-800)] border-white/10 max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Meeting Not Found</CardTitle>
            <CardDescription className="text-white/70">
              This family meeting may have ended or the link is invalid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/family">
              <Button className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-900)] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[var(--bg-800)]">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/family">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">{meeting.title}</h1>
              <p className="text-sm text-white/70">
                Started by {meeting.createdBy} • {meeting.participants.length} participants
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyMeetingLink}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-copy-link"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={leaveMeeting}
              data-testid="button-leave-meeting"
            >
              <Phone className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Main Meeting Interface */}
      <div className="flex-1 p-6">
        {!hasJoined ? (
          /* Pre-join Screen */
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-[var(--bg-800)] border-white/10">
              <CardHeader>
                <div className="w-16 h-16 bg-[var(--gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-white text-2xl">Join Family Meeting</CardTitle>
                <CardDescription className="text-white/70">
                  Ready to join the family group chat? Make sure your microphone and camera are working.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Participants List */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Currently in meeting:</h3>
                  <div className="space-y-2">
                    {meeting.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
                        <span className="text-white">{participant.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          participant.status === 'connected' 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-red-600/20 text-red-400'
                        }`}>
                          {participant.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={`border-white/20 ${micEnabled ? 'text-white hover:bg-white/10' : 'bg-red-600/20 text-red-400'}`}
                  >
                    {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={`border-white/20 ${videoEnabled ? 'text-white hover:bg-white/10' : 'bg-red-600/20 text-red-400'}`}
                  >
                    {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                </div>

                <Button
                  onClick={joinMeeting}
                  disabled={!livekitToken}
                  className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90 w-full py-3 disabled:opacity-50"
                  data-testid="button-join-meeting"
                >
                  <Users className="h-5 w-5 mr-2" />
                  {livekitToken ? 'Join Meeting' : 'Preparing...'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* LiveKit Video Meeting */
          <div className="h-full">
            {livekitToken ? (
              <LiveKitRoom
                serverUrl={livekitToken.serverUrl}
                token={livekitToken.token}
                connect
                audio={micEnabled}
                video={videoEnabled}
                data-lk-theme="default"
                className="h-full"
                style={{ height: 'calc(100vh - 140px)' }}
              >
                <RoomAudioRenderer />
                <div className="flex flex-col h-full">
                  <div className="flex-1 p-3">
                    <GridLayout className="h-full rounded-2xl border border-zinc-800 bg-zinc-900/50">
                      <ParticipantTile />
                    </GridLayout>
                  </div>
                  <div className="border-t border-zinc-800 p-2 bg-zinc-900/60">
                    <ControlBar variation="minimal" />
                  </div>
                </div>
              </LiveKitRoom>
            ) : (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)] mx-auto mb-4"></div>
                <p className="text-white/70">Connecting to secure meeting room...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}