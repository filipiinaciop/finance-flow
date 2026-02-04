import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="error-boundary">
          <h1 className="error-boundary__title">Erro na aplicação</h1>
          <pre className="error-boundary__message">
            {this.state.error.toString()}
          </pre>
          <p className="error-boundary__hint">
            Abra o console do navegador (F12) para mais detalhes.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
