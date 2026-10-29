import {
	createFileRoute,
	redirect,
} from "@tanstack/react-router";
import { IntroDialog } from "components/game/intro-dialog";
import { QuestionCard } from "components/game/question-card";
import { findStepById } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

// QR code landing page: the visitor answers this location's question here
export const Route = createFileRoute("/_app/step/$stepId")({
	beforeLoad: ({ params }) => {
		const step = findStepById(params.stepId);
		if (!step) {
			throw redirect({
				to: "/",
				search: { unknown: true },
				replace: true,
			});
		}
		return { step };
	},
	head: ({ params }) => {
		const step = findStepById(params.stepId);
		return {
			meta: [
				{
					title: makePageTitle(
						step
							? m.question_eyebrow({
									location: step.title(),
								})
							: m.home_title(),
					),
				},
			],
		};
	},
	component: StepPage,
});

function StepPage() {
	const { step } = Route.useRouteContext();
	return (
		<>
			{/* Remount per step, so the selected answer doesn't carry over to another question */}
			<QuestionCard key={step.id} step={step} />
			{/* The first scan lands here, so this is where the intro shows */}
			<IntroDialog />
		</>
	);
}
