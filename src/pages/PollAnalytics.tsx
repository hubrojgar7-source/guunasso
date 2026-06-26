import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Download, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPollResults, getPollById, type Poll, type PollResults as PollResultsType } from '@/lib/polls';
import { useAuthContext } from '@/lib/AuthProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10B981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

const PollAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResultsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      loadData(id);
    }
  }, [id, user]);

  const loadData = async (pollId: string) => {
    setIsLoading(true);
    try {
      const [p, r] = await Promise.all([getPollById(pollId), getPollResults(pollId)]);
      setPoll(p);
      setResults(r);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!poll || !results) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Option,Votes,Percentage\n";
    
    results.options.forEach(opt => {
      csvContent += `"${opt.text}",${opt.voteCount},${opt.percentage}%\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `poll_results_${poll.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#10B981]" />
      </div>
    );
  }

  if (!poll || !results || poll.createdBy !== user?.uid) {
    return (
      <div className="p-10 text-center max-w-lg mx-auto mt-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Not Found or Unauthorized</h2>
        <Button onClick={() => navigate('/dashboard/polls')} className="bg-[#10B981] hover:bg-[#059669] text-white border-0 shadow-none">Back to Polls</Button>
      </div>
    );
  }

  const chartData = results.options.map(opt => ({
    name: opt.text.length > 20 ? opt.text.substring(0, 20) + '...' : opt.text,
    fullText: opt.text,
    votes: opt.voteCount
  }));

  return (
    <div className="py-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => navigate(`/dashboard/polls/${poll.id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Poll
          </Button>
          <Button variant="outline" onClick={handleExportCSV} className="rounded-lg">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Poll <span className="text-[#10B981]">Analytics</span>
          </h1>
          <p className="text-gray-500 text-lg">{poll.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center h-40">
            <p className="text-gray-500 font-medium mb-2 uppercase tracking-wider text-sm">Total Votes</p>
            <p className="text-5xl font-black text-[#10B981]">{results.totalVotes.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center h-40">
            <p className="text-gray-500 font-medium mb-2 uppercase tracking-wider text-sm">Winning Option</p>
            <p className="text-xl font-bold text-[#10B981] line-clamp-2">
              {results.winner ? results.winner.text : 'Tie / No Votes'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center h-40">
            <p className="text-gray-500 font-medium mb-2 uppercase tracking-wider text-sm">Status</p>
            <p className="text-2xl font-bold text-gray-900 capitalize">{poll.status}</p>
            <p className="text-sm text-gray-400 mt-1">Ends: {poll.endDate.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-[#10B981]" /> Vote Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="votes" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <PieChartIcon className="w-5 h-5 mr-2 text-[#10B981]" /> Percentage Breakdown
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="votes"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [value, 'Votes']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {chartData.map((entry, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollAnalytics;
