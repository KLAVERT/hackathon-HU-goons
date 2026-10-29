import { cn } from "lib/utils";

type HuLoaderProps = Readonly<{ className?: string }>;

/**
 * Looping HU logo animation. The keyframes live in `index.html`, so the boot
 * preloader can play them before any JS loads; keep this markup in sync with it.
 */
export const HuLoader = ({ className }: HuLoaderProps) => (
	<svg
		viewBox="0 0 51.4 44"
		aria-hidden="true"
		className={cn("hu-loader", className)}
	>
		<g fill="#00A1E1">
			<rect
				className="bar bar-l"
				x="0.18"
				y="0.263"
				width="7.29"
				height="43.621"
			/>
			<rect
				className="bar bar-tr"
				x="14.76"
				y="0.263"
				width="7.291"
				height="18.174"
			/>
			<rect
				className="bar bar-br"
				x="14.76"
				y="25.708"
				width="7.291"
				height="18.176"
			/>
		</g>
		<path
			className="u"
			pathLength={1}
			d="M32.989 0.263V22.073A7.2915 7.2915 0 0 0 47.572 22.073V0.263"
			fill="none"
			stroke="#E6302B"
			strokeWidth="7.29"
		/>
	</svg>
);
