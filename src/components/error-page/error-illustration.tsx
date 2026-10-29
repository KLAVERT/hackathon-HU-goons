// The U of the HU logo as a filled outline, see assets/icons/logo.svg
const U_PATH =
	"M51.217 22.073V.263h-7.29v21.81a3.644 3.644 0 0 1-3.647 3.636 3.636 3.636 0 0 1-3.645-3.636V.263h-7.292l-.004 21.81c0 6.038 4.89 10.907 10.941 10.907 6.051 0 10.939-4.87 10.939-10.907h-.002Z";

type ErrorIllustrationProps = Readonly<{
	code: 404 | 500;
	className?: string;
}>;

/**
 * The HU mark telling what went wrong:
 * - 404: the U is missing, drawn dashed like a slot that isn't found yet
 * - 500: the mark has fallen over
 */
export const ErrorIllustration = ({
	code,
	className,
}: ErrorIllustrationProps) => (
	<svg
		viewBox="-8 -8 72 64"
		aria-hidden="true"
		className={className}
	>
		{code === 404 ? (
			<>
				<g fill="#00A1E1">
					<rect
						x="0.18"
						y="0.263"
						width="7.29"
						height="43.621"
					/>
					<rect
						x="14.76"
						y="0.263"
						width="7.291"
						height="18.174"
					/>
					<rect
						x="14.76"
						y="25.708"
						width="7.291"
						height="18.176"
					/>
				</g>
				<path
					d={U_PATH}
					fill="none"
					stroke="var(--primary)"
					strokeWidth="1.2"
					strokeDasharray="2.4 1.8"
					strokeLinejoin="round"
					className="motion-safe:animate-[hu-march_1.4s_linear_infinite]"
				/>
			</>
		) : (
			<>
				<g fill="#00A1E1">
					<rect
						x="0.18"
						y="0.263"
						width="7.29"
						height="43.621"
					/>
					<rect
						x="14.76"
						y="0.263"
						width="7.291"
						height="18.174"
						transform="rotate(-28 22.05 18.44)"
					/>
					<rect
						x="14.76"
						y="25.708"
						width="7.291"
						height="18.176"
					/>
				</g>
				<path
					d={U_PATH}
					fill="#E6302B"
					transform="translate(6 10) rotate(32 40.28 33)"
				/>
			</>
		)}
	</svg>
);
