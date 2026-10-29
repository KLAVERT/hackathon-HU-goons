import { Link } from "@tanstack/react-router";
import { buttonVariants } from "components/ui/button";
import type { Choice, GameStep } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { cn } from "lib/utils";
import {
	ArrowRightIcon,
	PartyPopperIcon,
	XIcon,
} from "lucide-react";
import type { Ref } from "react";

type AnswerFeedbackProps = Readonly<{
	step: GameStep;
	choice: Choice;
	ref: Ref<HTMLDivElement>;
}>;

/**
 * Tells whether the answer was right, shows the right answer and explains it.
 * Focusable, so focus can move here after answering.
 */
export const AnswerFeedback = ({
	step,
	choice,
	ref,
}: AnswerFeedbackProps) => {
	const isCorrect = choice === step.correct;

	return (
		<div
			ref={ref}
			role="status"
			tabIndex={-1}
			className={cn(
				"fade-in slide-in-from-bottom-2 flex animate-in flex-col gap-3 rounded-2xl p-6 outline-none duration-500",
				isCorrect
					? "bg-primary text-primary-foreground"
					: "bg-secondary text-secondary-foreground",
			)}
		>
			<p className="flex items-center gap-3 font-black text-2xl">
				{isCorrect ? (
					<PartyPopperIcon
						aria-hidden
						className="size-7 shrink-0"
					/>
				) : (
					<XIcon
						aria-hidden
						className="size-7 shrink-0"
						strokeWidth={3}
					/>
				)}
				{isCorrect
					? m.question_correct_title()
					: m.question_wrong_title()}
			</p>
			{!isCorrect && (
				<p className="font-bold">
					{m.question_correct_answer_is({
						letter: step.correct.toUpperCase(),
						answer: step.answers[step.correct](),
					})}
				</p>
			)}
			<p>{step.explanation()}</p>
			<Link
				to="/"
				search={{ scanned: Number(step.id) }}
				className={cn(
					buttonVariants({
						variant: "outline",
						size: "lg",
					}),
					"mt-2 h-12 gap-2 self-start border-transparent bg-background px-5 font-bold text-base text-foreground hover:bg-background/90 hover:text-foreground dark:bg-background dark:hover:bg-background/90",
				)}
			>
				{m.question_continue()}
				<ArrowRightIcon aria-hidden className="size-5" />
			</Link>
		</div>
	);
};
