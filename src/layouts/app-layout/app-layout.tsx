import {
	Link,
	linkOptions,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import Logo from "assets/icons/logo.svg?react";
import { Button } from "components/ui/button";
import {
	NativeSelect,
	NativeSelectOption,
} from "components/ui/native-select";
import { postApiAuthLogout } from "lib/heyapi";
import { useLocale } from "lib/i18n";
import * as m from "lib/paraglide/messages";
import type { Locale } from "lib/paraglide/runtime";
import { locales, setLocale } from "lib/paraglide/runtime";

const links = linkOptions([
	{
		to: "/",
		icon: <Logo width="1rem" />,
		label: m.home_title,
	},
]);

const AppHeader = () => {
	const locale = useLocale();
	const navigate = useNavigate();

	const languageOptions = locales
		.toSorted((a, b) => a.localeCompare(b, locale))
		.map((lang) => ({
			value: lang,
			label:
				new Intl.DisplayNames([lang], {
					type: "language",
				}).of(lang) ?? "",
		}));

	const handleLogout = async () => {
		await postApiAuthLogout();
		navigate({ to: "/login" });
	};

	return (
		<header className="flex items-center justify-between gap-4 py-4">
			<nav className="flex items-center gap-4">
				{links.map((link) => (
					<Link
						key={link.to}
						to={link.to}
						className="flex items-center gap-1 text-foreground no-underline data-[status=active]:underline"
					>
						{link.icon}
						<span>{link.label()}</span>
					</Link>
				))}
			</nav>
			<div className="flex items-center gap-4">
				<NativeSelect
					name="lang"
					defaultValue={locale.toString()}
					onChange={({ currentTarget: { value } }) =>
						setLocale(value as Locale)
					}
				>
					{languageOptions.map(({ value, label }) => (
						<NativeSelectOption key={value} value={value}>
							{label}
						</NativeSelectOption>
					))}
				</NativeSelect>
				<Button variant="outline" onClick={handleLogout}>
					{m.nav_logout()}
				</Button>
			</div>
		</header>
	);
};

const AppLayout = () => (
	<div className="mx-auto flex min-h-dvh w-full max-w-125 flex-col gap-4 px-4 lg:max-w-360">
		<AppHeader />
		<main className="flex flex-1 flex-col">
			<Outlet />
		</main>
	</div>
);

export default AppLayout;
