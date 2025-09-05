import { useState, useMemo } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Filter, 
  Search, 
  SortAsc, 
  Clock, 
  Share, 
  AlertCircle,
  Eye,
  Download,
  MoreVertical,
  Users,
  Shield
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SharedDocument {
  id: string;
  title: string;
  type: 'document' | 'photo' | 'video' | 'other';
  size: string;
  sharedBy: string;
  sharedAt: string;
  status: 'shared' | 'pending-approval' | 'expired';
  accessLevel: 'view' | 'edit' | 'admin';
  description?: string;
  thumbnail?: string;
}

export default function Inbox() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get filter and sort from URL params
  const filter = searchParams.get('filter') || 'shared';
  const sort = searchParams.get('sort') || 'recent';

  // Mock data for now - this would come from API
  const { data: documents = [], isLoading } = useQuery<SharedDocument[]>({
    queryKey: ['/api/inbox/documents', filter, sort],
    queryFn: async () => {
      // Mock data - replace with real API call
      const mockDocs: SharedDocument[] = [
        {
          id: '1',
          title: 'Family Insurance Policy.pdf',
          type: 'document',
          size: '2.4 MB',
          sharedBy: 'Sarah Johnson',
          sharedAt: '2024-01-15T10:30:00Z',
          status: 'shared',
          accessLevel: 'view',
          description: 'Auto and home insurance coverage details'
        },
        {
          id: '2',
          title: 'Medical Records - John.pdf',
          type: 'document',
          size: '1.8 MB',
          sharedBy: 'Dr. Smith Office',
          sharedAt: '2024-01-14T14:20:00Z',
          status: 'pending-approval',
          accessLevel: 'view',
          description: 'Annual checkup results and recommendations'
        },
        {
          id: '3',
          title: 'Will & Testament.pdf',
          type: 'document',
          size: '3.2 MB',
          sharedBy: 'Legal Associates',
          sharedAt: '2024-01-13T09:15:00Z',
          status: 'shared',
          accessLevel: 'view',
          description: 'Updated estate planning documents'
        },
        {
          id: '4',
          title: 'Vacation Photos 2024',
          type: 'photo',
          size: '45.6 MB',
          sharedBy: 'Mom',
          sharedAt: '2024-01-12T16:45:00Z',
          status: 'shared',
          accessLevel: 'edit',
          description: '127 photos from our beach vacation'
        }
      ];

      // Apply filters
      let filtered = mockDocs;
      if (filter === 'pending-approval') {
        filtered = mockDocs.filter(doc => doc.status === 'pending-approval');
      } else if (filter === 'shared') {
        filtered = mockDocs.filter(doc => doc.status === 'shared');
      }

      // Apply sorting
      if (sort === 'recent') {
        filtered.sort((a, b) => new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime());
      } else if (sort === 'name') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      return filtered;
    }
  });

  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents;
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.sharedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documents, searchTerm]);

  const stats = useMemo(() => {
    const total = documents.length;
    const pending = documents.filter(d => d.status === 'pending-approval').length;
    const shared = documents.filter(d => d.status === 'shared').length;
    
    return { total, pending, shared };
  }, [documents]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shared':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Shared</Badge>;
      case 'pending-approval':
        return <Badge variant="destructive">Pending</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAccessBadge = (level: string) => {
    switch (level) {
      case 'view':
        return <Badge variant="outline" className="text-blue-400 border-blue-400"><Eye className="h-3 w-3 mr-1" />View</Badge>;
      case 'edit':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Edit</Badge>;
      case 'admin':
        return <Badge variant="outline" className="text-red-400 border-red-400"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Inbox</h1>
              <p className="text-gray-400">Documents and files shared with your family</p>
            </div>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
              <Share className="h-4 w-4 mr-2" />
              Share Document
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Documents</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Shared Items</p>
                    <p className="text-2xl font-bold text-green-400">{stats.shared}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending Approval</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents, people, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select defaultValue={filter}>
            <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shared">Shared Items</SelectItem>
              <SelectItem value="pending-approval">Pending Approval</SelectItem>
              <SelectItem value="all">All Documents</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={sort}>
            <SelectTrigger className="w-[150px] bg-gray-800/50 border-gray-700/50">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="size">File Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{doc.title}</h3>
                          {getStatusBadge(doc.status)}
                          {getAccessBadge(doc.accessLevel)}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{doc.description}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>Shared by {doc.sharedBy}</span>
                          <span>{doc.size}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(doc.sharedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Share Link</DropdownMenuItem>
                          <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">Remove Access</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No documents found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'No documents match the current filter'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}