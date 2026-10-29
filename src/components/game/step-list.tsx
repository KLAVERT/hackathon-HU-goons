import { useGameProgress } from "lib/game/progress";
import { STEPS } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { cn } from "lib/utils";
import { CheckIcon } from "lucide-react";
import { useId } from "react";

export const StepList = () => {
	const { scanned } = useGameProgress();
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
					const isFound = scanned.includes(step.id);
					return (
						<li
							key={step.id}
							className={cn(
								"flex items-center gap-4 rounded-xl border bg-card p-4",
								isFound && "border-primary/30 bg-tertiary",
							)}
						>
							<span
								aria-hidden
								className={cn(
									"flex size-11 shrink-0 items-center justify-center rounded-full font-black text-lg",
									isFound
										? "bg-primary text-primary-foreground"
										: "border-2 border-primary/80 border-dashed text-primary",
								)}
							>
								{isFound ? (
									<CheckIcon
										className="size-6"
										strokeWidth={3}
									/>
								) : (
									step.id
								)}
							</span>
							<span className="flex min-w-0 flex-col">
								<span className="truncate font-bold text-lg">
									{step.title()}
								</span>
								<span
									className={cn(
										"text-base",
										isFound
											? "text-primary"
											: "text-muted-foreground",
									)}
								>
									{isFound
										? m.game_step_found()
										: m.game_step_missing()}
								</span>
							</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
};
