import {
	createRootRouteWithContext,
	ErrorComponent,
	HeadContent,
	Outlet,
	redirect,
	Scripts,
} from "@tanstack/react-router";
import * as m from "lib/paraglide/messages";
import {
	baseLocale,
	getUrlOrigin,
	localizeHref,
	shouldRedirect,
} from "lib/paraglide/runtime";
import type { RouterContext } from "lib/router";

const NotFoundPage = () => (
	<h1 className="heading-medium">{m.not_found_title()}</h1>
);

export const Route =
	createRootRouteWithContext<RouterContext>()({
		head: ({ matches }) => {
			// Make sure locale redirects don't penalize seo
			const pathname = matches.at(-1)?.pathname ?? "/";
			return {
				links: [
					{
						rel: "canonical",
						href:
							getUrlOrigin() +
							localizeHref(pathname, {
								locale: baseLocale,
							}),
					},
				],
			};
		},
		beforeLoad: async () => {
			// Check if url matches the locale, if not redirect
			const decision = await shouldRedirect({
				url: window.location.href,
			});
			if (decision.redirectUrl) {
				throw redirect({ href: decision.redirectUrl.href });
			}
		},
		component: () => (
			<>
				<HeadContent />
				<Outlet />
				<Scripts />
			</>
		),
		errorComponent: (error) => (
			<ErrorComponent error={error} />
		),
		notFoundComponent: NotFoundPage,
	});
