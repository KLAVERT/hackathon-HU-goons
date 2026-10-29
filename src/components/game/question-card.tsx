import { Button } from "components/ui/button";
import {
	findAnswer,
	recordAnswer,
	useGameProgress,
} from "lib/game/progress";
import {
	CHOICES,
	type Choice,
	type GameStep,
} from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { cn } from "lib/utils";
import {
	CheckIcon,
	CircleAlertIcon,
	XIcon,
} from "lucide-react";
import {
	type FormEvent,
	useId,
	useRef,
	useState,
} from "react";
import { AnswerFeedback } from "./answer-feedback";

type QuestionCardProps = Readonly<{ step: GameStep }>;

type OptionState = "idle" | "correct" | "wrong" | "dimmed";

const optionClassNames: Record<OptionState, string> = {
	idle: "cursor-pointer border-border bg-card hover:border-primary/60 has-checked:border-primary has-checked:bg-tertiary",
	correct: "border-primary bg-tertiary",
	wrong: "border-destructive bg-destructive/10",
	dimmed: "border-border bg-card text-muted-foreground",
};

const badgeClassNames: Record<OptionState, string> = {
	idle: "border-2 border-primary/80 text-primary group-has-checked:border-primary group-has-checked:bg-primary group-has-checked:text-primary-foreground",
	correct: "bg-primary text-primary-foreground",
	wrong: "bg-secondary text-secondary-foreground",
	dimmed: "border-2 border-border",
};

/**
 * Multiple choice question of a step. After answering, it shows which answer
 * was right and explains it. The first answer is final.
 */
export const QuestionCard = ({
	step,
}: QuestionCardProps) => {
	const { answers } = useGameProgress();
	const answer = findAnswer(answers, step.id);
	const [selected, setSelected] = useState<Choice>();
	const [showChooseFirst, setShowChooseFirst] =
		useState(false);
	const feedbackRef = useRef<HTMLDivElement>(null);
	const headingId = useId();
	// Shown when the visitor comes back to a question they already answered
	const [wasAnsweredBefore] = useState(
		answer !== undefined,
	);

	const getOptionState = (choice: Choice): OptionState => {
		if (!answer) return "idle";
		if (choice === step.correct) return "correct";
		if (choice === answer.choice) return "wrong";
		return "dimmed";
	};

	const handleSubmit = (evt: FormEvent) => {
		evt.preventDefault();
		if (!selected) {
			setShowChooseFirst(true);
			return;
		}
		recordAnswer(step.id, selected);
		// Wait for the feedback to render before moving focus to it
		requestAnimationFrame(() =>
			feedbackRef.current?.focus(),
		);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3">
				<p className="font-black text-primary text-sm uppercase tracking-widest">
					{m.question_eyebrow({ location: step.title() })}
				</p>
				<h1 id={headingId} className="heading-small">
					{step.question()}
				</h1>
			</div>

			{wasAnsweredBefore && (
				<p className="text-muted-foreground">
					{m.question_already_answered()}
				</p>
			)}

			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-5"
			>
				<fieldset
					aria-labelledby={headingId}
					disabled={answer !== undefined}
					className="flex flex-col gap-3"
				>
					{CHOICES.map((choice) => {
						const state = getOptionState(choice);
						return (
							<label
								key={choice}
								className={cn(
									"group flex items-center gap-4 rounded-xl border-2 p-4 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring",
									optionClassNames[state],
								)}
							>
								<input
									type="radio"
									name="answer"
									value={choice}
									checked={
										(answer?.choice ?? selected) === choice
									}
									onChange={() => {
										setSelected(choice);
										setShowChooseFirst(false);
									}}
									className="sr-only"
								/>
								<span
									aria-hidden
									className={cn(
										"flex size-10 shrink-0 items-center justify-center rounded-full font-black text-lg uppercase",
										badgeClassNames[state],
									)}
								>
									{state === "correct" ? (
										<CheckIcon
											className="size-5"
											strokeWidth={3}
										/>
									) : state === "wrong" ? (
										<XIcon
											className="size-5"
											strokeWidth={3}
										/>
									) : (
										choice
									)}
								</span>
								<span className="flex flex-1 flex-col">
									<span className="font-bold text-lg">
										<span className="sr-only">
											{choice.toUpperCase()}:{" "}
										</span>
										{step.answers[choice]()}
									</span>
									{state === "correct" && (
										<span className="font-semibold text-primary text-sm">
											{m.question_right_answer()}
										</span>
									)}
									{state === "wrong" && (
										<span className="font-semibold text-destructive text-sm">
											{m.question_your_answer()}
										</span>
									)}
								</span>
							</label>
						);
					})}
				</fieldset>

				{!answer && (
					<div className="flex flex-col items-start gap-3">
						{showChooseFirst && (
							<p
								role="alert"
								className="flex items-center gap-2 font-semibold text-destructive"
							>
								<CircleAlertIcon
									aria-hidden
									className="size-5"
								/>
								{m.question_choose_first()}
							</p>
						)}
						<Button
							type="submit"
							size="lg"
							className="h-12 px-6 font-bold text-base"
						>
							{m.question_submit()}
						</Button>
					</div>
				)}
			</form>

			{answer && (
				<AnswerFeedback
					ref={feedbackRef}
					step={step}
					choice={answer.choice}
				/>
			)}
		</div>
	);
};
