import { createFileRoute } from "@tanstack/react-router";
import { CompletionDialog } from "components/game/completion-dialog";
import { CompletionTicket } from "components/game/completion-ticket";
import { IntroDialog } from "components/game/intro-dialog";
import { StepList } from "components/game/step-list";
import { Button } from "components/ui/button";
import { useGameProgress } from "lib/game/progress";
import { findStepById } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import {
	CircleAlertIcon,
	CircleHelpIcon,
	QrCodeIcon,
} from "lucide-react";
import { useState } from "react";
import z from "zod";

const homeSearchSchema = z.object({
	/** Id of the step that was just recorded, set by `/step/$stepId` */
	scanned: z.optional(z.number()).catch(undefined),
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
	const scannedStep =
		scanned === undefined
			? undefined
			: findStepById(scanned.toString());

	if (unknown) {
		return (
			<p
				role="alert"
				className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 font-semibold text-destructive text-lg"
			>
				<CircleAlertIcon
					aria-hidden
					className="size-6 shrink-0"
				/>
				{m.game_step_unknown_code()}
			</p>
		);
	}
	if (scannedStep) {
		return (
			<p
				role="status"
				className="fade-in slide-in-from-top-2 flex animate-in items-center gap-3 rounded-xl bg-primary p-4 font-bold text-lg text-primary-foreground duration-500"
			>
				<QrCodeIcon
					aria-hidden
					className="size-6 shrink-0"
				/>
				{m.game_step_scanned({ step: scannedStep.title() })}
			</p>
		);
	}
	return null;
};

function HomePage() {
	const { isComplete } = useGameProgress();
	const [isHelpOpen, setIsHelpOpen] = useState(false);

	return (
		<div className="flex flex-col gap-10">
			<ScanNotice />
			{isComplete && <CompletionTicket />}
			<section className="flex flex-col items-start gap-5">
				<h1 className="heading-medium sm:heading-large">
					{m.home_title()}
				</h1>
				<p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
					{m.home_intro()}
				</p>
				<Button
					variant="outline"
					size="lg"
					onClick={() => setIsHelpOpen(true)}
					className="h-11 gap-2 px-4 font-bold"
				>
					<CircleHelpIcon aria-hidden className="size-5" />
					{m.home_help()}
				</Button>
			</section>
			<StepList />
			<IntroDialog
				isHelpOpen={isHelpOpen}
				onHelpOpenChange={setIsHelpOpen}
			/>
			<CompletionDialog />
		</div>
	);
}
