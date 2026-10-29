import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	redirect,
	Scripts,
} from "@tanstack/react-router";
import {
	NotFoundPage,
	ServerErrorPage,
} from "components/error-page/error-page";
import {
	baseLocale,
	getUrlOrigin,
	localizeHref,
	shouldRedirect,
} from "lib/paraglide/runtime";
import type { RouterContext } from "lib/router";

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
		errorComponent: ({ error }) => (
			<ServerErrorPage error={error} />
		),
		notFoundComponent: NotFoundPage,
	});
