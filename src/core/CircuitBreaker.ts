
import { devTelemetry } from '../engines/logic-link/ObservabilityLayer';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
    failureThreshold: number;
    resetTimeout: number; // in ms
}

export class CircuitOpenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CircuitOpenError';
    }
}

export class CircuitBreaker {
    private state: CircuitState = 'CLOSED';
    private failureCount = 0;
    private nextAttempt = Date.now();
    private failureThreshold: number;
    private resetTimeout: number;

    constructor(options: CircuitBreakerOptions) {
        this.failureThreshold = options.failureThreshold;
        this.resetTimeout = options.resetTimeout;
    }

    public async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === 'OPEN') {
            if (Date.now() > this.nextAttempt) {
                this.state = 'HALF_OPEN';
            } else {
                throw new CircuitOpenError('Circuit is OPEN. Fail-fast active.');
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error: any) {
            this.onFailure(error);
            throw error;
        }
    }

    private onSuccess(): void {
        if (this.state === 'HALF_OPEN') {
            this.state = 'CLOSED';
            this.failureCount = 0;
            devTelemetry.trackEvent('CHECK', 'Circuit Recovered (HALF_OPEN -> CLOSED)', 'success');
        } else {
            this.failureCount = 0;
        }
    }

    private onFailure(error: any): void {
        this.failureCount++;

        // Log the error but don't trip immediately unless threshold met or explicit 429/5xx
        const isServerFlag = error?.code === '429' || (error?.status >= 500 && error?.status < 600);

        if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold || isServerFlag) {
            this.tripCircuit();
        }
    }

    private tripCircuit(): void {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.resetTimeout;

        // Critical System Alert
        devTelemetry.trackEvent('CHECK', 'Circuit Tripped (CLOSED -> OPEN). System Degradation Active.', 'failure');
        console.warn(`[CIRCUIT BREAKER] Tripped to OPEN state. Reset in ${this.resetTimeout}ms.`);
    }

    public getState(): CircuitState {
        return this.state;
    }
}
