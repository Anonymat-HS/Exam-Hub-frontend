import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SplashScreenPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/admin', { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy">
      <div className="animate-fade-in flex flex-col items-center gap-6">
        <img
          src="/Logo.png"
          alt="Exam Hub"
          className="h-28 w-28 rounded-3xl object-contain shadow-2xl shadow-black/30"
        />
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-2 w-2 rounded-full bg-primary-400"
              style={{
                animation: 'dot-bounce 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
