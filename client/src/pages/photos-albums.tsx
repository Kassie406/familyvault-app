import { ArrowLeft, Plus, FolderOpen, Image, Calendar, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface Album {
  id: string;
  title: string;
  description?: string;
  photoCount: number;
  lastUpdated: string;
  coverPhoto?: string;
  isShared: boolean;
}

export default function PhotosAlbums() {
  // Mock albums data - replace with real API call
  const { data: albums = [], isLoading } = useQuery({
    queryKey: ['/api/albums'],
    queryFn: async () => {
      // TODO: Replace with real API call
      return [
        {
          id: "album-1",
          title: "Family Vacation 2024",
          description: "Summer trip to the mountains",
          photoCount: 45,
          lastUpdated: "2024-01-15",
          isShared: true
        },
        {
          id: "album-2", 
          title: "Birthday Celebrations",
          description: "All our birthday memories",
          photoCount: 28,
          lastUpdated: "2024-01-10",
          isShared: false
        },
        {
          id: "album-3",
          title: "School Events",
          photoCount: 16,
          lastUpdated: "2024-01-05",
          isShared: true
        }
      ] as Album[];
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
              <h1 className="text-xl font-semibold text-white">Photo Albums</h1>
              <p className="text-sm text-white/70">Organize your family memories</p>
            </div>
          </div>
          <Button 
            className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
            data-testid="button-create-album"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Album
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[var(--bg-800)] border-white/10 animate-pulse">
                <div className="h-48 bg-white/10 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Albums Yet</h3>
            <p className="text-white/70 mb-6">Create your first album to organize your family photos</p>
            <Button 
              className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
              data-testid="button-create-first-album"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Album
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link key={album.id} href={`/photos/album/${album.id}`}>
                <Card className="bg-[var(--bg-800)] border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                  {/* Album Cover */}
                  <div className="relative h-48 bg-gradient-to-br from-[var(--gold)]/20 to-purple-600/20 rounded-t-lg overflow-hidden">
                    {album.coverPhoto ? (
                      <img 
                        src={album.coverPhoto} 
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Image className="h-12 w-12 text-white/50" />
                      </div>
                    )}
                    {album.isShared && (
                      <div className="absolute top-3 right-3 bg-[var(--gold)] text-black px-2 py-1 rounded-full text-xs font-medium">
                        <Users className="h-3 w-3 inline mr-1" />
                        Shared
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{album.title}</CardTitle>
                    {album.description && (
                      <CardDescription className="text-white/70">
                        {album.description}
                      </CardDescription>
                    )}
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        {album.photoCount} photos
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(album.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}