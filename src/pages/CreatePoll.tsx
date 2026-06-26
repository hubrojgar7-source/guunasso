import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatePollForm } from '@/components/polls/CreatePollForm';
import { createPoll } from '@/lib/polls';
import { toast } from 'sonner';

const CreatePoll = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const pollId = await createPoll(data);
      toast.success(data.status === 'draft' ? 'Draft saved successfully!' : 'Poll published successfully!');
      navigate(`/dashboard/polls/${pollId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent text-base py-3" onClick={() => navigate('/dashboard/polls')}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Polls
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create a New Poll
          </h1>
          <p className="text-base text-muted-foreground mb-8">
            Engage citizens by asking for their input on important community matters.
          </p>

          <CreatePollForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
