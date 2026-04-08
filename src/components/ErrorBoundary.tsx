import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-8 border border-red-900/50">
            <span className="text-6xl">⚠️</span>
          </div>
          <h1 className="text-4xl font-black text-red-600 uppercase tracking-widest mb-4">
            Ritual Interrompido
          </h1>
          <p className="text-zinc-400 max-w-md mb-8">
            Ocorreu uma falha na conexão com o abismo. O ritual foi interrompido para sua segurança.
          </p>
          <div className="bg-zinc-900/50 border border-red-900/30 p-4 rounded-xl mb-8 w-full max-w-lg overflow-auto">
            <code className="text-red-400 text-xs font-mono break-all">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-900 text-white font-bold rounded-full hover:bg-red-800 transition-all uppercase tracking-widest"
          >
            Reiniciar Ritual
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
