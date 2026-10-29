import * as m from "lib/paraglide/messages";

/** Answer options of every question, shown as A, B, C and D */
export const CHOICES = ["a", "b", "c", "d"] as const;
export type Choice = (typeof CHOICES)[number];

type Step = Readonly<{
	/** Used in the QR code url: `/step/<id>` */
	id: string;
	title: () => string;
	/** Shown while the step is not found yet, to help visitors find the QR code */
	hint: () => string;
	/** Multiple choice question, answered when the QR code is scanned */
	question: () => string;
	answers: Readonly<Record<Choice, () => string>>;
	correct: Choice;
	/** Shown after answering, whether the answer was right or wrong */
	explanation: () => string;
}>;

/**
 * All steps of the game. The order here is the order of the slots in the
 * progress bar; visitors can scan them in any order.
 */
export const STEPS = [
	{
		id: "1",
		title: m.game_step_1_title,
		hint: m.game_step_1_hint,
		question: m.game_step_1_question,
		answers: {
			a: m.game_step_1_answer_a,
			b: m.game_step_1_answer_b,
			c: m.game_step_1_answer_c,
			d: m.game_step_1_answer_d,
		},
		correct: "c",
		explanation: m.game_step_1_explanation,
	},
	{
		id: "2",
		title: m.game_step_2_title,
		hint: m.game_step_2_hint,
		question: m.game_step_2_question,
		answers: {
			a: m.game_step_2_answer_a,
			b: m.game_step_2_answer_b,
			c: m.game_step_2_answer_c,
			d: m.game_step_2_answer_d,
		},
		correct: "b",
		explanation: m.game_step_2_explanation,
	},
	{
		id: "3",
		title: m.game_step_3_title,
		hint: m.game_step_3_hint,
		question: m.game_step_3_question,
		answers: {
			a: m.game_step_3_answer_a,
			b: m.game_step_3_answer_b,
			c: m.game_step_3_answer_c,
			d: m.game_step_3_answer_d,
		},
		correct: "a",
		explanation: m.game_step_3_explanation,
	},
	{
		id: "4",
		title: m.game_step_4_title,
		hint: m.game_step_4_hint,
		question: m.game_step_4_question,
		answers: {
			a: m.game_step_4_answer_a,
			b: m.game_step_4_answer_b,
			c: m.game_step_4_answer_c,
			d: m.game_step_4_answer_d,
		},
		correct: "d",
		explanation: m.game_step_4_explanation,
	},
	{
		id: "5",
		title: m.game_step_5_title,
		hint: m.game_step_5_hint,
		question: m.game_step_5_question,
		answers: {
			a: m.game_step_5_answer_a,
			b: m.game_step_5_answer_b,
			c: m.game_step_5_answer_c,
			d: m.game_step_5_answer_d,
		},
		correct: "b",
		explanation: m.game_step_5_explanation,
	},
	{
		id: "6",
		title: m.game_step_6_title,
		hint: m.game_step_6_hint,
		question: m.game_step_6_question,
		answers: {
			a: m.game_step_6_answer_a,
			b: m.game_step_6_answer_b,
			c: m.game_step_6_answer_c,
			d: m.game_step_6_answer_d,
		},
		correct: "c",
		explanation: m.game_step_6_explanation,
	},
] as const satisfies readonly Step[];

export type GameStep = (typeof STEPS)[number];
export type StepId = GameStep["id"];

/**
 * Finds a step by its id, e.g. one read from the url or storage.
 *
 * @example
 * findStepById("2") // { id: "2", ... }
 * findStepById("99") // undefined
 */
export const findStepById = (
	id: string,
): GameStep | undefined =>
	STEPS.find((step) => step.id === id);
