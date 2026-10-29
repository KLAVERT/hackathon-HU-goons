import { useSyncExternalStore } from "react";
import { z } from "zod";
import {
	CHOICES,
	type Choice,
	findStepById,
	type GameStep,
	STEPS,
	type StepId,
} from "./steps";

const STORAGE_KEY = "hu-open-day-progress";

const isStepId = (id: string): id is StepId =>
	STEPS.some((step) => step.id === id);

const answerSchema = z.object({
	stepId: z.string(),
	choice: z.enum(CHOICES),
});

export type Answer = Readonly<{
	stepId: StepId;
	choice: Choice;
}>;

const progressSchema = z.object({
	/** One answer per found step, in the order they were answered */
	answers: z
		.array(z.unknown())
		// Drops invalid entries and answers to steps that were removed from the config
		.transform((items) =>
			items.flatMap((item): Answer[] => {
				const result = answerSchema.safeParse(item);
				return result.success &&
					isStepId(result.data.stepId)
					? [
							{
								stepId: result.data.stepId,
								choice: result.data.choice,
							},
						]
					: [];
			}),
		)
		.default([])
		.catch([]),
	introSeen: z.boolean().default(false).catch(false),
	completionSeen: z.boolean().default(false).catch(false),
	/** Epoch ms of the first and the last answer, for the time on the completion ticket */
	startedAt: z.number().optional().catch(undefined),
	completedAt: z.number().optional().catch(undefined),
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
 * getProgress() // { answers: [{ stepId: "2", choice: "b" }], introSeen: true, ... }
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

/**
 * Whether every step of the game has been scanned.
 *
 * @example
 * isAllScanned(["1", "2", "3", "4", "5", "6"]) // true
 * isAllScanned(["2"]) // false
 */
const isAllScanned = (scanned: readonly StepId[]) =>
	STEPS.every((step) => scanned.includes(step.id));

/**
 * Finds the visitor's answer to a step, if they answered it.
 *
 * @example
 * findAnswer(getProgress().answers, "2") // { stepId: "2", choice: "b" }
 */
export const findAnswer = (
	answers: readonly Answer[],
	stepId: string,
) => answers.find((answer) => answer.stepId === stepId);

/**
 * Counts the answers that are right.
 *
 * @example
 * countCorrect([{ stepId: "1", choice: "c" }, { stepId: "2", choice: "a" }]) // 1
 */
export const countCorrect = (answers: readonly Answer[]) =>
	answers.filter(
		(answer) =>
			findStepById(answer.stepId)?.correct ===
			answer.choice,
	).length;

type AnswerResult =
	| { status: "new" | "duplicate"; step: GameStep }
	| { status: "unknown" };

/**
 * Stores the answer to a step's question, which also marks the step as found.
 * The first answer is final: answering the same step again has no effect.
 *
 * @example
 * recordAnswer("1", "c") // { status: "new", step: { id: "1", ... } }
 * recordAnswer("1", "a") // { status: "duplicate", step: { id: "1", ... } }
 * recordAnswer("99", "a") // { status: "unknown" }
 */
export const recordAnswer = (
	stepId: string,
	choice: Choice,
): AnswerResult => {
	const step = findStepById(stepId);
	if (!step) return { status: "unknown" };

	const progress = getProgress();
	if (findAnswer(progress.answers, step.id)) {
		return { status: "duplicate", step };
	}
	const answers = [
		...progress.answers,
		{ stepId: step.id, choice },
	];
	const now = Date.now();
	writeProgress({
		...progress,
		answers,
		startedAt: progress.startedAt ?? now,
		completedAt: isAllScanned(
			answers.map((answer) => answer.stepId),
		)
			? now
			: undefined,
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
 * Starts the game over: clears all answers and times. The intro stays marked
 * as seen, since the visitor already knows how the game works.
 *
 * @example
 * resetProgress();
 * getProgress() // { answers: [], introSeen: true, completionSeen: false }
 */
export const resetProgress = () =>
	writeProgress({
		...progressSchema.parse({}),
		introSeen: true,
	});

/**
 * Reactive game progress, kept in sync with localStorage.
 *
 * @example
 * const { scanned, scannedCount, correctCount, isComplete } = useGameProgress();
 */
export const useGameProgress = () => {
	const progress = useSyncExternalStore(
		subscribe,
		getProgress,
	);
	// A step counts as found once its question is answered
	const scanned = progress.answers.map(
		(answer) => answer.stepId,
	);
	return {
		...progress,
		scanned,
		scannedCount: scanned.length,
		correctCount: countCorrect(progress.answers),
		isComplete: isAllScanned(scanned),
	};
};
