import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorMessage: error.message });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 bg-red-900 border border-red-500 rounded-lg text-white">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <p className="text-sm opacity-80">{this.state.errorMessage}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition-colors"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
