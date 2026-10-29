import {
	findAnswer,
	useGameProgress,
} from "lib/game/progress";
import {
	type Choice,
	type GameStep,
	STEPS,
} from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { cn } from "lib/utils";
import { CheckIcon, XIcon } from "lucide-react";
import { useId } from "react";

/**
 * "B: 2", the letter and text of an answer option.
 *
 * @example
 * formatChoice(findStepById("2"), "b") // "B: 2"
 */
const formatChoice = (step: GameStep, choice: Choice) =>
	`${choice.toUpperCase()}: ${step.answers[choice]()}`;

/** Every question with the visitor's answer, the right answer and the explanation. */
export const AnswerSummary = () => {
	const { answers } = useGameProgress();
	const headingId = useId();

	return (
		<section
			aria-labelledby={headingId}
			className="flex flex-col gap-4"
		>
			<h2 id={headingId} className="font-black text-2xl">
				{m.summary_heading()}
			</h2>
			<ol className="flex flex-col gap-3">
				{STEPS.map((step) => {
					const answer = findAnswer(answers, step.id);
					if (!answer) return null;
					const isCorrect = answer.choice === step.correct;
					const ResultIcon = isCorrect ? CheckIcon : XIcon;

					return (
						<li
							key={step.id}
							className="flex flex-col gap-4 rounded-xl border bg-card p-5"
						>
							<div className="flex items-start gap-3">
								<span
									aria-hidden
									className={cn(
										"flex size-9 shrink-0 items-center justify-center rounded-full",
										isCorrect
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-secondary-foreground",
									)}
								>
									<ResultIcon
										className="size-5"
										strokeWidth={3}
									/>
								</span>
								<div className="flex flex-col gap-0.5">
									<p className="font-semibold text-muted-foreground text-sm">
										{step.title()}
									</p>
									<h3 className="font-bold text-lg leading-snug">
										{step.question()}
									</h3>
								</div>
							</div>
							<dl className="grid gap-2 sm:grid-cols-2">
								<div
									className={cn(
										"rounded-lg p-3",
										isCorrect
											? "bg-tertiary"
											: "bg-destructive/10",
									)}
								>
									<dt className="font-semibold text-muted-foreground text-sm">
										{m.question_your_answer()}
									</dt>
									<dd className="font-bold">
										<span className="sr-only">
											{isCorrect
												? m.game_step_correct()
												: m.game_step_wrong()}
											:{" "}
										</span>
										{formatChoice(step, answer.choice)}
									</dd>
								</div>
								{!isCorrect && (
									<div className="rounded-lg bg-tertiary p-3">
										<dt className="font-semibold text-muted-foreground text-sm">
											{m.question_right_answer()}
										</dt>
										<dd className="font-bold">
											{formatChoice(step, step.correct)}
										</dd>
									</div>
								)}
							</dl>
							<p className="text-muted-foreground">
								{step.explanation()}
							</p>
						</li>
					);
				})}
			</ol>
		</section>
	);
};
