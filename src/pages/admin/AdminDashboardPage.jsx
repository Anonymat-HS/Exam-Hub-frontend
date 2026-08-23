import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, UserPlus, BookPlus, FilePlus, BarChart2, CalendarDays } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Loader } from '../../components/common/Loader';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import { examService } from '../../services/examService';

const MOCK_STUDENTS = [{ active: true }, { active: false }, { active: true }];
const MOCK_COURSES = [1, 2, 3];
const MOCK_EXAMS = [1, 2, 3];

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ studentsTotal: 0, studentsActive: 0, coursesTotal: 0, examsTotal: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      studentService.getStudents(),
      courseService.getCourses(),
      examService.getExams(),
    ]).then(([studentsResult, coursesResult, examsResult]) => {
      const students = studentsResult.status === 'fulfilled' && Array.isArray(studentsResult.value)
        ? studentsResult.value : MOCK_STUDENTS;
      const courses = coursesResult.status === 'fulfilled' && Array.isArray(coursesResult.value)
        ? coursesResult.value : MOCK_COURSES;
      const exams = examsResult.status === 'fulfilled' && Array.isArray(examsResult.value)
        ? examsResult.value : MOCK_EXAMS;

      setStats({
        studentsTotal: students.length,
        studentsActive: students.filter((s) => s.active).length,
        coursesTotal: courses.length,
        examsTotal: exams.length,
      });
    }).finally(() => setIsLoading(false));
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const STAT_CARDS = [
    { icon: Users, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', label: 'Étudiants', value: stats.studentsTotal, sublabel: `${stats.studentsActive} actifs` },
    { icon: BookOpen, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: 'Cours', value: stats.coursesTotal, sublabel: 'cours disponibles' },
    { icon: FileText, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: 'Examens', value: stats.examsTotal, sublabel: 'examens créés' },
  ];

  const QUICK_ACTIONS = [
    { to: '/admin/students', icon: UserPlus, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', title: 'Ajouter un étudiant', desc: 'Créer un nouveau compte' },
    { to: '/admin/courses', icon: BookPlus, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', title: 'Créer un cours', desc: 'Ajouter une matière' },
    { to: '/admin/exams', icon: FilePlus, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', title: 'Créer un examen', desc: 'Préparer une évaluation' },
    { to: '/admin/results', icon: BarChart2, iconBg: 'bg-green-50', iconColor: 'text-green-600', title: 'Voir les résultats', desc: 'Analyser les performances' },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Administration</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">Vue d'ensemble de votre plateforme.</p>
        </div>
        <span className="flex items-center gap-2 text-sm text-gray-400">
          <CalendarDays size={16} />
          {formattedDate}
        </span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Actions rapides</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ to, icon: Icon, iconBg, iconColor, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
