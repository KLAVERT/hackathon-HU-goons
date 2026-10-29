import { createFileRoute } from "@tanstack/react-router";
import { HuLoader } from "components/hu-loader/hu-loader";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

export const Route = createFileRoute("/preloader")({
	head: () => ({
		meta: [{ title: makePageTitle(m.preloader_title()) }],
	}),
	component: PreloaderPage,
});

function PreloaderPage() {
	return (
		<main className="grid min-h-dvh place-items-center bg-background">
			<h1 className="sr-only">{m.preloader_title()}</h1>
			<HuLoader className="w-[min(160px,40vw)]" />
		</main>
	);
}
