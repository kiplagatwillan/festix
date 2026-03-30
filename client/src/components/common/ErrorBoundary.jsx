import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-50 p-6 rounded-full mb-6">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Something went sideways.
          </h1>
          <p className="text-gray-500 max-w-md mb-8">
            An unexpected error occurred. Our engineers have been notified.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold"
          >
            <RotateCcw className="w-5 h-5" /> Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
