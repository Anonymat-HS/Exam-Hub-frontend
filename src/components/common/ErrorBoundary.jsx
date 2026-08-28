import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary a intercepté une erreur :', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-500">
              <AlertTriangle size={40} />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
              Une erreur est survenue
            </h1>

            <p className="mt-2 max-w-sm text-sm text-gray-400 leading-relaxed">
              L'application a rencontré un problème inattendu. Veuillez recharger la page.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={16} />
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
