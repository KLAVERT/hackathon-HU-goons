import { useNavigate } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "components/ui/dialog";
import { resetProgress } from "lib/game/progress";
import * as m from "lib/paraglide/messages";
import { RotateCcwIcon } from "lucide-react";
import type { RefObject } from "react";

type RestartDialogProps = Readonly<{
	/** Receives focus after restarting, because the trigger disappears with the ticket */
	focusAfterRestart: RefObject<HTMLElement | null>;
}>;

export const RestartDialog = ({
	focusAfterRestart,
}: RestartDialogProps) => {
	const navigate = useNavigate();

	const handleRestart = () => {
		resetProgress();
		// Also clears "?scanned=", so the "found" notice doesn't linger
		navigate({ to: "/", search: {}, replace: true }).then(
			() => focusAfterRestart.current?.focus(),
		);
	};

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						size="lg"
						className="h-11 gap-2 self-start border-transparent px-4 font-bold text-secondary"
					/>
				}
			>
				<RotateCcwIcon aria-hidden className="size-5" />
				{m.restart_button()}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-extrabold text-2xl leading-tight">
						{m.restart_title()}
					</DialogTitle>
					<DialogDescription>
						{m.restart_body()}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose
						render={<Button variant="outline" size="lg" />}
					>
						{m.common_cancel()}
					</DialogClose>
					<DialogClose
						render={
							<Button variant="secondary" size="lg" />
						}
						onClick={handleRestart}
					>
						{m.restart_confirm()}
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
