import { useEffect } from "react";
import { useTernaryDarkMode } from "usehooks-ts";

/** Also read by the inline script in index.html, which sets the theme before the first paint */
const THEME_STORAGE_KEY = "theme";

/**
 * Light or dark theme. Follows the OS setting until the user picks one, and
 * stays in sync across components and tabs.
 *
 * @example
 * const { isDarkMode, setTernaryDarkMode } = useTheme();
 * setTernaryDarkMode(isDarkMode ? "light" : "dark");
 */
export const useTheme = () =>
	useTernaryDarkMode({
		localStorageKey: THEME_STORAGE_KEY,
	});

/**
 * Keeps the `dark` class on `<html>` in sync with the theme. Call once, at the app root.
 *
 * @example
 * const App = () => {
 * 	useApplyTheme();
 * 	return <Routes />;
 * };
 */
export const useApplyTheme = () => {
	const { isDarkMode } = useTheme();

	useEffect(() => {
		document.documentElement.classList.toggle(
			"dark",
			isDarkMode,
		);
	}, [isDarkMode]);
};
