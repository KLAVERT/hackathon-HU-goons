import { Switch } from "components/ui/switch";
import * as m from "lib/paraglide/messages";
import { useTheme } from "lib/theme";
import { cn } from "lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeToggle = () => {
	const { isDarkMode, setTernaryDarkMode } = useTheme();
	const Icon = isDarkMode ? MoonIcon : SunIcon;

	return (
		<Switch
			size="lg"
			aria-label={m.nav_dark_mode()}
			checked={isDarkMode}
			onCheckedChange={(checked) =>
				setTernaryDarkMode(checked ? "dark" : "light")
			}
		>
			{/* Keyed so the new icon spins in on every switch */}
			<Icon
				key={isDarkMode ? "moon" : "sun"}
				aria-hidden
				className={cn(
					"size-4 animate-in spin-in-90 zoom-in-50 duration-300",
					isDarkMode ? "text-primary" : "text-secondary",
				)}
			/>
		</Switch>
	);
};
