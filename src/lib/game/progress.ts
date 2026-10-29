import { useSyncExternalStore } from "react";
import { z } from "zod";
import {
	findStepById,
	type GameStep,
	STEPS,
	type StepId,
} from "./steps";

const STORAGE_KEY = "hu-open-day-progress";

const isStepId = (id: string): id is StepId =>
	STEPS.some((step) => step.id === id);

const progressSchema = z.object({
	scanned: z
		.array(z.string())
		// Drops ids of steps that were removed from the config
		.transform((ids) => ids.filter(isStepId))
		.default([])
		.catch([]),
	introSeen: z.boolean().default(false).catch(false),
	completionSeen: z.boolean().default(false).catch(false),
});

export type GameProgress = z.infer<typeof progressSchema>;

const listeners = new Set<() => void>();
// Fallback for browsers where localStorage throws (e.g. some private modes),
// so the game still works for the current page session.
let memoryRaw: string | null = null;
let cache:
	| { raw: string | null; progress: GameProgress }
	| undefined;

const readRaw = (): string | null => {
	try {
		return localStorage.getItem(STORAGE_KEY) ?? memoryRaw;
	} catch {
		return memoryRaw;
	}
};

const parseProgress = (
	raw: string | null,
): GameProgress => {
	try {
		return progressSchema.parse(JSON.parse(raw ?? "{}"));
	} catch {
		return progressSchema.parse({});
	}
};

/**
 * Returns the stored game progress. The result is referentially stable
 * until the stored value changes, as `useSyncExternalStore` requires.
 *
 * @example
 * getProgress() // { scanned: ["step-2"], introSeen: true, completionSeen: false }
 */
export const getProgress = (): GameProgress => {
	const raw = readRaw();
	if (!cache || cache.raw !== raw) {
		cache = { raw, progress: parseProgress(raw) };
	}
	return cache.progress;
};

const writeProgress = (progress: GameProgress) => {
	const raw = JSON.stringify(progress);
	memoryRaw = raw;
	try {
		localStorage.setItem(STORAGE_KEY, raw);
	} catch {
		// Keep working from memory
	}
	for (const listener of listeners) listener();
};

/**
 * Subscribes to progress changes, from this tab and other tabs.
 * Returns an unsubscribe function.
 *
 * @example
 * const unsubscribe = subscribe(() => console.log(getProgress()));
 */
export const subscribe = (listener: () => void) => {
	const onStorage = (evt: StorageEvent) => {
		if (evt.key === STORAGE_KEY || evt.key === null)
			listener();
	};
	listeners.add(listener);
	window.addEventListener("storage", onStorage);
	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
};

type ScanResult =
	| { status: "new" | "duplicate"; step: GameStep }
	| { status: "unknown" };

/**
 * Stores the step of a scanned QR code.
 * Scanning the same code twice has no extra effect.
 *
 * @example
 * recordScan("1") // { status: "new", step: { id: "1", ... } }
 * recordScan("1") // { status: "duplicate", step: { id: "1", ... } }
 * recordScan("99") // { status: "unknown" }
 */
export const recordScan = (stepId: string): ScanResult => {
	const step = findStepById(stepId);
	if (!step) return { status: "unknown" };

	const progress = getProgress();
	if (progress.scanned.includes(step.id)) {
		return { status: "duplicate", step };
	}
	writeProgress({
		...progress,
		scanned: [...progress.scanned, step.id],
	});
	return { status: "new", step };
};

/**
 * Remembers that the visitor has read the game explanation.
 *
 * @example
 * markIntroSeen();
 * getProgress().introSeen // true
 */
export const markIntroSeen = () =>
	writeProgress({ ...getProgress(), introSeen: true });

/**
 * Remembers that the visitor has seen the completion pop-up.
 *
 * @example
 * markCompletionSeen();
 * getProgress().completionSeen // true
 */
export const markCompletionSeen = () =>
	writeProgress({ ...getProgress(), completionSeen: true });

/**
 * Reactive game progress, kept in sync with localStorage.
 *
 * @example
 * const { scanned, scannedCount, isComplete } = useGameProgress();
 */
export const useGameProgress = () => {
	const progress = useSyncExternalStore(
		subscribe,
		getProgress,
	);
	return {
		...progress,
		scannedCount: progress.scanned.length,
		isComplete: STEPS.every((step) =>
			progress.scanned.includes(step.id),
		),
	};
};
