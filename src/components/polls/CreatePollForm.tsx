import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type PollCategory, type LocationScope, type PollType, type PollStatus } from '@/lib/polls';
import { toast } from 'sonner';

interface CreatePollFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const CreatePollForm: React.FC<CreatePollFormProps> = ({ onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PollCategory>('governance');
  const [pollType, setPollType] = useState<PollType>('single');
  const [organizationName, setOrganizationName] = useState('');
  const [locationScope, setLocationScope] = useState<LocationScope>('nationwide');
  const [locationName, setLocationName] = useState('');
  
  const defaultEnd = new Date();
  defaultEnd.setDate(defaultEnd.getDate() + 7);
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);
  const [options, setOptions] = useState<string[]>(['', '']);

  const handleAddOption = () => setOptions([...options, '']);
  
  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) {
      toast.error('Polls must have at least 2 options');
      return;
    }
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (idx: number, val: string) => {
    const newOptions = [...options];
    newOptions[idx] = val;
    setOptions(newOptions);
  };

  const handleTypeChange = (val: PollType) => {
    setPollType(val);
    if (val === 'yesno') {
      setOptions(['Yes', 'No']);
    } else if (options.length === 2 && options[0] === 'Yes' && options[1] === 'No') {
      setOptions(['', '']);
    }
  };

  const handleSubmit = (status: PollStatus) => {
    if (!title.trim()) return toast.error('Title is required');
    if (!organizationName.trim()) return toast.error('Organization name is required');
    if (options.some(opt => !opt.trim())) return toast.error('All options must have text');
    if (new Date(endDate) < new Date(startDate)) return toast.error('End date must be after start date');

    onSubmit({
      title,
      description,
      category,
      pollType,
      organizationName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      locationScope,
      locationName: locationScope !== 'nationwide' ? locationName : '',
      status,
      options
    });
  };

  return (
    <div className="space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm">
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">1. Poll Information</h2>
        
        <div className="space-y-2">
          <Label htmlFor="title">Poll Title <span className="text-red-500">*</span></Label>
          <Input 
            id="title" 
            placeholder="E.g., Which public park needs renovation first?" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base py-6 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description / Context</Label>
          <Textarea 
            id="desc" 
            placeholder="Provide details to help citizens make an informed decision..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="org">Organization Name <span className="text-red-500">*</span></Label>
            <Input 
              id="org" 
              placeholder="E.g., Kathmandu Metropolitan City" 
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as PollCategory)}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="governance">Governance</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="health">Health & Sanitation</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">2. Voting Options</h2>
        
        <div className="space-y-2 mb-4">
          <Label>Poll Type</Label>
          <Select value={pollType} onValueChange={handleTypeChange}>
            <SelectTrigger className="rounded-lg w-full md:w-1/2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Choice (Radio)</SelectItem>
              <SelectItem value="multiple">Multiple Choice (Checkboxes)</SelectItem>
              <SelectItem value="yesno">Yes / No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input 
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                disabled={pollType === 'yesno'}
                className="bg-white rounded-lg"
              />
              {pollType !== 'yesno' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveOption(idx)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          
          {pollType !== 'yesno' && (
            <Button 
              variant="outline" 
              onClick={handleAddOption}
              className="mt-2 w-full border-dashed border-2 rounded-lg text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">3. Schedule & Targeting</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Location Scope</Label>
            <Select value={locationScope} onValueChange={(val) => setLocationScope(val as LocationScope)}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nationwide">Nationwide</SelectItem>
                <SelectItem value="province">Province</SelectItem>
                <SelectItem value="district">District</SelectItem>
                <SelectItem value="municipality">Municipality</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {locationScope !== 'nationwide' && (
            <div className="space-y-2">
              <Label>Specific Location Name</Label>
              <Input 
                placeholder={`E.g., Bagmati ${locationScope}`}
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t mt-8">
        <Button 
          variant="outline" 
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting}
          className="rounded-lg flex-1 py-6 text-base font-semibold"
        >
          Save as Draft
        </Button>
        <Button 
          onClick={() => handleSubmit('active')}
          disabled={isSubmitting}
          className="rounded-lg flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-6 text-base font-bold shadow-none"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Poll'}
        </Button>
      </div>

    </div>
  );
};
