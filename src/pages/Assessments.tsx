import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';

export const Assessments: React.FC = () => {
  const { user } = useAuth();
  const { assessments, submissions } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  const mySubmissions = submissions.filter(s => s.studentId === user.id);

  const handleStart = (id: string) => {
    navigate(`/assessments/${id}/take`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Digital Skills Assessments</h2>
        <p className="text-slate-500">Perform the required tasks within the time limit.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments.map(assessment => {
          const submission = mySubmissions.find(s => s.assessmentId === assessment.id);
          const isCompleted = !!submission;

          return (
            <Card key={assessment.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-slate-500 mb-4 space-y-1">
                  <p>• {assessment.tasks?.length || 0} practical tasks</p>
                  <p>• {assessment.timeLimitMinutes || 60} minutes time limit</p>
                </div>
                {isCompleted && (
                  <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                    <p className="text-sm font-medium">Status: {submission.status}</p>
                    {submission.status === 'graded' && (
                      <p className="text-sm font-bold text-green-600 mt-1">Score: {submission.score} / {assessment.tasks?.reduce((acc, t) => acc + (t.rubric?.reduce((rAcc, r) => rAcc + r.maxScore, 0) || 0), 0) || 0}</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {user.role === 'student' && !isCompleted && (
                  <Button className="w-full" onClick={() => handleStart(assessment.id)}>
                    Start Assessment
                  </Button>
                )}
                {user.role === 'student' && isCompleted && (
                  <Button className="w-full" variant="secondary" disabled>Completed</Button>
                )}
                {user.role === 'instructor' && (
                  <Button className="w-full" variant="outline">View Assessment Details</Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
