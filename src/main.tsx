import { QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "components/error-boundary/error-boundary";
import { ServerErrorPage } from "components/error-page/error-page";
import { Spinner } from "components/ui/spinner";
import { queryClient } from "lib/api";
import { loadZodLocale } from "lib/i18n";
import * as m from "lib/paraglide/messages";
import { getLocale } from "lib/paraglide/runtime";
import { AppRouter } from "lib/router";
import { useApplyTheme } from "lib/theme";
import { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "style/main.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error(
		"Something has gone terribly wrong. The app couldn't find its home :(",
	);
}

const root = createRoot(rootElement);

const LoadingFallback = () => (
	<div
		role="status"
		className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 text-center"
	>
		<Spinner aria-hidden className="size-12" />
		<p>{m.loading_message()}</p>
	</div>
);

const App = () => {
	const locale = getLocale();
	useApplyTheme();

	useEffect(() => {
		document.documentElement.setAttribute("lang", locale);
		loadZodLocale(locale);
	}, [locale]);

	return (
		<StrictMode>
			<ErrorBoundary
				fallback={(error) => (
					<ServerErrorPage error={error} />
				)}
			>
				<Suspense fallback={<LoadingFallback />}>
					<QueryClientProvider client={queryClient}>
						<AppRouter queryClient={queryClient} />
					</QueryClientProvider>
				</Suspense>
			</ErrorBoundary>
		</StrictMode>
	);
};

root.render(<App />);
