import {
	createFileRoute,
	redirect,
} from "@tanstack/react-router";
import { recordScan } from "lib/game/progress";

// QR code landing route: records the step, then shows progress on the home page
export const Route = createFileRoute("/step/$stepId")({
	beforeLoad: ({ params }) => {
		const result = recordScan(params.stepId);
		throw redirect({
			to: "/",
			search:
				result.status === "unknown"
					? { unknown: true }
					: { scanned: Number(result.step.id) },
			replace: true,
		});
	},
});
