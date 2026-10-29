import {
	createFormHook,
	createFormHookContexts,
} from "@tanstack/react-form";

export const {
	fieldContext,
	formContext,
	useFieldContext,
} = createFormHookContexts();

/**
 * Connecting a form element to tanstack involves passing a lot of properties.
 * In order to make it easier, we can define reusable form controls. This hook
 * is meant to connect them via `fieldComponents` and `formComponents`.
 *
 * There usually is only 1 useAppForm in the project. So any field should
 * be defined here.
 */
export const { useAppForm, withForm } = createFormHook({
	fieldContext,
	formContext,

	fieldComponents: {},
	formComponents: {},
});
