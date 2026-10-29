import { encode } from "uqr";

type QrCodeProps = Readonly<{
	value: string;
	/** Accessible name, e.g. what the code links to */
	label: string;
	className?: string;
}>;

/**
 * Renders a QR code as a single SVG path, so it stays sharp when printed.
 */
export const QrCode = ({
	value,
	label,
	className,
}: QrCodeProps) => {
	const { data, size } = encode(value, {
		ecc: "M",
		border: 2,
	});
	const path = data
		.flatMap((row, y) =>
			row.map((isDark, x) =>
				isDark ? `M${x} ${y}h1v1h-1z` : "",
			),
		)
		.join("");

	return (
		<svg
			role="img"
			aria-label={label}
			viewBox={`0 0 ${size} ${size}`}
			shapeRendering="crispEdges"
			className={className}
		>
			<rect width={size} height={size} fill="#fff" />
			<path d={path} fill="#111" />
		</svg>
	);
};
