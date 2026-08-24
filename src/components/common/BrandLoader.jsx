import { Loader } from './Loader';

export function BrandLoader({ label = 'Chargement...' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <img src="/Logo-Exam-Hub.png" alt="" className="h-12 w-12 rounded-xl object-contain shadow-md shadow-primary-200" />
      <p className="text-sm font-semibold text-navy">Exam Hub</p>
      <Loader label={label} />
    </div>
  );
}
