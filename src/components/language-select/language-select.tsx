import NlFlag from "assets/flags/nl.svg?react";
import UsFlag from "assets/flags/us.svg?react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "components/ui/select";
import * as m from "lib/paraglide/messages";
import {
	getLocale,
	isLocale,
	type Locale,
	locales,
	setLocale,
} from "lib/paraglide/runtime";

const flags = {
	"nl-NL": NlFlag,
	"en-US": UsFlag,
} satisfies Record<Locale, unknown>;

// Language name in its own language, without the region: "Nederlands", "English"
const languageName = (locale: Locale) =>
	new Intl.DisplayNames([locale], { type: "language" }).of(
		new Intl.Locale(locale).language,
	) ?? locale;

const LanguageOption = ({
	locale,
	isCompact = false,
}: Readonly<{
	locale: Locale;
	/** Only the flag on small screens, so the header fits on a phone */
	isCompact?: boolean;
}>) => {
	const Flag = flags[locale];
	return (
		<>
			<span className="h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-foreground/10">
				<Flag aria-hidden className="size-full" />
			</span>
			<span
				lang={locale}
				className={isCompact ? "max-sm:sr-only" : undefined}
			>
				{languageName(locale)}
			</span>
		</>
	);
};

export const LanguageSelect = () => (
	<Select
		value={getLocale()}
		onValueChange={(value) => {
			if (isLocale(value)) setLocale(value);
		}}
	>
		<SelectTrigger
			aria-label={m.nav_language()}
			className="gap-2 font-semibold data-[size=default]:h-10"
		>
			<SelectValue>
				{(value) =>
					isLocale(value) && (
						<LanguageOption locale={value} isCompact />
					)
				}
			</SelectValue>
		</SelectTrigger>
		<SelectContent align="end" alignItemWithTrigger={false}>
			{locales.map((locale) => (
				<SelectItem
					key={locale}
					value={locale}
					className="py-2 font-semibold"
				>
					<LanguageOption locale={locale} />
				</SelectItem>
			))}
		</SelectContent>
	</Select>
);
