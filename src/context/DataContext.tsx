import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RubricItem {
  id: string;
  criterion: string;
  weightPercentage: number;
  maxScore: number;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'word' | 'excel' | 'powerpoint' | 'file-management';
  instructions: string;
  rubric: RubricItem[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  tasks: Task[];
}

export interface Submission {
  id: string;
  studentId: string;
  assessmentId: string;
  files: Record<string, any>; // taskId -> simulator data
  taskScores?: Record<string, Record<string, number>>; // taskId -> rubricItemId -> rating (1-5)
  score?: number;
  status: 'submitted' | 'graded';
  submittedAt: string;
}

export interface Document {
  id: string;
  studentId: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  fileUrl?: string;
}

export interface Agency {
  id: string;
  name: string;
  description: string;
  requiredScore: number;
  assignedInterns: string[]; // array of student IDs
}

interface DataContextType {
  assessments: Assessment[];
  submissions: Submission[];
  documents: Document[];
  agencies: Agency[];
  submitAssessment: (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => void;
  gradeSubmission: (submissionId: string, taskScores: Record<string, Record<string, number>>) => void;
  submitDocument: (doc: Omit<Document, 'id' | 'submittedAt' | 'status'>) => void;
  updateDocumentStatus: (docId: string, status: 'approved' | 'rejected') => void;
  addAgency: (agency: Omit<Agency, 'id' | 'assignedInterns'>) => void;
  assignInternToAgency: (agencyId: string, studentId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialAssessments: Assessment[] = [
  {
    id: 'a1',
    title: 'Digital Skills Assessment',
    description: 'Comprehensive assessment covering MS Word, Excel, PowerPoint, and File Management.',
    timeLimitMinutes: 120,
    tasks: [
      {
        id: 't1',
        title: 'MS Word',
        type: 'word',
        instructions: 'Create a document with a title page, body text with formatting, tables, images with captions, and header/footer. Save it in the correct location with the specified file name.',
        rubric: [
          { id: 'r1', criterion: 'File Name & File Location', weightPercentage: 10, maxScore: 10, description: 'Task/Instruction as our Description.' },
          { id: 'r2', criterion: 'Title Page', weightPercentage: 10, maxScore: 10, description: 'Task/Instruction as our Description.' },
          { id: 'r3', criterion: 'Body and Formatting', weightPercentage: 25, maxScore: 15, description: 'Task/Instruction as our Description.' },
          { id: 'r4', criterion: 'Tables and Images with Captions', weightPercentage: 30, maxScore: 18, description: 'Task/Instruction as our Description.' },
          { id: 'r5', criterion: 'Header and Footer', weightPercentage: 25, maxScore: 15, description: 'Task/Instruction as our Description.' }
        ]
      },
      {
        id: 't2',
        title: 'MS Excel',
        type: 'excel',
        instructions: 'Create a spreadsheet with student data, apply formatting and conditional formatting, use formulas for computation on Sheet 1, summary formulas on Sheet 2, and create a chart with labels.',
        rubric: [
          { id: 'r1', criterion: 'File Name & File Location', weightPercentage: 5, maxScore: 3, description: 'Task/Instruction as our Description.' },
          { id: 'r2', criterion: 'Table Columns and Student Data', weightPercentage: 10, maxScore: 6, description: 'Task/Instruction as our Description.' },
          { id: 'r3', criterion: 'Formatting and Conditional Formatting', weightPercentage: 20, maxScore: 12, description: 'Task/Instruction as our Description.' },
          { id: 'r4', criterion: 'Computation and Formula (Sheet 1)', weightPercentage: 30, maxScore: 18, description: 'Task/Instruction as our Description.' },
          { id: 'r5', criterion: 'Summary Formulas (Sheet 2)', weightPercentage: 20, maxScore: 12, description: 'Task/Instruction as our Description.' },
          { id: 'r6', criterion: 'Chart with Labels', weightPercentage: 15, maxScore: 9, description: 'Task/Instruction as our Description.' }
        ]
      },
      {
        id: 't3',
        title: 'MS PowerPoint',
        type: 'powerpoint',
        instructions: 'Create a 5-slide presentation with bullet formatting, a design theme, proper font sizing, slide transitions, animations, and a chart/infographic/SmartArt.',
        rubric: [
          { id: 'r1', criterion: 'File Name & File Location', weightPercentage: 5, maxScore: 3, description: 'Task/Instruction as our Description.' },
          { id: 'r2', criterion: 'Five Slides and Bullet Formatting', weightPercentage: 15, maxScore: 9, description: 'Task/Instruction as our Description.' },
          { id: 'r3', criterion: 'Design Theme and Font Sizing', weightPercentage: 15, maxScore: 9, description: 'Task/Instruction as our Description.' },
          { id: 'r4', criterion: 'Slide Transitions and Animations', weightPercentage: 25, maxScore: 15, description: 'Task/Instruction as our Description.' },
          { id: 'r5', criterion: 'Chart / Infographic / SmartArt', weightPercentage: 40, maxScore: 24, description: 'Task/Instruction as our Description.' }
        ]
      },
      {
        id: 't4',
        title: 'File Management',
        type: 'file-management',
        instructions: 'Create folders, move files, modify file properties and comments, set secure/hidden attributes, compress files, and backup to a specific location.',
        rubric: [
          { id: 'r1', criterion: 'Folder Creation and File Moving', weightPercentage: 15, maxScore: 9, description: 'Task/Instruction as our Description.' },
          { id: 'r2', criterion: 'File Properties and Comments', weightPercentage: 20, maxScore: 12, description: 'Task/Instruction as our Description.' },
          { id: 'r3', criterion: 'Secure File and Hidden Attributes', weightPercentage: 25, maxScore: 15, description: 'Task/Instruction as our Description.' },
          { id: 'r4', criterion: 'Compression (Individual and Final)', weightPercentage: 30, maxScore: 18, description: 'Task/Instruction as our Description.' },
          { id: 'r5', criterion: 'File Location (Backup Storage)', weightPercentage: 10, maxScore: 6, description: 'Task/Instruction as our Description.' }
        ]
      }
    ]
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);

  useEffect(() => {
    const storedAssessments = localStorage.getItem('assessments');
    if (storedAssessments) {
      try {
        const parsed = JSON.parse(storedAssessments);
        // Check if the stored data uses the old 'questions' structure instead of 'tasks' or is missing 'rubric'
        if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].tasks || parsed[0].tasks.length === 0 || !parsed[0].tasks[0].rubric) {
          setAssessments(initialAssessments);
          localStorage.setItem('assessments', JSON.stringify(initialAssessments));
        } else {
          setAssessments(parsed);
        }
      } catch (e) {
        setAssessments(initialAssessments);
        localStorage.setItem('assessments', JSON.stringify(initialAssessments));
      }
    } else {
      setAssessments(initialAssessments);
      localStorage.setItem('assessments', JSON.stringify(initialAssessments));
    }

    const storedSubmissions = localStorage.getItem('submissions');
    if (storedSubmissions) {
      try {
        setSubmissions(JSON.parse(storedSubmissions));
      } catch (e) {
        setSubmissions([]);
      }
    }

    const storedDocuments = localStorage.getItem('documents');
    if (storedDocuments) {
      try {
        setDocuments(JSON.parse(storedDocuments));
      } catch (e) {
        setDocuments([]);
      }
    }

    const storedAgencies = localStorage.getItem('agencies');
    if (storedAgencies) {
      try {
        setAgencies(JSON.parse(storedAgencies));
      } catch (e) {
        setAgencies([]);
      }
    }
  }, []);

  const submitAssessment = (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => {
    const newSubmission: Submission = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };
    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
  };

  const gradeSubmission = (submissionId: string, taskScores: Record<string, Record<string, number>>) => {
    let totalScore = 0;
    Object.values(taskScores).forEach(taskRubricScores => {
      Object.values(taskRubricScores).forEach(score => {
        totalScore += score;
      });
    });
    const updatedSubmissions = submissions.map(sub => 
      sub.id === submissionId ? { ...sub, taskScores, score: totalScore, status: 'graded' as const } : sub
    );
    setSubmissions(updatedSubmissions);
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
  };

  const submitDocument = (doc: Omit<Document, 'id' | 'submittedAt' | 'status'>) => {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    localStorage.setItem('documents', JSON.stringify(updatedDocs));
  };

  const updateDocumentStatus = (docId: string, status: 'approved' | 'rejected') => {
    const updatedDocs = documents.map(doc => 
      doc.id === docId ? { ...doc, status } : doc
    );
    setDocuments(updatedDocs);
    localStorage.setItem('documents', JSON.stringify(updatedDocs));
  };

  const addAgency = (agency: Omit<Agency, 'id' | 'assignedInterns'>) => {
    const newAgency: Agency = {
      ...agency,
      id: Date.now().toString(),
      assignedInterns: [],
    };
    const updatedAgencies = [...agencies, newAgency];
    setAgencies(updatedAgencies);
    localStorage.setItem('agencies', JSON.stringify(updatedAgencies));
  };

  const assignInternToAgency = (agencyId: string, studentId: string) => {
    const updatedAgencies = agencies.map(agency => {
      // Remove student from any other agency first
      const filteredInterns = agency.assignedInterns.filter(id => id !== studentId);
      if (agency.id === agencyId) {
        return { ...agency, assignedInterns: [...filteredInterns, studentId] };
      }
      return { ...agency, assignedInterns: filteredInterns };
    });
    setAgencies(updatedAgencies);
    localStorage.setItem('agencies', JSON.stringify(updatedAgencies));
  };

  return (
    <DataContext.Provider value={{ 
      assessments, submissions, documents, agencies, 
      submitAssessment, gradeSubmission, submitDocument, updateDocumentStatus, addAgency, assignInternToAgency 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
