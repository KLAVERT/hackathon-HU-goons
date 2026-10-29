import { createFileRoute } from "@tanstack/react-router";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

export const Route = createFileRoute("/_app/")({
	head: () => ({
		meta: [{ title: makePageTitle(m.home_title()) }],
	}),
	component: HomePage,
});

function HomePage() {
	return (
		<h1 className="heading-medium">{m.home_title()}</h1>
	);
}
