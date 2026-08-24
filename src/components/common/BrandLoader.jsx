import { Loader } from './Loader';

export function BrandLoader({ label = 'Chargement...' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-lg font-bold text-white shadow-md shadow-primary-200">
        EH
      </div>
      <p className="text-sm font-semibold text-navy">Exam Hub</p>
      <Loader label={label} />
    </div>
  );
}
