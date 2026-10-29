import Logo from "assets/icons/logo.svg?react";
import {
	Button,
	buttonVariants,
} from "components/ui/button";
import * as m from "lib/paraglide/messages";
import { hidePreloader } from "lib/preloader";
import { makePageTitle } from "lib/title";
import { cn } from "lib/utils";
import { ArrowLeftIcon, RotateCwIcon } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { ErrorIllustration } from "./error-illustration";

const actionClassName = "h-11 gap-2 px-4 font-bold";

type ErrorPageProps = Readonly<{
	code: 404 | 500;
	title: string;
	description: string;
	actions: ReactNode;
	children?: ReactNode;
}>;

// Uses plain links instead of router links, so it also works when the router itself failed
const ErrorPage = ({
	code,
	title,
	description,
	actions,
	children,
}: ErrorPageProps) => {
	// The router may never finish rendering, so don't wait for it to hide the preloader
	useEffect(() => {
		hidePreloader();
	}, []);

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<title>{makePageTitle(title)}</title>
			<header className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-8">
				<a
					href="/"
					aria-label={m.nav_home()}
					className="inline-block rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-4"
				>
					<Logo
						aria-hidden
						className="h-10 w-auto sm:h-12"
					/>
				</a>
			</header>
			<main className="flex flex-1 items-center justify-center px-4 pb-16">
				<div className="flex max-w-xl flex-col items-center gap-6 text-center">
					<ErrorIllustration
						code={code}
						className="w-36 sm:w-44"
					/>
					<p className="font-black text-primary text-sm uppercase tracking-widest">
						{m.error_code({ code })}
					</p>
					<h1 className="heading-medium">{title}</h1>
					<p className="text-lg text-muted-foreground sm:text-xl">
						{description}
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						{actions}
					</div>
					{children}
				</div>
			</main>
		</div>
	);
};

export const NotFoundPage = () => (
	<ErrorPage
		code={404}
		title={m.not_found_title()}
		description={m.not_found_body()}
		actions={
			<a
				href="/"
				className={cn(
					buttonVariants({ size: "lg" }),
					actionClassName,
				)}
			>
				<ArrowLeftIcon aria-hidden className="size-5" />
				{m.not_found_home()}
			</a>
		}
	/>
);

export const ServerErrorPage = ({
	error,
}: Readonly<{ error: unknown }>) => (
	<ErrorPage
		code={500}
		title={m.error_page_title()}
		description={m.error_page_body()}
		actions={
			<>
				<Button
					size="lg"
					onClick={() => window.location.reload()}
					className={actionClassName}
				>
					<RotateCwIcon aria-hidden className="size-5" />
					{m.error_page_retry()}
				</Button>
				<a
					href="/"
					className={cn(
						buttonVariants({
							variant: "outline",
							size: "lg",
						}),
						actionClassName,
					)}
				>
					{m.error_page_home()}
				</a>
			</>
		}
	>
		{import.meta.env.DEV && error instanceof Error && (
			<details className="w-full rounded-xl border bg-muted p-4 text-left">
				<summary className="cursor-pointer font-bold">
					{m.error_page_details()}
				</summary>
				<pre className="mt-3 overflow-auto whitespace-pre-wrap text-sm">
					{error.stack ?? error.message}
				</pre>
			</details>
		)}
	</ErrorPage>
);
