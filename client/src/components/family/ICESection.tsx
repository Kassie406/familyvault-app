import React, { useState } from "react";
import { ShieldAlert, Download, Edit3, Save, X, Phone, User, Heart, Droplets, Copy, Share2, QrCode, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import "@/styles/IceActions.css";

interface ICEData {
  emergencyContacts?: {
    primary?: string;
    doctor?: string;
    neighbor?: string;
  };
  medicalInfo?: {
    allergies?: string;
    conditions?: string;
    medications?: string;
  };
  bloodTypes?: {
    dad?: string;
    mom?: string;
    kids?: string;
  };
  additionalNotes?: string;
}

interface ShareData {
  url: string;
  ttl: number;
}

export function ICESection() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ICEData>({});
  const [shareModal, setShareModal] = useState<ShareData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Copy helper function
  const copyText = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      toast({ title: "Copied", description: "Text copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", description: "Unable to copy text", variant: "destructive" });
    }
  };

  // Extract text from each box for copying
  const extractBoxText = (section: 'contacts' | 'medical' | 'blood') => {
    if (!iceData) return '';
    
    switch (section) {
      case 'contacts':
        const contacts = iceData.emergencyContacts || {};
        return `Emergency Contacts:\nPrimary: ${contacts.primary || 'Not set'}\nDoctor: ${contacts.doctor || 'Not set'}\nNeighbor: ${contacts.neighbor || 'Not set'}`;
      case 'medical':
        const medical = iceData.medicalInfo || {};
        return `Medical Information:\nAllergies: ${medical.allergies || 'None listed'}\nConditions: ${medical.conditions || 'None listed'}\nMedications: ${medical.medications || 'None listed'}`;
      case 'blood':
        const blood = iceData.bloodTypes || {};
        return `Blood Types:\nDad: ${blood.dad || 'Not set'}\nMom: ${blood.mom || 'Not set'}\nKids: ${blood.kids || 'Not set'}`;
      default:
        return '';
    }
  };

  // Copy all ICE data
  const copyAllData = () => {
    const allText = [
      extractBoxText('contacts'),
      extractBoxText('medical'),
      extractBoxText('blood'),
      iceData?.additionalNotes ? `Additional Notes:\n${iceData.additionalNotes}` : ''
    ].filter(Boolean).join('\n\n');
    
    copyText(allText);
  };

  // Generate share link
  const generateShareLink = async () => {
    try {
      const response = await fetch('/api/ice/share', { 
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to generate share link');
      
      const shareData = await response.json();
      setShareModal(shareData);
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to generate share link",
        variant: "destructive"
      });
    }
  };

  // Fetch ICE data
  const { data: iceData, isLoading } = useQuery({
    queryKey: ['/api/ice'],
    queryFn: async () => {
      const response = await fetch('/api/ice');
      if (!response.ok) {
        if (response.status === 404) {
          return {}; // No data yet, that's fine
        }
        throw new Error('Failed to fetch ICE data');
      }
      return response.json();
    },
  });

  // Update ICE data mutation
  const updateICEMutation = useMutation({
    mutationFn: async (data: ICEData) => {
      const response = await fetch('/api/ice', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to update ICE data');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "ICE Information Updated",
        description: "Emergency information has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ice'] });
      setEditMode(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update ICE information",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (scrollToField?: string) => {
    setFormData(iceData || {});
    setEditMode(true);
    
    // Scroll to specific field if provided
    if (scrollToField) {
      setTimeout(() => {
        const element = document.querySelector(`[data-field="${scrollToField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleSave = () => {
    updateICEMutation.mutate(formData);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({});
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/ice/print');
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'family-ice-information.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "PDF Downloaded",
        description: "ICE information PDF has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF at this time.",
        variant: "destructive",
      });
    }
  };

  const updateFormField = (section: keyof ICEData, field: string, value: string) => {
    setFormData(prev => {
      const currentSection = prev[section] as Record<string, any> || {};
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
    });
  };

  const Field = ({ 
    label, 
    value, 
    icon, 
    isPrimary = false,
    hasAllergy = false,
    emptyPrompt,
    fieldKey
  }: { 
    label: string; 
    value?: string; 
    icon?: React.ReactNode;
    isPrimary?: boolean;
    hasAllergy?: boolean;
    emptyPrompt?: string;
    fieldKey?: string;
  }) => (
    <div className="flex items-start space-x-2 text-sm">
      {icon && <span className="text-[#D4AF37] mt-0.5">{icon}</span>}
      <span className="text-zinc-400 min-w-[80px] flex items-center gap-1">
        {label}:
        {isPrimary && <Star className="w-3 h-3 text-[#c5a000]" />}
      </span>
      <span className="text-white flex-1 flex items-center gap-2">
        {value ? (
          <>
            {value}
            {hasAllergy && (
              <span className="text-[11px] px-2 py-[2px] rounded-full border border-[#c5a000] text-[#c5a000]">
                ALLERGY
              </span>
            )}
          </>
        ) : (
          <button
            onClick={() => handleEdit(fieldKey)}
            className="text-zinc-500 hover:text-[#c5a000] transition-colors text-xs"
          >
            {emptyPrompt || "Add information"}
          </button>
        )}
      </span>
    </div>
  );

  const EditField = ({ 
    label, 
    value, 
    onChange, 
    icon,
    placeholder = "",
    type = "text",
    fieldKey
  }: { 
    label: string; 
    value?: string; 
    onChange: (value: string) => void; 
    icon?: React.ReactNode;
    placeholder?: string;
    type?: string;
    fieldKey?: string;
  }) => (
    <div className="space-y-1" data-field={fieldKey}>
      <Label className="text-zinc-300 text-sm flex items-center gap-2">
        {icon && <span className="text-[#D4AF37]">{icon}</span>}
        {label}
      </Label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-800/80 border-zinc-700 text-white"
        placeholder={placeholder}
      />
    </div>
  );

  const Section = ({ 
    title, 
    children, 
    icon, 
    onCopy,
    sectionKey
  }: { 
    title: string; 
    children: React.ReactNode; 
    icon: React.ReactNode;
    onCopy: () => void;
    sectionKey: string;
  }) => (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold flex items-center gap-2">
          <span className="text-[#D4AF37]">{icon}</span>
          {title}
        </h4>
        <button
          onClick={onCopy}
          className="ml-auto text-xs px-2 py-1 rounded border border-[#25252b] hover:text-[#c5a000] hover:border-[#c5a000] transition-colors"
          aria-label={`Copy ${title.toLowerCase()}`}
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="ice-card rounded-2xl border border-[#2A2A33] bg-gradient-to-br from-[#161616] to-[#0F0F0F] shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="ice-card ice-print rounded-2xl border border-[#2A2A33] bg-gradient-to-br from-[#161616] to-[#0F0F0F] shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:border-[#D4AF37]/30">
      {/* Sticky Action Bar */}
      <div className="ice-actions sticky top-0 bg-[#121217] border-b border-zinc-800 p-4 z-[60] rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-red-400" />
            In Case of Emergency (ICE)
          </h3>
          
          <div id="ice-actions" className="flex items-center gap-2">
            <Button
              onClick={copyAllData}
              variant="outline"
              size="sm"
              className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy All
            </Button>
            
            <Button
              onClick={generateShareLink}
              variant="outline"
              size="sm"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            
            {!editMode ? (
              <Button
                onClick={() => handleEdit()}
                variant="outline"
                size="sm"
                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  onClick={handleSave}
                  disabled={updateICEMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-zinc-600 text-white hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-zinc-400 text-sm mb-6">
          Critical family information for emergency responders and medical professionals.
        </p>

        {!editMode ? (
          // Display Mode
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Section 
              title="Emergency Contacts" 
              icon={<Phone className="w-4 h-4" />}
              onCopy={() => copyText(extractBoxText('contacts'))}
              sectionKey="contacts"
            >
              <Field 
                label="Primary" 
                value={iceData?.emergencyContacts?.primary} 
                icon={<User className="w-3 h-3" />}
                isPrimary={true}
                emptyPrompt="Add primary contact"
                fieldKey="primary-contact"
              />
              <Field 
                label="Doctor" 
                value={iceData?.emergencyContacts?.doctor} 
                icon={<User className="w-3 h-3" />}
                emptyPrompt="Add your doctor's name"
                fieldKey="doctor-contact"
              />
              <Field 
                label="Neighbor" 
                value={iceData?.emergencyContacts?.neighbor} 
                icon={<User className="w-3 h-3" />}
                emptyPrompt="Add neighbor contact"
                fieldKey="neighbor-contact"
              />
            </Section>

            <Section 
              title="Medical Information" 
              icon={<Heart className="w-4 h-4" />}
              onCopy={() => copyText(extractBoxText('medical'))}
              sectionKey="medical"
            >
              <Field 
                label="Allergies" 
                value={iceData?.medicalInfo?.allergies}
                hasAllergy={!!iceData?.medicalInfo?.allergies}
                emptyPrompt="Add allergy information"
                fieldKey="allergies"
              />
              <Field 
                label="Conditions" 
                value={iceData?.medicalInfo?.conditions}
                emptyPrompt="Add medical conditions"
                fieldKey="conditions"
              />
              <Field 
                label="Medications" 
                value={iceData?.medicalInfo?.medications}
                emptyPrompt="Add current medications"
                fieldKey="medications"
              />
            </Section>

            <Section 
              title="Blood Types" 
              icon={<Droplets className="w-4 h-4" />}
              onCopy={() => copyText(extractBoxText('blood'))}
              sectionKey="blood"
            >
              <Field 
                label="Dad" 
                value={iceData?.bloodTypes?.dad}
                emptyPrompt="Add dad's blood type"
                fieldKey="blood-dad"
              />
              <Field 
                label="Mom" 
                value={iceData?.bloodTypes?.mom}
                emptyPrompt="Add mom's blood type"
                fieldKey="blood-mom"
              />
              <Field 
                label="Kids" 
                value={iceData?.bloodTypes?.kids}
                emptyPrompt="Add children's blood types"
                fieldKey="blood-kids"
              />
            </Section>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Section 
                title="Emergency Contacts" 
                icon={<Phone className="w-4 h-4" />}
                onCopy={() => {}}
                sectionKey="contacts"
              >
                <div className="space-y-3">
                  <EditField
                    label="Primary Contact"
                    value={formData.emergencyContacts?.primary}
                    onChange={(value) => updateFormField('emergencyContacts', 'primary', value)}
                    icon={<User className="w-3 h-3" />}
                    placeholder="Name & Phone Number"
                    fieldKey="primary-contact"
                  />
                  <EditField
                    label="Doctor"
                    value={formData.emergencyContacts?.doctor}
                    onChange={(value) => updateFormField('emergencyContacts', 'doctor', value)}
                    icon={<User className="w-3 h-3" />}
                    placeholder="Dr. Name & Phone"
                    fieldKey="doctor-contact"
                  />
                  <EditField
                    label="Neighbor"
                    value={formData.emergencyContacts?.neighbor}
                    onChange={(value) => updateFormField('emergencyContacts', 'neighbor', value)}
                    icon={<User className="w-3 h-3" />}
                    placeholder="Neighbor Name & Phone"
                    fieldKey="neighbor-contact"
                  />
                </div>
              </Section>

              <Section 
                title="Medical Information" 
                icon={<Heart className="w-4 h-4" />}
                onCopy={() => {}}
                sectionKey="medical"
              >
                <div className="space-y-3">
                  <EditField
                    label="Allergies"
                    value={formData.medicalInfo?.allergies}
                    onChange={(value) => updateFormField('medicalInfo', 'allergies', value)}
                    placeholder="Food, drug, environmental allergies"
                    fieldKey="allergies"
                  />
                  <EditField
                    label="Conditions"
                    value={formData.medicalInfo?.conditions}
                    onChange={(value) => updateFormField('medicalInfo', 'conditions', value)}
                    placeholder="Chronic conditions, disabilities"
                    fieldKey="conditions"
                  />
                  <EditField
                    label="Medications"
                    value={formData.medicalInfo?.medications}
                    onChange={(value) => updateFormField('medicalInfo', 'medications', value)}
                    placeholder="Current medications"
                    fieldKey="medications"
                  />
                </div>
              </Section>

              <Section 
                title="Blood Types" 
                icon={<Droplets className="w-4 h-4" />}
                onCopy={() => {}}
                sectionKey="blood"
              >
                <div className="space-y-3">
                  <EditField
                    label="Dad"
                    value={formData.bloodTypes?.dad}
                    onChange={(value) => updateFormField('bloodTypes', 'dad', value)}
                    placeholder="A+, B-, O+, etc."
                    fieldKey="blood-dad"
                  />
                  <EditField
                    label="Mom"
                    value={formData.bloodTypes?.mom}
                    onChange={(value) => updateFormField('bloodTypes', 'mom', value)}
                    placeholder="A+, B-, O+, etc."
                    fieldKey="blood-mom"
                  />
                  <EditField
                    label="Kids"
                    value={formData.bloodTypes?.kids}
                    onChange={(value) => updateFormField('bloodTypes', 'kids', value)}
                    placeholder="List all children's blood types"
                    fieldKey="blood-kids"
                  />
                </div>
              </Section>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Additional Notes</Label>
              <Textarea
                value={formData.additionalNotes || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                className="bg-zinc-800/80 border-zinc-700 text-white"
                placeholder="Any additional emergency information..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 text-center">
            Keep this information current. In emergencies, seconds matter.
          </p>
        </div>
      </div>

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#25252b] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Share ICE Information</h3>
              <button
                onClick={() => setShareModal(null)}
                className="p-2 hover:bg-[#25252b] rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            <div className="text-center space-y-4">
              {/* QR Code Placeholder */}
              <div className="mx-auto w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                <QrCode className="h-24 w-24 text-black" />
              </div>

              <div className="text-xs text-zinc-500 bg-[#25252b] rounded-lg p-3">
                Link expires in {Math.floor(shareModal.ttl / 60)} minutes
              </div>

              <div className="text-xs text-zinc-400 break-all bg-[#25252b] rounded p-2">
                {shareModal.url}
              </div>

              <button
                onClick={() => copyText(shareModal.url)}
                className="w-full px-4 py-2 bg-[#c5a000] text-black rounded-lg hover:brightness-110 transition-all font-medium"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
