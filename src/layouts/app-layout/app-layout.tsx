import {
	Link,
	Outlet,
	useSearch,
} from "@tanstack/react-router";
import Logo from "assets/icons/logo.svg?react";
import { ProgressBar } from "components/game/progress-bar";
import { LanguageSelect } from "components/language-select/language-select";
import * as m from "lib/paraglide/messages";
import { ExternalLinkIcon } from "lucide-react";

const MAIN_ID = "main";

const AppHeader = () => {
	const { scanned } = useSearch({ strict: false });

	return (
		<header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-4 pb-3 sm:px-8">
				<div className="flex items-center justify-between gap-4">
					<Link
						to="/"
						aria-label={m.nav_home()}
						className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-4"
					>
						<Logo
							aria-hidden
							className="h-10 w-auto sm:h-12"
						/>
					</Link>
					<LanguageSelect />
				</div>
				<ProgressBar highlightId={scanned?.toString()} />
			</div>
		</header>
	);
};

const AppFooter = () => (
	<footer className="border-t bg-muted">
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
			<p className="font-semibold">{m.footer_event()}</p>
			<a
				href="https://www.hu.nl"
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-1.5 self-start rounded-sm font-bold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
			>
				{m.footer_more_info()}
				<ExternalLinkIcon aria-hidden className="size-4" />
				<span className="sr-only">
					{m.footer_new_tab()}
				</span>
			</a>
		</div>
	</footer>
);

const AppLayout = () => (
	<div className="flex min-h-dvh flex-col">
		<a
			href={`#${MAIN_ID}`}
			className="sr-only z-20 rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
		>
			{m.nav_skip_to_content()}
		</a>
		<AppHeader />
		<main
			id={MAIN_ID}
			tabIndex={-1}
			className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 outline-none sm:px-8 sm:py-12"
		>
			<Outlet />
		</main>
		<AppFooter />
	</div>
);

export default AppLayout;
