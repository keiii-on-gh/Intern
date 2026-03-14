import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { WordSimulator } from '../../components/simulators/WordSimulator';
import { ExcelSimulator } from '../../components/simulators/ExcelSimulator';
import { PowerPointSimulator } from '../../components/simulators/PowerPointSimulator';
import { FileManagementSimulator } from '../../components/simulators/FileManagementSimulator';

export const InstructorDashboard: React.FC = () => {
  const { assessments, submissions, documents, gradeSubmission, updateDocumentStatus } = useData();
  const [viewingSubmission, setViewingSubmission] = useState<string | null>(null);
  const [taskScores, setTaskScores] = useState<Record<string, Record<string, number>>>({});

  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const pendingDocuments = documents.filter(d => d.status === 'pending');

  const handleScoreChange = (taskId: string, rubricId: string, rating: string, maxScore: number) => {
    const ratingNum = Math.min(5, Math.max(1, Number(rating)));
    const calculatedScore = (ratingNum / 5) * maxScore;
    
    setTaskScores(prev => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [rubricId]: calculatedScore
      }
    }));
  };

  const getRatingForRubric = (taskId: string, rubricId: string, maxScore: number) => {
    const score = taskScores[taskId]?.[rubricId];
    if (score === undefined) return '';
    return Math.round((score / maxScore) * 5).toString();
  };

  const handleGrade = (id: string) => {
    gradeSubmission(id, taskScores);
    setViewingSubmission(null);
    setTaskScores({});
  };

  const handleView = (subId: string) => {
    if (viewingSubmission === subId) {
      setViewingSubmission(null);
      setTaskScores({});
    } else {
      setViewingSubmission(subId);
      setTaskScores({});
    }
  };

  const renderSimulatorView = (task: any, data: any) => {
    const type = task.type;
    if (!data) return <span className="italic text-slate-400">No data submitted</span>;

    if (type === 'word') {
      return <div className="pointer-events-none opacity-80"><WordSimulator value={data} onChange={() => {}} /></div>;
    }
    if (type === 'excel') {
      return <div className="pointer-events-none opacity-80"><ExcelSimulator value={data} onChange={() => {}} /></div>;
    }
    if (type === 'powerpoint') {
      return <div className="pointer-events-none opacity-80"><PowerPointSimulator value={data} onChange={() => {}} /></div>;
    }
    if (type === 'file-management') {
      return <div className="pointer-events-none opacity-80"><FileManagementSimulator value={data} onChange={() => {}} /></div>;
    }
    
    return <div className="p-2 border rounded bg-white text-sm whitespace-pre-wrap">{String(data)}</div>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h2>
        <p className="text-slate-500">Manage student assessments and documents.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Assessments to Grade</CardTitle>
            <CardDescription>Assessments waiting for your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingSubmissions.length === 0 ? (
                <p className="text-sm text-slate-500">No pending assessments.</p>
              ) : (
                pendingSubmissions.map(sub => {
                  const assessment = assessments.find(a => a.id === sub.assessmentId);
                  const isViewing = viewingSubmission === sub.id;
                  
                  return (
                    <div key={sub.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Student ID: {sub.studentId}</p>
                          <p className="text-xs text-slate-500">{assessment?.title}</p>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(sub.id)}>
                            {isViewing ? 'Cancel' : 'Grade'}
                          </Button>
                        </div>
                      </div>
                      
                      {isViewing && assessment && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-md border border-slate-200 space-y-6">
                          <h4 className="font-semibold text-sm">Student Submissions:</h4>
                          {assessment.tasks?.map((task, i) => (
                            <div key={task.id} className="text-sm space-y-4 border-b border-slate-200 pb-6 last:border-0">
                              <p className="font-medium text-lg">{i + 1}. {task.title}</p>
                              <div className="bg-white p-2 rounded border shadow-sm max-h-[400px] overflow-y-auto">
                                {renderSimulatorView(task, sub.files?.[task.id])}
                              </div>
                              
                              <div className="bg-white p-4 rounded-md border shadow-sm space-y-4">
                                <h5 className="font-semibold text-slate-800 border-b pb-2">Grading Rubric</h5>
                                {task.rubric?.map(item => (
                                  <div key={item.id} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between p-3 bg-slate-50 rounded border">
                                    <div className="flex-1 pr-4">
                                      <p className="font-medium text-slate-800">{item.criterion} <span className="text-blue-600 text-xs ml-2">({item.weightPercentage}%)</span></p>
                                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                                    </div>
                                    <div className="flex items-center space-x-3 shrink-0">
                                      <Label htmlFor={`score-${task.id}-${item.id}`} className="text-xs font-semibold">Rating (1-5):</Label>
                                      <Input 
                                        id={`score-${task.id}-${item.id}`}
                                        type="number" 
                                        min="1" 
                                        max="5"
                                        className="w-16 h-8 text-center"
                                        value={getRatingForRubric(task.id, item.id, item.maxScore)}
                                        onChange={(e) => handleScoreChange(task.id, item.id, e.target.value, item.maxScore)}
                                      />
                                      <div className="w-16 text-right text-xs font-medium text-slate-600">
                                        / {item.maxScore} pts
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div className="pt-4 flex justify-end">
                            <Button onClick={() => handleGrade(sub.id)} className="bg-green-600 hover:bg-green-700 text-white">
                              Submit Grades
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Documents</CardTitle>
            <CardDescription>Requirements waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDocuments.length === 0 ? (
                <p className="text-sm text-slate-500">No pending documents.</p>
              ) : (
                pendingDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-slate-500">Student ID: {doc.studentId}</p>
                    </div>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => updateDocumentStatus(doc.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => updateDocumentStatus(doc.id, 'rejected')}>Reject</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
