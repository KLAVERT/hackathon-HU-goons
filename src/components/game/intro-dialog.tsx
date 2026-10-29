import Logo from "assets/icons/logo.svg?react";
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

type IntroDialogProps = Readonly<{
	/** Opened again on request, after the visitor has already seen it */
	isHelpOpen: boolean;
	onHelpOpenChange: (open: boolean) => void;
}>;

export const IntroDialog = ({
	isHelpOpen,
	onHelpOpenChange,
}: IntroDialogProps) => {
	const { introSeen } = useGameProgress();

	return (
		<Dialog
			open={!introSeen || isHelpOpen}
			onOpenChange={(open) => {
				onHelpOpenChange(open);
				if (!open) markIntroSeen();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<Logo
						aria-hidden
						className="mb-2 h-8 w-auto self-start"
					/>
					<span
						aria-hidden
						className="block h-1.5 w-12 rounded-full bg-hu-red"
					/>
					<DialogTitle className="font-extrabold text-2xl leading-tight">
						{m.game_intro_title()}
					</DialogTitle>
					<DialogDescription>
						{m.game_intro_body()}
					</DialogDescription>
				</DialogHeader>
				<p className="rounded-lg bg-tertiary p-3 font-bold text-primary">
					{m.game_intro_goal()}
				</p>
				<DialogFooter>
					<DialogClose render={<Button size="lg" />}>
						{m.game_intro_start()}
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
