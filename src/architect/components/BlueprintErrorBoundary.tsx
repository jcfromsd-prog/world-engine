import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}



interface State {
    hasError: boolean;
    error: Error | null;
}

export default class BlueprintErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Blueprint Crashed:", error, errorInfo);
        // Telemetry
        // devTelemetry.track('error', ...)
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Ideally reload or clear bad state
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-[600px] w-full flex flex-col items-center justify-center bg-zinc-950 border border-red-900/50 rounded-xl p-8 text-center text-red-500 font-mono">
                    <div className="text-6xl mb-4">💥</div>
                    <h2 className="text-xl font-bold mb-2">BLUEPRINT MALFUNCTION</h2>
                    <p className="text-sm text-red-400/60 mb-8 max-w-md">
                        {this.state.error?.message || "Critical Logic Failure detected in the Architect Engine."}
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="px-6 py-3 bg-red-900/20 border border-red-500 hover:bg-red-500 hover:text-white transition-all rounded uppercase tracking-widest text-sm"
                    >
                        REBOOT SYSTEM
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
