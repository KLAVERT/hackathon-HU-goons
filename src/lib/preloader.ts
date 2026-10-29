/**
 * Fades out the boot preloader from `index.html` and removes it.
 * Safe to call more than once.
 *
 * @example
 * router.subscribe("onRendered", hidePreloader);
 */
export const hidePreloader = () => {
	const preloader = document.getElementById("preloader");
	if (
		!preloader ||
		preloader.classList.contains("is-done")
	) {
		return;
	}
	preloader.classList.add("is-done");
	preloader.addEventListener(
		"transitionend",
		() => preloader.remove(),
		{ once: true },
	);
};
