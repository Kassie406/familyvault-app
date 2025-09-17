import { ArrowLeft, Share, Users, Image, Filter, Grid, List } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface SharedPhoto {
  id: string;
  title?: string;
  url: string;
  thumbnailUrl: string;
  albumName?: string;
  sharedBy: string;
  sharedDate: string;
  viewCount: number;
}

export default function PhotosShared() {
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Mock shared photos data - replace with real API call
  const { data: sharedPhotos = [], isLoading } = useQuery({
    queryKey: ['/api/photos/shared'],
    queryFn: async () => {
      // TODO: Replace with real API call
      return [
        {
          id: "photo-1",
          title: "Family Beach Day",
          url: "/api/placeholder-photo-1.jpg",
          thumbnailUrl: "/api/placeholder-thumb-1.jpg",
          albumName: "Summer 2024",
          sharedBy: "Mom",
          sharedDate: "2024-01-15",
          viewCount: 12
        },
        {
          id: "photo-2",
          title: "Birthday Celebration",
          url: "/api/placeholder-photo-2.jpg", 
          thumbnailUrl: "/api/placeholder-thumb-2.jpg",
          albumName: "Birthdays",
          sharedBy: "Dad",
          sharedDate: "2024-01-10",
          viewCount: 8
        },
        {
          id: "photo-3",
          url: "/api/placeholder-photo-3.jpg",
          thumbnailUrl: "/api/placeholder-thumb-3.jpg",
          albumName: "School Events",
          sharedBy: "Sarah",
          sharedDate: "2024-01-05",
          viewCount: 15
        }
      ] as SharedPhoto[];
    }
  });

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
              <h1 className="text-xl font-semibold text-white">Shared Galleries</h1>
              <p className="text-sm text-white/70">Photos shared with family members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-toggle-view"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-filter"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[var(--bg-800)] border-white/10 animate-pulse">
                <div className={`bg-white/10 rounded-t-lg ${viewMode === 'grid' ? 'h-48' : 'h-32'}`}></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sharedPhotos.length === 0 ? (
          <div className="text-center py-12">
            <Share className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Shared Photos</h3>
            <p className="text-white/70 mb-6">Photos shared with family members will appear here</p>
            <Link href="/photos/upload">
              <Button 
                className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
                data-testid="button-upload-photos"
              >
                <Image className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </Link>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {sharedPhotos.map((photo) => (
              <Card key={photo.id} className="bg-[var(--bg-800)] border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                <div className={`relative overflow-hidden rounded-t-lg ${viewMode === 'grid' ? 'h-48' : 'h-32 flex-shrink-0'}`}>
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-[var(--gold)]/20 to-purple-600/20">
                    <Image className="h-12 w-12 text-white/50" />
                  </div>
                  <div className="absolute top-3 right-3 bg-[var(--gold)] text-black px-2 py-1 rounded-full text-xs font-medium">
                    <Users className="h-3 w-3 inline mr-1" />
                    Shared
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">
                        {photo.title || `Photo ${photo.id.slice(0, 8)}`}
                      </h3>
                      {photo.albumName && (
                        <p className="text-sm text-white/60 mb-1">Album: {photo.albumName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Shared by {photo.sharedBy}</span>
                    <span>{photo.viewCount} views</span>
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {new Date(photo.sharedDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}