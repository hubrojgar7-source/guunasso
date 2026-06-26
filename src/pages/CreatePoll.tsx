import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatePollForm } from '@/components/polls/CreatePollForm';
import { createPoll } from '@/lib/polls';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

const CreatePoll = () => {
  const navigate = useNavigate();
  const { profile, loading } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthorized = profile?.userType === 'farmer' || profile?.userType === 'admin' || profile?.userType === 'organization';

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

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="p-10 text-center max-w-lg mx-auto mt-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          Only verified organizations and administrators can create civic polls.
        </p>
        <Button onClick={() => navigate('/dashboard/polls')}>Return to Polls</Button>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent" onClick={() => navigate('/dashboard/polls')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Polls
        </Button>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create a <span className="text-[#10B981]">New Poll</span>
          </h1>
          <p className="text-gray-500 mb-8">
            Engage citizens by asking for their input on important community matters.
          </p>
          
          <CreatePollForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
