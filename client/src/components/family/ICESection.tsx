import React, { useState } from "react";
import { ShieldAlert, Download, Edit3, Save, X, Phone, User, Heart, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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

export function ICESection() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ICEData>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      await apiRequest('/api/ice', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
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

  const handleEdit = () => {
    setFormData(iceData || {});
    setEditMode(true);
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
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const Field = ({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) => (
    <div className="flex items-start space-x-2 text-sm">
      {icon && <span className="text-[#D4AF37] mt-0.5">{icon}</span>}
      <span className="text-zinc-400 min-w-[80px]">{label}:</span>
      <span className="text-white flex-1">{value || "—"}</span>
    </div>
  );

  const EditField = ({ 
    label, 
    value, 
    onChange, 
    icon,
    placeholder = "",
    type = "text" 
  }: { 
    label: string; 
    value?: string; 
    onChange: (value: string) => void; 
    icon?: React.ReactNode;
    placeholder?: string;
    type?: string;
  }) => (
    <div className="space-y-1">
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

  const Section = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) => (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span className="text-[#D4AF37]">{icon}</span>
        {title}
      </h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#2A2A33] bg-gradient-to-br from-[#161616] to-[#0F0F0F] shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2A2A33] bg-gradient-to-br from-[#161616] to-[#0F0F0F] shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:border-[#D4AF37]/30">
      <div className="p-6">
        {/* Header with prominent emergency styling */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center relative">
            <ShieldAlert className="w-6 h-6 mr-3 text-red-400" />
            <span className="border-b-2 border-red-400/30 pb-1">In Case of Emergency (ICE)</span>
          </h3>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
              data-testid="button-download-pdf"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            {!editMode ? (
              <Button
                onClick={handleEdit}
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
                data-testid="button-edit-ice"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={updateICEMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-save-ice"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateICEMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-zinc-600 text-white hover:bg-zinc-800"
                  data-testid="button-cancel-ice"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-6">
          Critical family information for emergency responders and medical professionals.
        </p>

        {!editMode ? (
          // Display Mode
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Section title="Emergency Contacts" icon={<Phone className="w-4 h-4" />}>
              <Field 
                label="Primary" 
                value={iceData?.emergencyContacts?.primary} 
                icon={<User className="w-3 h-3" />}
              />
              <Field 
                label="Doctor" 
                value={iceData?.emergencyContacts?.doctor} 
                icon={<User className="w-3 h-3" />}
              />
              <Field 
                label="Neighbor" 
                value={iceData?.emergencyContacts?.neighbor} 
                icon={<User className="w-3 h-3" />}
              />
            </Section>

            <Section title="Medical Information" icon={<Heart className="w-4 h-4" />}>
              <Field label="Allergies" value={iceData?.medicalInfo?.allergies} />
              <Field label="Conditions" value={iceData?.medicalInfo?.conditions} />
              <Field label="Medications" value={iceData?.medicalInfo?.medications} />
            </Section>

            <Section title="Blood Types" icon={<Droplets className="w-4 h-4" />}>
              <Field label="Dad" value={iceData?.bloodTypes?.dad} />
              <Field label="Mom" value={iceData?.bloodTypes?.mom} />
              <Field label="Kids" value={iceData?.bloodTypes?.kids} />
            </Section>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Section title="Emergency Contacts" icon={<Phone className="w-4 h-4" />}>
                <div className="space-y-3">
                  <EditField
                    label="Primary Contact"
                    value={formData.emergencyContacts?.primary}
                    onChange={(value) => updateFormField('emergencyContacts', 'primary', value)}
                    icon={<User className="w-3 h-3" />}
                    placeholder="Name & Phone Number"
                    data-testid="input-primary-contact"
                  />
                  <EditField
                    label="Doctor"
                    value={formData.emergencyContacts?.doctor}
                    onChange={(value) => updateFormField('emergencyContacts', 'doctor', value)}
                    icon={<User className="w-3 h-3" />}
                    placeholder="Dr. Name & Phone"
                    data-testid="input-doctor-contact"
                  />
                  <EditField
                    label="Neighbor"
                    value={formData.emergencyContacts?.neighbor}
                    onChange={(value) => updateFormField('emergencyContacts', 'neighbor', value)}
                    icon={<User className="w-3 h-3" />}
                    placeholder="Neighbor Name & Phone"
                    data-testid="input-neighbor-contact"
                  />
                </div>
              </Section>

              <Section title="Medical Information" icon={<Heart className="w-4 h-4" />}>
                <div className="space-y-3">
                  <EditField
                    label="Allergies"
                    value={formData.medicalInfo?.allergies}
                    onChange={(value) => updateFormField('medicalInfo', 'allergies', value)}
                    placeholder="Food, drug, environmental allergies"
                    data-testid="input-allergies"
                  />
                  <EditField
                    label="Conditions"
                    value={formData.medicalInfo?.conditions}
                    onChange={(value) => updateFormField('medicalInfo', 'conditions', value)}
                    placeholder="Chronic conditions, disabilities"
                    data-testid="input-conditions"
                  />
                  <EditField
                    label="Medications"
                    value={formData.medicalInfo?.medications}
                    onChange={(value) => updateFormField('medicalInfo', 'medications', value)}
                    placeholder="Current medications"
                    data-testid="input-medications"
                  />
                </div>
              </Section>

              <Section title="Blood Types" icon={<Droplets className="w-4 h-4" />}>
                <div className="space-y-3">
                  <EditField
                    label="Dad"
                    value={formData.bloodTypes?.dad}
                    onChange={(value) => updateFormField('bloodTypes', 'dad', value)}
                    placeholder="A+, B-, O+, etc."
                    data-testid="input-blood-dad"
                  />
                  <EditField
                    label="Mom"
                    value={formData.bloodTypes?.mom}
                    onChange={(value) => updateFormField('bloodTypes', 'mom', value)}
                    placeholder="A+, B-, O+, etc."
                    data-testid="input-blood-mom"
                  />
                  <EditField
                    label="Kids"
                    value={formData.bloodTypes?.kids}
                    onChange={(value) => updateFormField('bloodTypes', 'kids', value)}
                    placeholder="List all children's blood types"
                    data-testid="input-blood-kids"
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
                data-testid="input-additional-notes"
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
    </div>
  );
}