"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Optional custom fallback. Receives the captured error and a reset handler. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Optional label shown in the default fallback (e.g. section name). */
  label?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Generic React Error Boundary.
 *
 * Catches render-phase errors in any client component subtree and renders a
 * graceful fallback UI instead of unmounting the entire app. The boundary
 * resets on `reset()` (e.g. via a "Try again" button) and the global
 * `kodeln-reset-error-boundaries` event so the root layout can recover after
 * auth/theme/runtime glitches.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to the browser console for debugging; replace with telemetry later.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGlobalReset = () => {
    window.dispatchEvent(new Event("kodeln-reset-error-boundaries"));
  };

  componentDidMount() {
    window.addEventListener("kodeln-reset-error-boundaries", this.handleReset);
  }

  componentWillUnmount() {
    window.removeEventListener("kodeln-reset-error-boundaries", this.handleReset);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, label } = this.props;

    if (!hasError || !error) return children;

    if (fallback) return fallback(error, this.handleReset);

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-center justify-center gap-4 p-8 m-4 rounded-3xl border border-rose-200 bg-rose-50/60 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40">
            <AlertTriangle size={20} />
          </div>
          <div className="text-sm font-black uppercase tracking-[0.15em]">
            {label ? `${label} crashed` : "Something went wrong"}
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed text-center max-w-md opacity-80">
          {error.message || "An unexpected error occurred while rendering this section."}
        </p>

        <button
          type="button"
          onClick={this.handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all shadow-lg shadow-rose-600/20"
        >
          <RotateCcw size={12} /> Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
