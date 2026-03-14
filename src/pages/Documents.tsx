import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const Documents: React.FC = () => {
  const { user } = useAuth();
  const { documents } = useData();

  if (!user) return null;

  const displayDocs = user.role === 'student' 
    ? documents.filter(d => d.studentId === user.id)
    : documents;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <p className="text-slate-500">Manage OJT requirements and submissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Submissions</CardTitle>
          <CardDescription>All submitted documents and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">Document Title</th>
                  {user.role !== 'student' && <th className="px-4 py-3">Student ID</th>}
                  <th className="px-4 py-3">Date Submitted</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {displayDocs.map(doc => (
                  <tr key={doc.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{doc.title}</td>
                    {user.role !== 'student' && <td className="px-4 py-3">{doc.studentId}</td>}
                    <td className="px-4 py-3">{new Date(doc.submittedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {displayDocs.length === 0 && (
                  <tr>
                    <td colSpan={user.role !== 'student' ? 4 : 3} className="px-4 py-3 text-center text-slate-500">
                      No documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
