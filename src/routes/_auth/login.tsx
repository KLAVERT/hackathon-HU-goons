import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	useNavigate,
} from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
	Field,
	FieldError,
	FieldLabel,
} from "components/ui/field";
import { Input } from "components/ui/input";
import { useAppForm } from "lib/forms";
import {
	mutateAndValidate,
	toFieldErrors,
} from "lib/forms/validation-helpers";
import type { LoginRequest } from "lib/heyapi";
import { postApiAuthLoginMutation } from "lib/heyapi/@tanstack/react-query.gen";
import { zLoginRequest } from "lib/heyapi/zod.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import z from "zod";

const loginSearchSchema = z.object({
	redirect: z.optional(
		z.string().startsWith("/").catch("/"),
	),
});

export const Route = createFileRoute("/_auth/login")({
	validateSearch: loginSearchSchema,
	head: () => ({
		meta: [{ title: makePageTitle(m.login_title()) }],
	}),
	component: LoginPage,
});

function LoginPage() {
	const { redirect } = Route.useSearch();
	const navigate = useNavigate();

	const mutation = useMutation({
		...postApiAuthLoginMutation(),
		gcTime: 0,
		onSuccess: () => navigate({ to: redirect || "/" }),
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		} satisfies LoginRequest,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: zLoginRequest,
			onSubmitAsync: ({ value }) =>
				mutateAndValidate(mutation, { body: value }),
		},
	});

	return (
		<>
			<h1 className="heading-medium text-center">
				{m.login_title()}
			</h1>
			<form
				onSubmit={(evt) => {
					evt.preventDefault();
					form.handleSubmit();
				}}
			>
				<fieldset
					disabled={mutation.isPending}
					className="flex flex-col gap-8"
				>
					<form.Field name="email">
						{(field) => (
							<Field
								data-invalid={!field.state.meta.isValid}
							>
								<FieldLabel htmlFor={field.name}>
									{m.login_email()}
								</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									autoComplete="email"
									value={field.state.value}
									onChange={(evt) =>
										field.handleChange(evt.target.value)
									}
									onBlur={field.handleBlur}
									aria-invalid={!field.state.meta.isValid}
								/>
								<FieldError
									errors={toFieldErrors(
										field.state.meta.errors,
									)}
								/>
							</Field>
						)}
					</form.Field>
					<form.Field name="password">
						{(field) => (
							<Field
								data-invalid={!field.state.meta.isValid}
							>
								<FieldLabel htmlFor={field.name}>
									{m.login_password()}
								</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									type="password"
									autoComplete="current-password"
									value={field.state.value}
									onChange={(evt) =>
										field.handleChange(evt.target.value)
									}
									onBlur={field.handleBlur}
									aria-invalid={!field.state.meta.isValid}
								/>
								<FieldError
									errors={toFieldErrors(
										field.state.meta.errors,
									)}
								/>
								<Link
									to="/forgot-password"
									className="self-end text-primary text-sm underline-offset-4 hover:underline"
								>
									{m.login_forgot_password()}
								</Link>
							</Field>
						)}
					</form.Field>

					<form.Subscribe
						selector={(state) => {
							const errBag = state.errorMap.onSubmit;
							return typeof errBag === "string"
								? errBag
								: errBag?.form;
						}}
					>
						{(formError) => (
							<FieldError
								errors={toFieldErrors(formError)}
							/>
						)}
					</form.Subscribe>
					<Button type="submit" size="lg">
						{m.login_submit()}
					</Button>
				</fieldset>
			</form>
		</>
	);
}
