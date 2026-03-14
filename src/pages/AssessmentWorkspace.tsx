import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Clock, ChevronRight, ChevronLeft, Save, CheckCircle2 } from 'lucide-react';
import { WordSimulator } from '../components/simulators/WordSimulator';
import { ExcelSimulator } from '../components/simulators/ExcelSimulator';
import { PowerPointSimulator } from '../components/simulators/PowerPointSimulator';
import { FileManagementSimulator } from '../components/simulators/FileManagementSimulator';

export const AssessmentWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assessments, submitAssessment } = useData();
  
  const assessment = assessments.find(a => a.id === id);
  
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [taskData, setTaskData] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/assessments');
    }
    if (assessment) {
      setTimeLeft(assessment.timeLimitMinutes * 60);
    }
  }, [user, navigate, assessment]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      handleAutoSubmit();
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!assessment || !assessment.tasks || assessment.tasks.length === 0) return <div>Assessment not found or has no tasks</div>;

  const activeTask = assessment.tasks[activeTaskIndex];

  const handleTaskDataChange = (data: any) => {
    setTaskData(prev => ({ ...prev, [activeTask.id]: data }));
  };

  const handleAutoSubmit = () => {
    submitAssessment({
      studentId: user!.id,
      assessmentId: assessment.id,
      files: taskData,
    });
    alert('Time is up! Your assessment has been automatically submitted.');
    navigate('/assessments');
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit your assessment? You cannot change your answers after submitting.')) {
      submitAssessment({
        studentId: user!.id,
        assessmentId: assessment.id,
        files: taskData,
      });
      navigate('/assessments');
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderSimulator = () => {
    const type = activeTask.type;
    if (type === 'word') {
      return <WordSimulator value={taskData[activeTask.id] || ''} onChange={handleTaskDataChange} />;
    }
    if (type === 'excel') {
      return <ExcelSimulator value={taskData[activeTask.id] || []} onChange={handleTaskDataChange} />;
    }
    if (type === 'powerpoint') {
      return <PowerPointSimulator value={taskData[activeTask.id] || []} onChange={handleTaskDataChange} />;
    }
    if (type === 'file-management') {
      return <FileManagementSimulator value={taskData[activeTask.id] || []} onChange={handleTaskDataChange} />;
    }
    return <div>Unknown simulator type</div>;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{assessment.title}</h1>
          <p className="text-sm text-slate-500">Student: {user?.name}</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className={`flex items-center space-x-2 text-lg font-mono font-bold px-4 py-2 rounded-lg ${
            (timeLeft || 0) < 300 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'
          }`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft || 0)}</span>
          </div>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Submit Assessment
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Instructions & Rubric */}
        <aside className="w-80 bg-white border-r flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="font-semibold text-slate-800 mb-2">Tasks</h2>
            <div className="space-y-1">
              {assessment.tasks?.map((task, index) => (
                <button
                  key={task.id}
                  onClick={() => setActiveTaskIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTaskIndex === index 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{index + 1}. {task.title}</span>
                    {taskData[task.id] && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 flex-1">
            <h3 className="font-bold text-lg mb-2">{activeTask.title}</h3>
            <div className="prose prose-sm text-slate-600 mb-6">
              <p>{activeTask.instructions}</p>
            </div>

            <h4 className="font-semibold text-slate-800 mb-3 border-b pb-2">Grading Rubric</h4>
            <div className="space-y-4">
              {activeTask.rubric?.map(item => (
                <div key={item.id} className="bg-slate-50 p-3 rounded border text-sm">
                  <div className="flex justify-between font-medium text-slate-800 mb-1">
                    <span>{item.criterion}</span>
                    <span className="text-blue-600">{item.weightPercentage}%</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-2">{item.description}</p>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span>Rating: 1-5</span>
                    <span>Max Score: {item.maxScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Simulator Area */}
        <main className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-sm border h-full flex flex-col">
              <div className="p-4 border-b bg-slate-50 flex items-center justify-between shrink-0">
                <h2 className="font-semibold text-slate-700 flex items-center">
                  Workspace: {activeTask.title}
                </h2>
              </div>
              <div className="flex-1 p-0 overflow-hidden">
                {/* We need to make simulators fill the height */}
                <div className="h-full w-full [&>div]:h-full [&>div]:border-0 [&>div]:rounded-none">
                  {renderSimulator()}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <footer className="bg-white border-t p-4 flex justify-between items-center shrink-0">
            <Button 
              variant="outline" 
              onClick={() => setActiveTaskIndex(prev => Math.max(0, prev - 1))}
              disabled={activeTaskIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Task
            </Button>
            <span className="text-sm text-slate-500 font-medium">
              Task {activeTaskIndex + 1} of {assessment.tasks.length}
            </span>
            <Button 
              onClick={() => setActiveTaskIndex(prev => Math.min(assessment.tasks.length - 1, prev + 1))}
              disabled={activeTaskIndex === assessment.tasks.length - 1}
            >
              Next Task
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </footer>
        </main>
      </div>
    </div>
  );
};
