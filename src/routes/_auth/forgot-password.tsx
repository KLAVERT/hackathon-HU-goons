import { createFileRoute } from "@tanstack/react-router";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

export const Route = createFileRoute(
	"/_auth/forgot-password",
)({
	head: () => ({
		meta: [
			{ title: makePageTitle(m.forgot_password_title()) },
		],
	}),
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	return (
		<h1 className="heading-medium text-center">
			{m.forgot_password_title()}
		</h1>
	);
}
