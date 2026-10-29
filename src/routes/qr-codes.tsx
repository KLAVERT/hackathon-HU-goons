import { createFileRoute } from "@tanstack/react-router";
import Logo from "assets/icons/logo.svg?react";
import { QrCode } from "components/qr-code/qr-code";
import { Button } from "components/ui/button";
import { STEPS } from "lib/game/steps";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import { PrinterIcon } from "lucide-react";

export const Route = createFileRoute("/qr-codes")({
	head: () => ({
		meta: [{ title: makePageTitle(m.qr_title()) }],
	}),
	component: QrCodesPage,
});

function QrCodesPage() {
	// QR codes link to the domain this page is served from
	const { origin } = window.location;

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8 print:max-w-none print:p-0">
			<div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
				<div className="flex flex-col gap-2">
					<h1 className="heading-small">{m.qr_title()}</h1>
					<p className="max-w-2xl text-lg text-muted-foreground">
						{m.qr_intro()}
					</p>
				</div>
				<Button
					size="lg"
					onClick={() => window.print()}
					className="h-11 gap-2 px-4 font-bold"
				>
					<PrinterIcon aria-hidden className="size-5" />
					{m.qr_print()}
				</Button>
			</div>
			<ul className="grid gap-6 sm:grid-cols-2 print:block">
				{STEPS.map((step) => {
					const url = `${origin}/step/${step.id}`;
					return (
						<li
							key={step.id}
							className="flex flex-col items-center gap-5 rounded-2xl border-2 border-hu-blue p-8 text-center print:h-screen print:break-after-page print:justify-center print:rounded-none print:border-0"
						>
							<Logo aria-hidden className="h-10 w-auto" />
							<p className="font-black text-2xl">
								{m.qr_poster_heading()}
							</p>
							<QrCode
								value={url}
								label={m.qr_code_label({
									step: step.title(),
								})}
								className="w-full max-w-64 print:max-w-[60vh]"
							/>
							<p className="font-black text-secondary text-xl">
								{m.qr_poster_scan()}
							</p>
							<p className="font-black text-4xl">
								{step.title()}
							</p>
							<p className="break-all text-muted-foreground text-sm">
								{url}
							</p>
						</li>
					);
				})}
			</ul>
		</main>
	);
}
