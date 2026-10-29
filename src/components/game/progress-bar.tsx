import { useGameProgress } from "lib/game/progress";
import { STEPS } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { cn } from "lib/utils";
import { CheckIcon } from "lucide-react";

type ProgressBarProps = Readonly<{
	/** Step that was just scanned, its slot fills with an animation */
	highlightId?: string;
}>;

export const ProgressBar = ({
	highlightId,
}: ProgressBarProps) => {
	const { scanned, scannedCount } = useGameProgress();
	const label = m.game_progress_label({
		found: scannedCount,
		total: STEPS.length,
	});

	return (
		<div className="flex flex-col gap-1.5">
			<div
				role="progressbar"
				aria-label={m.game_progress_title()}
				aria-valuetext={label}
				aria-valuemin={0}
				aria-valuemax={STEPS.length}
				aria-valuenow={scannedCount}
				className="flex gap-1.5"
			>
				{STEPS.map((step) => {
					const isFound = scanned.includes(step.id);
					return (
						<div
							key={step.id}
							className={cn(
								"flex h-9 flex-1 items-center justify-center rounded-lg font-black text-sm",
								isFound
									? "bg-primary text-primary-foreground"
									: "border-2 border-primary/80 border-dashed text-primary",
								isFound &&
									step.id === highlightId &&
									"zoom-in-50 animate-in ring-2 ring-hu-blue ring-offset-2 duration-500",
							)}
						>
							{isFound ? (
								<CheckIcon
									aria-hidden
									className="size-5"
									strokeWidth={3}
								/>
							) : (
								step.id
							)}
						</div>
					);
				})}
			</div>
			<p
				aria-hidden
				className="font-semibold text-muted-foreground text-sm"
			>
				{label}
			</p>
		</div>
	);
};
