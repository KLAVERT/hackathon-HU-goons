import { Outlet } from "@tanstack/react-router";
import Logo from "assets/icons/logo.svg?react";

const AuthLayout = () => (
	<div className="mx-auto flex min-h-dvh w-full max-w-125 flex-col justify-center gap-8 px-4">
		<div className="flex justify-center">
			<Logo className="h-12 w-auto" />
		</div>
		<div className="flex flex-col gap-8">
			<Outlet />
		</div>
	</div>
);

export default AuthLayout;
