import { useState } from 'react';
import { Search, Key, Smartphone, Laptop, Home, Shield, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Luxury Card Shell Component
function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F]
                     shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all
                     hover:border-[#D4AF37] hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)] ${className}`}>
      {children}
    </div>
  );
}

// Password Manager Card Component
function ManagerCard({ name, count }: { name: string; count: number }) {
  return (
    <Shell className="p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl grid place-items-center bg-[#D4AF37]/15 text-[#D4AF37] border border-[#232530]">
          <Key className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-medium truncate">{name}</div>
          <div className="text-xs text-neutral-400">+ {count} items pre-populated</div>
        </div>
        <DropdownDots />
      </div>
    </Shell>
  );
}

// Credential Card Component
function CredentialCard({ title, owner, tag }: { title: string; owner?: string; tag?: string }) {
  const [isRevealed, setIsRevealed] = useState(false);
  
  const handleReveal = () => {
    setIsRevealed(true);
    // Auto-mask after 15 seconds
    setTimeout(() => setIsRevealed(false), 15000);
  };

  const handleCopy = () => {
    // Copy functionality would be implemented here
    console.log('Copying credential for:', title);
  };

  return (
    <Shell className="p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#111214] border border-[#232530] text-neutral-300">
          <Key className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm text-white font-medium truncate">{title}</div>
          <div className="text-xs text-neutral-500 mt-0.5">
            {owner && <>Owner: <span className="text-neutral-300">{owner}</span></>}
            {tag && <> · <span className="rounded-full border border-[#232530] bg-[#111214] px-2 py-0.5 text-[11px]">{tag}</span></>}
          </div>

          {/* Masked secret row */}
          <div className="mt-2 flex items-center gap-2">
            <div className="text-[13px] tracking-widest text-neutral-500 select-none">
              {isRevealed ? "MySecretPass123" : "•••• •••• ••••"}
            </div>
            <button 
              onClick={handleReveal}
              className="text-xs text-[#D4AF37] hover:underline underline-offset-4"
            >
              {isRevealed ? "Hide" : "Reveal"}
            </button>
            <span className="text-neutral-600 text-xs">•</span>
            <button 
              onClick={handleCopy}
              className="text-xs text-neutral-300 hover:text-white"
            >
              Copy
            </button>
          </div>
        </div>
        <DropdownDots />
      </div>
    </Shell>
  );
}

// Dropdown Dots Component
function DropdownDots() {
  return (
    <button className="h-8 w-8 inline-grid place-items-center rounded-lg border border-transparent text-neutral-400
                       hover:text-white hover:border-[#232530]">
      ⋯
    </button>
  );
}

// Mock data
const passwordManagers = [
  {
    id: '1',
    name: "Angel's Password Manager",
    count: 2,
  },
  {
    id: '2',
    name: "Kassandra's Password Manager", 
    count: 2,
  },
];

const passwords = [
  {
    id: '1',
    title: "Angel's Phone Password",
    owner: "Angel",
    tag: "Device",
  },
  {
    id: '2',
    title: "Home Wi-Fi",
    owner: "House",
    tag: "Network",
  },
  {
    id: '3',
    title: "Garage Door Code",
    owner: "Home",
    tag: "Access",
  },
  {
    id: '4',
    title: "Angel's Laptop Password",
    owner: "Angel", 
    tag: "Device",
  },
  {
    id: '5',
    title: "Code To Safe",
    owner: "Home",
    tag: "Access",
  },
  {
    id: '6',
    title: "Kassandra's Phone Password",
    owner: "Kassandra",
    tag: "Device",
  },
];

export default function FamilyPasswords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredPasswordManagers = passwordManagers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOwner = !ownerFilter || ownerFilter === 'all-owners' || password.owner === ownerFilter;
    const matchesType = !typeFilter || typeFilter === 'all-types' || password.tag === typeFilter;
    return matchesSearch && matchesOwner && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Passwords</h1>
            <p className="text-sm text-neutral-400">Securely store and share credentials across the family.</p>
          </div>
          <Button className="bg-[#D4AF37] text-black hover:bg-[#c6a02e] rounded-full px-5">
            Add credential
          </Button>
        </div>

        {/* Search + filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 rounded-xl border border-[#232530] bg-[#13141B] px-3 py-2">
              <Search className="h-4 w-4 text-neutral-400" />
              <input 
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-neutral-500"
                placeholder="Search by name, site, or owner" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="rounded-xl border-[#232530] bg-[#13141B] text-white">
                <SelectValue placeholder="All Owners" />
              </SelectTrigger>
              <SelectContent className="bg-[#13141B] border-[#232530]">
                <SelectItem value="all-owners">All Owners</SelectItem>
                <SelectItem value="Angel">Angel</SelectItem>
                <SelectItem value="Kassandra">Kassandra</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="House">House</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="rounded-xl border-[#232530] bg-[#13141B] text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-[#13141B] border-[#232530]">
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="Device">Device</SelectItem>
                <SelectItem value="Network">Network</SelectItem>
                <SelectItem value="Access">Access</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Password Managers Section */}
        <h2 className="text-sm font-semibold tracking-wide text-neutral-300 mb-3">Password Managers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredPasswordManagers.map((manager) => (
            <ManagerCard 
              key={manager.id} 
              name={manager.name} 
              count={manager.count} 
            />
          ))}
        </div>

        {/* Passwords Section */}
        <h2 className="text-sm font-semibold tracking-wide text-neutral-300 mb-3">Passwords</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPasswords.map((password) => (
            <CredentialCard 
              key={password.id} 
              title={password.title} 
              owner={password.owner}
              tag={password.tag}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPasswordManagers.length === 0 && filteredPasswords.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <Key className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No passwords found</h3>
            <p className="text-neutral-400">Try adjusting your search terms or add a new credential.</p>
          </div>
        )}
      </div>
    </div>
  );
}