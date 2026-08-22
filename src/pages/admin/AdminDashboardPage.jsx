import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, ClipboardCheck, UserPlus, BookPlus, FilePlus, BarChart2, Sparkles } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';

const stats = { studentsTotal: 3, studentsActive: 2, coursesTotal: 3, examsTotal: 3, attemptsTotal: 1 }; // TODO: brancher l'API

const QUICK_ACTIONS = [
  { to: '/admin/students', icon: UserPlus, title: 'Ajouter un étudiant', desc: 'Créer un nouveau compte' },
  { to: '/admin/courses', icon: BookPlus, title: 'Créer un cours', desc: 'Ajouter une matière' },
  { to: '/admin/exams', icon: FilePlus, title: 'Créer un examen', desc: 'Préparer une évaluation' },
  { to: '/admin/results', icon: BarChart2, title: 'Voir les résultats', desc: 'Analyser les performances' },
];

export function AdminDashboardPage() {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Administration</p>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-500">Voici ce qui se passe sur votre plateforme.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={Users} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Étudiants" value={stats.studentsTotal} sublabel={`${stats.studentsActive} actifs`} />
        <StatCard icon={BookOpen} iconBg="bg-blue-50" iconColor="text-blue-600" label="Cours" value={stats.coursesTotal} sublabel="cours disponibles" />
        <StatCard icon={FileText} iconBg="bg-purple-50" iconColor="text-purple-600" label="Examens" value={stats.examsTotal} sublabel="examens créés" />
        <StatCard icon={ClipboardCheck} iconBg="bg-green-50" iconColor="text-green-600" label="Tentatives" value={stats.attemptsTotal} sublabel="soumissions" />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Actions rapides</h2>
        <p className="mb-4 text-sm text-gray-500">Gérez votre plateforme.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ to, icon: Icon, title, desc }) => (
            <Link key={title} to={to} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
              <Icon size={18} className="text-gray-500" />
              <div><p className="text-sm font-semibold text-gray-900">{title}</p><p className="text-xs text-gray-400">{desc}</p></div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-indigo-600 p-6 text-white">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-indigo-200">Exam Hub</span>
          <Sparkles size={18} className="text-indigo-200" />
        </div>
        <h3 className="text-xl font-bold">Gérez vos examens simplement.</h3>
        <p className="mt-1 text-sm text-indigo-100">Préparez les cours, créez les évaluations et suivez les résultats de vos étudiants.</p>
      </div>
    </div>
  );
}