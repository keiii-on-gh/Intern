import React, { useEffect, useState } from 'react';
import { User } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export const CoordinatorDashboard: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      setStudents(users.filter(u => u.role === 'student'));
    } catch (e) {
      setStudents([]);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Coordinator Dashboard</h2>
        <p className="text-slate-500">Overview of student interns deployment.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BSCS Interns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.course === 'BSCS').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BSIS/BSIT Interns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.course === 'BSIS' || s.course === 'BSIT').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interns List</CardTitle>
          <CardDescription>All registered student interns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">ID Number</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Year & Section</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{student.id}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">{student.course}</td>
                    <td className="px-4 py-3">{student.year} - {student.section}</td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-slate-500">No students registered yet.</td>
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
