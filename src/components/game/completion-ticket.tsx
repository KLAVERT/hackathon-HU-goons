import { HuLoader } from "components/hu-loader/hu-loader";
import { useGameProgress } from "lib/game/progress";
import { STEPS } from "lib/game/steps";
import { useLocale } from "lib/i18n";
import * as m from "lib/paraglide/messages";
import {
	type RefObject,
	useEffect,
	useId,
	useState,
} from "react";
import { RestartDialog } from "./restart-dialog";

const LiveClock = () => {
	const locale = useLocale();
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const interval = setInterval(
			() => setNow(new Date()),
			1000,
		);
		return () => clearInterval(interval);
	}, []);

	return (
		<time dateTime={now.toISOString()}>
			{now.toLocaleTimeString(locale, {
				timeStyle: "medium",
			})}
		</time>
	);
};

/**
 * Proof of completion to show at the info desk. The ticking clock and the
 * looping logo make a screenshot easy to spot.
 */
type CompletionTicketProps = Readonly<{
	/** Receives focus after restarting the game */
	focusAfterRestart: RefObject<HTMLElement | null>;
}>;

export const CompletionTicket = ({
	focusAfterRestart,
}: CompletionTicketProps) => {
	const { startedAt, completedAt, correctCount } =
		useGameProgress();
	const headingId = useId();
	const minutes =
		startedAt === undefined || completedAt === undefined
			? undefined
			: Math.max(
					1,
					Math.round((completedAt - startedAt) / 60_000),
				);

	return (
		<section
			aria-labelledby={headingId}
			className="flex flex-col gap-5 rounded-2xl bg-primary p-6 text-primary-foreground"
		>
			<div className="flex items-center gap-5">
				<div className="grid size-20 shrink-0 place-items-center rounded-xl bg-background">
					<HuLoader className="w-12" />
				</div>
				<div className="flex flex-col gap-1">
					<h2
						id={headingId}
						className="font-black text-2xl"
					>
						{m.ticket_title()}
					</h2>
					<p className="font-semibold">{m.ticket_body()}</p>
				</div>
			</div>
			<dl className="grid grid-cols-2 gap-3">
				<div className="rounded-xl bg-black/15 p-3">
					<dt className="font-semibold text-sm">
						{m.ticket_score()}
					</dt>
					<dd className="font-black text-2xl">
						{m.ticket_score_value({
							correct: correctCount,
							total: STEPS.length,
						})}
					</dd>
				</div>
				{minutes !== undefined && (
					<div className="rounded-xl bg-black/15 p-3">
						<dt className="font-semibold text-sm">
							{m.ticket_time_taken()}
						</dt>
						<dd className="font-black text-2xl">
							{m.ticket_minutes({ minutes })}
						</dd>
					</div>
				)}
				<div className="col-span-2 rounded-xl bg-black/15 p-3">
					<dt className="font-semibold text-sm">
						{m.ticket_clock()}
					</dt>
					<dd className="font-black text-2xl tabular-nums">
						<LiveClock />
					</dd>
				</div>
			</dl>
			<p className="text-sm">{m.ticket_proof()}</p>
			<RestartDialog
				focusAfterRestart={focusAfterRestart}
			/>
		</section>
	);
};
