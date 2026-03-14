import React, { useState, useEffect } from 'react';
import { useAuth, User } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';

export const Agencies: React.FC = () => {
  const { user } = useAuth();
  const { agencies, addAgency, assignInternToAgency, submissions } = useData();
  const [students, setStudents] = useState<User[]>([]);
  
  // Form state for adding agency
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredScore, setRequiredScore] = useState('');

  // Form state for assigning intern
  const [selectedAgency, setSelectedAgency] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      setStudents(users.filter(u => u.role === 'student'));
    } catch (e) {
      setStudents([]);
    }
  }, []);

  if (!user) return null;

  const handleAddAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description && requiredScore) {
      addAgency({
        name,
        description,
        requiredScore: Number(requiredScore)
      });
      setName('');
      setDescription('');
      setRequiredScore('');
    }
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgency && selectedStudent) {
      assignInternToAgency(selectedAgency, selectedStudent);
      setSelectedAgency('');
      setSelectedStudent('');
    }
  };

  // Helper to get student's average score
  const getStudentAverage = (studentId: string) => {
    const studentSubs = submissions.filter(s => s.studentId === studentId && s.score !== undefined);
    if (studentSubs.length === 0) return 0;
    const total = studentSubs.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(total / studentSubs.length);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Partner Agencies</h2>
        <p className="text-slate-500">View and manage OJT deployment agencies.</p>
      </div>

      {user.role === 'coordinator' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add New Agency</CardTitle>
              <CardDescription>Register a new partner agency for deployment.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAgency} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agency Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description / Role</Label>
                  <Input id="description" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score">Required Assessment Score (%)</Label>
                  <Input id="score" type="number" min="0" max="100" value={requiredScore} onChange={e => setRequiredScore(e.target.value)} required />
                </div>
                <Button type="submit">Add Agency</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assign Intern</CardTitle>
              <CardDescription>Deploy an intern to a partner agency.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssign} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agencySelect">Select Agency</Label>
                  <Select id="agencySelect" value={selectedAgency} onChange={e => setSelectedAgency(e.target.value)} required>
                    <option value="">-- Select Agency --</option>
                    {agencies.map(a => (
                      <option key={a.id} value={a.id}>{a.name} (Req: {a.requiredScore}%)</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentSelect">Select Student Intern</Label>
                  <Select id="studentSelect" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
                    <option value="">-- Select Student --</option>
                    {students.map(s => {
                      const avg = getStudentAverage(s.id);
                      return (
                        <option key={s.id} value={s.id}>{s.name} - {s.id} (Avg Score: {avg}%)</option>
                      );
                    })}
                  </Select>
                </div>
                <Button type="submit" variant="secondary">Assign Intern</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agencies.length === 0 ? (
          <p className="text-slate-500 col-span-full">No partner agencies registered yet.</p>
        ) : (
          agencies.map(agency => {
            const isStudentAssigned = user.role === 'student' && agency.assignedInterns.includes(user.id);
            
            return (
              <Card key={agency.id} className={isStudentAssigned ? 'border-green-500 shadow-md' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{agency.name}</CardTitle>
                    {isStudentAssigned && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Your Assignment
                      </span>
                    )}
                  </div>
                  <CardDescription>{agency.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Required Score:</span>
                      <span className="font-medium">{agency.requiredScore}%</span>
                    </div>
                    {user.role !== 'student' && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Assigned Interns:</span>
                        <span className="font-medium">{agency.assignedInterns.length}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                {user.role !== 'student' && agency.assignedInterns.length > 0 && (
                  <CardFooter className="bg-slate-50 border-t p-4 flex-col items-start">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Assigned Students</p>
                    <ul className="text-sm space-y-1 w-full">
                      {agency.assignedInterns.map(id => {
                        const student = students.find(s => s.id === id);
                        return <li key={id} className="text-slate-700 truncate">• {student?.name || id}</li>;
                      })}
                    </ul>
                  </CardFooter>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
