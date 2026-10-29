import { useGameProgress } from "lib/game/progress";
import { STEPS } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { cn } from "lib/utils";

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
		<div className="flex flex-col gap-1">
			<div
				role="progressbar"
				aria-label={label}
				aria-valuemin={0}
				aria-valuemax={STEPS.length}
				aria-valuenow={scannedCount}
				className="flex gap-1"
			>
				{STEPS.map((step) => (
					<div
						key={step.id}
						title={step.title()}
						className="h-3 flex-1 overflow-hidden rounded-full bg-muted"
					>
						{scanned.includes(step.id) && (
							<div
								className={cn(
									"size-full rounded-full bg-primary",
									step.id === highlightId &&
										"fade-in zoom-in-0 animate-in duration-700",
								)}
							/>
						)}
					</div>
				))}
			</div>
			<p className="text-right text-muted-foreground text-xs">
				{label}
			</p>
		</div>
	);
};
