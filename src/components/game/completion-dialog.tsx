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
import * as m from "lib/paraglide/messages";

export const CompletionDialog = () => {
	const { isComplete, introSeen, completionSeen } =
		useGameProgress();

	return (
		<Dialog
			open={isComplete && introSeen && !completionSeen}
			onOpenChange={(open) => {
				if (!open) markCompletionSeen();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-extrabold text-2xl leading-tight">
						{m.game_completed_title()}
					</DialogTitle>
					<DialogDescription>
						{m.game_completed_body()}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button size="lg" />}>
						{m.game_completed_close()}
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
