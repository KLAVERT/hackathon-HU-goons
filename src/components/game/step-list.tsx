import { Link } from "@tanstack/react-router";
import {
	type Answer,
	findAnswer,
	useGameProgress,
} from "lib/game/progress";
import { type GameStep, STEPS } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { cn } from "lib/utils";
import {
	CheckIcon,
	ChevronRightIcon,
	LightbulbIcon,
	XIcon,
} from "lucide-react";
import { useId } from "react";

const MissingStep = ({
	step,
}: Readonly<{ step: GameStep }>) => (
	<div className="flex items-center gap-4 rounded-xl border bg-card p-4">
		<span
			aria-hidden
			className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-primary/80 border-dashed font-black text-lg text-primary"
		>
			{step.id}
		</span>
		<span className="flex min-w-0 flex-col">
			<span className="truncate font-bold text-lg">
				{step.title()}
			</span>
			<span className="flex items-start gap-1.5 text-base text-muted-foreground">
				<LightbulbIcon
					aria-hidden
					className="mt-1 size-4 shrink-0"
				/>
				<span>
					<span className="sr-only">
						{m.game_step_missing()}.{" "}
					</span>
					{step.hint()}
				</span>
			</span>
		</span>
	</div>
);

// Links to the question, so the visitor can look back at their answer
const FoundStep = ({
	step,
	answer,
}: Readonly<{ step: GameStep; answer: Answer }>) => {
	const isCorrect = answer.choice === step.correct;
	const ResultIcon = isCorrect ? CheckIcon : XIcon;

	return (
		<Link
			to="/step/$stepId"
			params={{ stepId: step.id }}
			className="flex items-center gap-4 rounded-xl border border-primary/30 bg-tertiary p-4 outline-none transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring"
		>
			<span
				aria-hidden
				className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
			>
				<CheckIcon className="size-6" strokeWidth={3} />
			</span>
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="truncate font-bold text-lg">
					{step.title()}
				</span>
				<span
					className={cn(
						"flex items-center gap-1.5 font-semibold text-base",
						isCorrect ? "text-primary" : "text-destructive",
					)}
				>
					<ResultIcon
						aria-hidden
						className="size-4 shrink-0"
						strokeWidth={3}
					/>
					{isCorrect
						? m.game_step_correct()
						: m.game_step_wrong()}
				</span>
			</span>
			<ChevronRightIcon
				aria-hidden
				className="size-5 shrink-0 text-muted-foreground"
			/>
		</Link>
	);
};

export const StepList = () => {
	const { answers } = useGameProgress();
	const headingId = useId();

	return (
		<section
			aria-labelledby={headingId}
			className="flex flex-col gap-4"
		>
			<h2 id={headingId} className="font-black text-2xl">
				{m.game_steps_heading()}
			</h2>
			<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{STEPS.map((step) => {
					const answer = findAnswer(answers, step.id);
					return (
						<li key={step.id}>
							{answer ? (
								<FoundStep step={step} answer={answer} />
							) : (
								<MissingStep step={step} />
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
};
