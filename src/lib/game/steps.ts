import * as m from "lib/paraglide/messages";

type Step = Readonly<{
	/** Used in the QR code url: `/step/<id>` */
	id: string;
	title: () => string;
	/** Shown while the step is not found yet, to help visitors find the QR code */
	hint: () => string;
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
	},
	{
		id: "2",
		title: m.game_step_2_title,
		hint: m.game_step_2_hint,
	},
	{
		id: "3",
		title: m.game_step_3_title,
		hint: m.game_step_3_hint,
	},
	{
		id: "4",
		title: m.game_step_4_title,
		hint: m.game_step_4_hint,
	},
	{
		id: "5",
		title: m.game_step_5_title,
		hint: m.game_step_5_hint,
	},
	{
		id: "6",
		title: m.game_step_6_title,
		hint: m.game_step_6_hint,
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
