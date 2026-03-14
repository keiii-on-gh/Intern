import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, User } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    course: 'BSCS',
    year: '3rd Year',
    section: 'A',
    password: '',
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      ...formData,
      role: 'student',
    };
    register(newUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Student Intern Registration</CardTitle>
          <CardDescription className="text-center">
            Create an account to access the OJT Digital Skill Assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID Number</Label>
              <Input id="id" name="id" type="text" required value={formData.id} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select id="course" name="course" value={formData.course} onChange={handleChange}>
                  <option value="BSCS">BSCS</option>
                  <option value="BSIS">BSIS</option>
                  <option value="BSIT">BSIT</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select id="year" name="year" value={formData.year} onChange={handleChange}>
                  {formData.course === 'BSCS' ? (
                    <option value="3rd Year">3rd Year</option>
                  ) : (
                    <option value="4th Year">4th Year</option>
                  )}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input id="section" name="section" type="text" required value={formData.section} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-slate-500">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-slate-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
