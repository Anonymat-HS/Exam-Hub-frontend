import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, UserPlus, BookPlus, FilePlus, BarChart2, Sparkles, CalendarDays, ArrowRight } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Loader } from '../../components/common/Loader';
import { studentService } from '../../api/studentService';
import { courseService } from '../../api/courseService';
import { examService } from '../../api/examService';


const QUICK_ACTIONS = [
  { to: '/admin/students', icon: UserPlus, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', title: 'Ajouter un étudiant', desc: 'Créer un nouveau compte' },
  { to: '/admin/courses', icon: BookPlus, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', title: 'Créer un cours', desc: 'Ajouter une matière' },
  { to: '/admin/exams', icon: FilePlus, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', title: 'Créer un examen', desc: 'Préparer une évaluation' },
  { to: '/admin/results', icon: BarChart2, iconBg: 'bg-green-50', iconColor: 'text-green-600', title: 'Voir les résultats', desc: 'Analyser les performances' },
];

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ studentsTotal: 0, studentsActive: 0, coursesTotal: 0, examsTotal: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  useEffect(() => {
    Promise.all([
      studentService.getStudents(),
      courseService.getCourses(),
      examService.getExams(),
    ]).then(([students, courses, exams]) => {
      setStats({
        studentsTotal: Array.isArray(students) ? students.length : 0,
        studentsActive: Array.isArray(students) ? students.filter((s) => s.active).length : 0,
        coursesTotal: Array.isArray(courses) ? courses.length : 0,
        examsTotal: Array.isArray(exams) ? exams.length : 0,
      });
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;

  const STAT_CARDS = [
    { icon: Users, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', label: 'Étudiants', value: stats.studentsTotal, sublabel: `${stats.studentsActive} actifs` },
    { icon: BookOpen, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', label: 'Cours', value: stats.coursesTotal, sublabel: 'cours disponibles' },
    { icon: FileText, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', label: 'Examens', value: stats.examsTotal, sublabel: 'examens créés' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600">Administration</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">Tableau de bord</h1>
          <p className="mt-1 text-gray-500">Voici ce qui se passe sur votre plateforme.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
          <CalendarDays size={16} className="text-primary-600" />
          <span className="text-sm font-medium capitalize text-gray-600">{today}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {STAT_CARDS.map(({ icon, ...card }) => (
          <StatCard key={card.label} icon={icon} {...card} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-navy">Actions rapides</h2>
        <p className="mb-4 text-sm text-gray-500">Gérez votre plateforme.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ to, icon: Icon, iconBg, iconColor, title, desc }) => (
            <Link key={title} to={to} className="group flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-transparent transition-all duration-200 hover:bg-white hover:shadow-sm hover:ring-primary-200">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
                <Icon size={18} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy transition-colors group-hover:text-primary-700">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <ArrowRight size={16} className="text-primary-500 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 p-6 text-white">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Exam Hub</span>
            <Sparkles size={18} className="text-primary-200" />
          </div>
          <h3 className="text-xl font-bold">Gérez vos examens simplement.</h3>
          <p className="mt-1 max-w-lg text-sm text-primary-100">Préparez les cours, créez les évaluations et suivez les résultats de vos étudiants.</p>
          <Link to="/admin/exams" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50">
            Commencer <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
