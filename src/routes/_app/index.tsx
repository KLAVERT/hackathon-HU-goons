import { createFileRoute } from "@tanstack/react-router";
import { CompletionDialog } from "components/game/completion-dialog";
import { IntroDialog } from "components/game/intro-dialog";
import { useGameProgress } from "lib/game/progress";
import { findStepById, STEPS } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import { cn } from "lib/utils";
import {
	CircleCheckIcon,
	CircleDashedIcon,
} from "lucide-react";
import z from "zod";

const homeSearchSchema = z.object({
	/** Id of the step that was just recorded, set by `/step/$stepId` */
	scanned: z.optional(z.string()).catch(undefined),
	unknown: z.optional(z.boolean()).catch(undefined),
});

export const Route = createFileRoute("/_app/")({
	validateSearch: homeSearchSchema,
	head: () => ({
		meta: [{ title: makePageTitle(m.home_title()) }],
	}),
	component: HomePage,
});

const ScanNotice = () => {
	const { scanned, unknown } = Route.useSearch();
	const scannedStep = scanned
		? findStepById(scanned)
		: undefined;

	if (unknown) {
		return (
			<p className="rounded-lg bg-destructive/10 p-3 text-destructive">
				{m.game_step_unknown_code()}
			</p>
		);
	}
	if (scannedStep) {
		return (
			<p className="rounded-lg bg-tertiary p-3 font-medium text-tertiary-foreground">
				{m.game_step_scanned({ step: scannedStep.title() })}
			</p>
		);
	}
	return null;
};

function HomePage() {
	const { scanned, isComplete } = useGameProgress();

	return (
		<div className="flex flex-col gap-6 pb-8">
			<h1 className="heading-small">{m.home_title()}</h1>
			<ScanNotice />
			{isComplete ? (
				<p className="rounded-lg bg-primary p-4 font-medium text-lg text-primary-foreground">
					{m.home_completed()}
				</p>
			) : (
				<p>{m.home_intro()}</p>
			)}
			<ul className="flex flex-col gap-2">
				{STEPS.map((step) => {
					const isFound = scanned.includes(step.id);
					const Icon = isFound
						? CircleCheckIcon
						: CircleDashedIcon;
					return (
						<li
							key={step.id}
							className={cn(
								"flex items-center gap-3 rounded-lg border p-3",
								!isFound && "text-muted-foreground",
							)}
						>
							<Icon
								aria-hidden
								className={cn(
									"size-5 shrink-0",
									isFound && "text-primary",
								)}
							/>
							<span className="flex-1">{step.title()}</span>
							<span className="text-sm">
								{isFound
									? m.game_step_found()
									: m.game_step_missing()}
							</span>
						</li>
					);
				})}
			</ul>
			<IntroDialog />
			<CompletionDialog />
		</div>
	);
}
