import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { PollOption, PollType } from '@/lib/polls';

interface VotingInterfaceProps {
  options: PollOption[];
  pollType: PollType;
  selectedOptionIds: string[];
  onSelectOptions: (ids: string[]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  options,
  pollType,
  selectedOptionIds,
  onSelectOptions,
  onSubmit,
  isSubmitting,
  disabled = false,
}) => {
  const isMultiple = pollType === 'multiple';

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onSelectOptions([...selectedOptionIds, optionId]);
    } else {
      onSelectOptions(selectedOptionIds.filter((id) => id !== optionId));
    }
  };

  const handleRadioChange = (val: string) => {
    onSelectOptions([val]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
        {isMultiple ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Select multiple options
            </p>
            {options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center space-x-4 px-8 py-5 rounded-lg border transition-colors ${
                  selectedOptionIds.includes(opt.id)
                    ? 'border-[#10B981] bg-[#10B981]/5'
                    : 'border-transparent hover:bg-gray-100'
                }`}
              >
                <Checkbox
                  id={opt.id}
                  checked={selectedOptionIds.includes(opt.id)}
                  onCheckedChange={(c) => handleCheckboxChange(opt.id, c === true)}
                  disabled={disabled || isSubmitting}
                  className="w-5 h-5 rounded-md"
                />
                <Label
                  htmlFor={opt.id}
                  className="flex-1 cursor-pointer text-base text-gray-700 font-medium"
                >
                  {opt.text}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup
            value={selectedOptionIds[0] || ''}
            onValueChange={handleRadioChange}
            className="space-y-3"
            disabled={disabled || isSubmitting}
          >
            <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Select one option
            </p>
            {options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center space-x-4 px-8 py-5 rounded-lg border transition-colors ${
                  selectedOptionIds[0] === opt.id
                    ? 'border-[#10B981] bg-[#10B981]/5'
                    : 'border-transparent hover:bg-gray-100'
                }`}
              >
                <RadioGroupItem value={opt.id} id={opt.id} className="w-5 h-5" />
                <Label
                  htmlFor={opt.id}
                  className="flex-1 cursor-pointer text-base text-gray-700 font-medium"
                >
                  {opt.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      <Button
        onClick={onSubmit}
        disabled={selectedOptionIds.length === 0 || isSubmitting || disabled}
        className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-lg py-6 text-lg font-bold shadow-none transition-all"
      >
        {isSubmitting ? 'Submitting Vote...' : 'Submit Vote'}
      </Button>
    </div>
  );
};
