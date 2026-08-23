import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, ClipboardCheck, UserPlus, BookPlus, FilePlus, BarChart2, Sparkles, CalendarDays, ArrowRight } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';

const stats = { studentsTotal: 3, studentsActive: 2, coursesTotal: 3, examsTotal: 3, attemptsTotal: 1 }; // TODO: brancher l'API

const STAT_CARDS = [
  { icon: Users, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', label: 'Étudiants', value: stats.studentsTotal, sublabel: `${stats.studentsActive} actifs` },
  { icon: BookOpen, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: 'Cours', value: stats.coursesTotal, sublabel: 'cours disponibles' },
  { icon: FileText, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: 'Examens', value: stats.examsTotal, sublabel: 'examens créés' },
  { icon: ClipboardCheck, iconBg: 'bg-green-50', iconColor: 'text-green-600', label: 'Tentatives', value: stats.attemptsTotal, sublabel: 'soumissions' },
];

const QUICK_ACTIONS = [
  { to: '/admin/students', icon: UserPlus, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', title: 'Ajouter un étudiant', desc: 'Créer un nouveau compte' },
  { to: '/admin/courses', icon: BookPlus, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', title: 'Créer un cours', desc: 'Ajouter une matière' },
  { to: '/admin/exams', icon: FilePlus, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', title: 'Créer un examen', desc: 'Préparer une évaluation' },
  { to: '/admin/results', icon: BarChart2, iconBg: 'bg-green-50', iconColor: 'text-green-600', title: 'Voir les résultats', desc: 'Analyser les performances' },
];

export function AdminDashboardPage() {
  const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Administration</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-gray-500">Voici ce qui se passe sur votre plateforme.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
          <CalendarDays size={16} className="text-indigo-600" />
          <span className="text-sm font-medium capitalize text-gray-600">{today}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map(({ icon, ...card }) => (
          <StatCard key={card.label} icon={icon} {...card} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Actions rapides</h2>
        <p className="mb-4 text-sm text-gray-500">Gérez votre plateforme.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ to, icon: Icon, iconBg, iconColor, title, desc }) => (
            <Link key={title} to={to} className="group flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-transparent transition-all duration-200 hover:bg-white hover:shadow-sm hover:ring-indigo-200">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
                <Icon size={18} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-indigo-700">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <ArrowRight size={16} className="text-indigo-500 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Exam Hub</span>
            <Sparkles size={18} className="text-indigo-200" />
          </div>
          <h3 className="text-xl font-bold">Gérez vos examens simplement.</h3>
          <p className="mt-1 max-w-lg text-sm text-indigo-100">Préparez les cours, créez les évaluations et suivez les résultats de vos étudiants.</p>
          <Link to="/admin/exams" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50">
            Commencer <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
