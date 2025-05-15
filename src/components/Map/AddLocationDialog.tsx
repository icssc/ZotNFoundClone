import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useState, useEffect } from "react";
import { Headphones, Shirt, Key, File, CircleDot } from 'lucide-react';
import { Calendar } from "../ui/calendar";
import Image from "next/image";

interface AddLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLocationDialog({ open, onOpenChange }: AddLocationDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    date: new Date(),
    file: null as File | null,
    isLost: true,
  });

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.name && !!formData.description;
      case 2:
        return !!formData.type;
      case 3:
        return !!formData.date;
      case 4:
        return !!formData.file;
      default:
        return true;
    }
  };

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      onOpenChange(false);
      // Reset form state
      setCurrentStep(1);
      setFormData({
        name: "",
        description: "",
        type: "",
        date: new Date(),
        file: null,
        isLost: true,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">🔑 Item Name:</Label>
              <Input 
                id="name" 
                placeholder="Ex: Airpods Pro, ..." 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}  
                value={formData.name}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description of Item:</Label>
              <Textarea 
                id="description" 
                placeholder="📝 Ex: Lost in ICS31 Lec, ..." 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                value={formData.description} 
                className="text-white"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-2 flex flex-col items-center justify-center">
            <Label htmlFor="type" className="text-white">🔍 Select Item Type:</Label>

            <div className="flex flex-wrap gap-2 items-center justify-center">
              <Button 
                variant={formData.type === "electronics" ? "default" : "outline"} 
                className={`w-48 h-48 ${formData.type === "electronics" ? "bg-black" : ""}`} 
                onClick={() => setFormData({ ...formData, type: "electronics" })}
              >
                <Headphones className="w-4 h-4 mr-2" />
                Electronics
              </Button>
              <Button 
                variant={formData.type === "clothing" ? "default" : "outline"} 
                className={`w-48 h-48 ${formData.type === "clothing" ? "bg-black" : ""}`} 
                onClick={() => setFormData({ ...formData, type: "clothing" })}
              >
                <Shirt className="w-4 h-4 mr-2" />
                Clothing
              </Button>
              <Button 
                variant={formData.type === "accessories" ? "default" : "outline"} 
                className={`w-48 h-48 ${formData.type === "accessories" ? "bg-black" : ""}`} 
                onClick={() => setFormData({ ...formData, type: "accessories" })}
              >
                <Key className="w-4 h-4 mr-2" />
                Accessories
              </Button>
              <Button 
                variant={formData.type === "documents" ? "default" : "outline"} 
                className={`w-48 h-48 ${formData.type === "documents" ? "bg-black" : ""}`} 
                onClick={() => setFormData({ ...formData, type: "documents" })}
              >
                <File className="w-4 h-4 mr-2" />
                Documents
              </Button>
              <Button 
                variant={formData.type === "other" ? "default" : "outline"} 
                className={`w-48 h-48 ${formData.type === "other" ? "bg-black" : ""}`} 
                onClick={() => setFormData({ ...formData, type: "other" })}
              >
                <CircleDot className="w-4 h-4 mr-2" />
                Other
              </Button>
            </div>
            <div className="flex items-center justify-center bg-slate-800 rounded-lg p-1 w-full max-w-xs mx-auto">
                <button
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    formData.isLost 
                      ? "bg-blue-600 text-white" 
                      : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setFormData({ ...formData, isLost: true })}
                >
                  Lost Item
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    !formData.isLost 
                      ? "bg-blue-600 text-white" 
                      : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setFormData({ ...formData, isLost: false })}
                >
                  Found Item
                </button>
              </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-2 flex flex-col justify-center items-center">
            <Label htmlFor="date" className="text-white">📅 When was it lost/found?</Label>
            <Calendar 
              mode="single" 
              selected={formData.date} 
              onSelect={(newDate) => {
                setFormData({ ...formData, date: newDate || new Date() });
              }}
              className="rounded-md border shadow text-white"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-2">
            <Label htmlFor="file" className="text-white">📸 Upload an image:</Label>
            <Input 
              id="file" 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData({ ...formData, file });
              }}
              className="py-48 bg-slate-400"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg text-white">Confirm and Submit</h3>
            <div className="flex gap-4">
              <div className="bg-gray-800 p-4 rounded-md space-y-2 w-64 h-64">
                <Image src={formData.file ? URL.createObjectURL(formData.file) : ''} alt="Item Image" className="w-full h-full object-cover" width={256} height={256} />
              </div>
            <div className="bg-gray-800 p-4 rounded-md space-y-2">
              <h3 className="font-medium text-lg text-white"><strong>Item Information:</strong></h3>
              <p className="text-white"><strong>Name:</strong> {formData.name}</p>
              <p className="text-white"><strong>Description:</strong> {formData.description}</p>
              <p className="text-white"><strong>Type:</strong> {formData.type}</p>
              <p className="text-white"><strong>Date:</strong> {formData.date.toLocaleDateString()}</p>
              <p className="text-white"><strong>Image:</strong> {formData.file ? formData.file.name : 'None'}</p>
            </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-700 !max-w-fit">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Location</DialogTitle>
        </DialogHeader>
        
        {/* Breadcrumb Navigation */}
        <div className="w-full bg-slate-800 p-3 rounded-md mb-4">
          <div className="flex items-center justify-around w-full space-x-4">  
            {/* Steps with connecting lines between them */}
            {[
              { number: 1, label: "First", sublabel: "Enter Info", active: currentStep === 1 },
              { number: 2, label: "Second", sublabel: "Select Type", active: currentStep === 2 },
              { number: 3, label: "Third", sublabel: "Choose Date", active: currentStep === 3 },
              { number: 4, label: "Fourth", sublabel: "File Upload", active: currentStep === 4 },
              { number: 5, label: "Fifth", sublabel: "Check Info", active: currentStep === 5 },
            ].map((step, index, array) => (
              <div className="flex items-center" key={step.number} >
                <div className="flex flex-col items-center z-10 relative">
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-white
                      ${step.active ? 'border-2 border-blue-400' : currentStep > step.number ? 'bg-blue-400' : 'bg-slate-700'} mb-1`}
                  >
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <div className="text-xs text-white font-medium">{step.label}</div>
                  <div className="text-xs text-slate-400">{step.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="py-4 space-y-4">
          {renderStepContent()}
          
          <div className="flex justify-between space-x-2 pt-4">
            <div>
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                className="bg-red-100 hover:bg-red-200 text-black" 
                onClick={() => {
                  onOpenChange(false);
                  setCurrentStep(1);
                }}
              >
                Cancel
              </Button>
              <Button 
                disabled={!isStepValid()} 
                onClick={handleContinue}
              >
                {currentStep === 5 ? 'Submit' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}