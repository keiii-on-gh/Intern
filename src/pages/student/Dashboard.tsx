import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { assessments, submissions, documents, submitDocument } = useData();
  const [docTitle, setDocTitle] = useState('');

  if (!user) return null;

  const mySubmissions = submissions.filter(s => s.studentId === user.id);
  const myDocuments = documents.filter(d => d.studentId === user.id);

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docTitle) {
      submitDocument({
        studentId: user.id,
        title: docTitle,
      });
      setDocTitle('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h2>
        <p className="text-slate-500">Here is an overview of your OJT progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mySubmissions.length} / {assessments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myDocuments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mySubmissions.filter(s => s.score !== undefined).length > 0 
                ? (mySubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / mySubmissions.filter(s => s.score !== undefined).length).toFixed(1) 
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Your latest assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mySubmissions.length === 0 ? (
                <p className="text-sm text-slate-500">No assessments completed yet.</p>
              ) : (
                mySubmissions.map(sub => {
                  const assessment = assessments.find(a => a.id === sub.assessmentId);
                  return (
                    <div key={sub.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{assessment?.title}</p>
                        <p className="text-xs text-slate-500">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="font-bold">
                        {sub.status === 'graded' ? `${sub.score}%` : 'Pending'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Document</CardTitle>
            <CardDescription>Upload your OJT requirements here</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDocSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="docTitle">Document Title</Label>
                <Input 
                  id="docTitle" 
                  placeholder="e.g. Weekly Report 1" 
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Upload (Simulation)</Label>
                <Input id="file" type="file" />
              </div>
              <Button type="submit">Submit Document</Button>
            </form>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Recent Documents</h4>
              <div className="space-y-2">
                {myDocuments.length === 0 ? (
                  <p className="text-xs text-slate-500">No documents submitted.</p>
                ) : (
                  myDocuments.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                      <span>{doc.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
