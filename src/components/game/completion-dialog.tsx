import { Button } from "components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "components/ui/dialog";
import {
	markCompletionSeen,
	useGameProgress,
} from "lib/game/progress";
import { STEPS } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { PartyPopperIcon } from "lucide-react";
import { Confetti } from "./confetti";

export const CompletionDialog = () => {
	const {
		isComplete,
		introSeen,
		completionSeen,
		correctCount,
	} = useGameProgress();
	const isOpen = isComplete && introSeen && !completionSeen;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) markCompletionSeen();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<span className="mb-2 flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
						<PartyPopperIcon
							aria-hidden
							className="size-7"
						/>
					</span>
					<DialogTitle className="font-extrabold text-2xl leading-tight">
						{m.game_completed_title()}
					</DialogTitle>
					<DialogDescription>
						{m.game_completed_body()}
					</DialogDescription>
				</DialogHeader>
				<p className="rounded-lg bg-tertiary p-3 font-bold text-lg text-primary">
					{m.game_completed_score({
						correct: correctCount,
						total: STEPS.length,
					})}
				</p>
				<DialogFooter>
					<DialogClose render={<Button size="lg" />}>
						{m.game_completed_close()}
					</DialogClose>
				</DialogFooter>
			</DialogContent>
			{isOpen && <Confetti />}
		</Dialog>
	);
};
