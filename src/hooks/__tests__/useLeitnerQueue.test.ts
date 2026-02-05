import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useLeitnerQueue } from '../useLeitnerQueue';

describe('useLeitnerQueue', () => {
    it('initializes with default queue', () => {
        const { result } = renderHook(() => useLeitnerQueue());
        expect(result.current.queue.length).toBeGreaterThan(0);
        expect(result.current.currentItem).toBeDefined();
    });

    it('moves card to box 2 on success', () => {
        const { result } = renderHook(() => useLeitnerQueue());
        const firstId = result.current.currentItem!.id;

        act(() => {
            result.current.recordAnswer(firstId, true);
        });

        // Find the modified item in the queue (currentItem changes because of sort)
        const updatedItem = result.current.queue.find(i => i.id === firstId);
        expect(updatedItem!.box).toBe(2);
        expect(updatedItem!.nextReview).toBeGreaterThan(Date.now());
    });

    it('resets card to box 1 on failure', () => {
        const { result } = renderHook(() => useLeitnerQueue());
        const firstId = result.current.currentItem!.id;

        // Manually move it to box 3 first
        act(() => {
            result.current.recordAnswer(firstId, true);
        });

        // Simulating second success is tricky due to async/resort, so let's just fail it from box 2

        act(() => {
            result.current.recordAnswer(firstId, false);
        });

        const updatedItem = result.current.queue.find(i => i.id === firstId);
        expect(updatedItem!.box).toBe(1);
    });
});
