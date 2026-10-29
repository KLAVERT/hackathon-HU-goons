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
	markIntroSeen,
	useGameProgress,
} from "lib/game/progress";
import * as m from "lib/paraglide/messages";

export const IntroDialog = () => {
	const { introSeen } = useGameProgress();

	return (
		<Dialog
			open={!introSeen}
			onOpenChange={(open) => {
				if (!open) markIntroSeen();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-extrabold text-2xl leading-tight">
						{m.game_intro_title()}
					</DialogTitle>
					<DialogDescription>
						{m.game_intro_body()}
					</DialogDescription>
				</DialogHeader>
				<p className="font-medium">{m.game_intro_goal()}</p>
				<DialogFooter>
					<DialogClose render={<Button size="lg" />}>
						{m.game_intro_start()}
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
