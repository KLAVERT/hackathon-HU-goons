import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// HU logo colors, plus a darker and a lighter blue for depth
const COLORS = ["#00a1e1", "#e6302b", "#0073a5", "#7fd0f0"];
const PIECE_COUNT = 140;
const DURATION_MS = 4000;

type Piece = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	angle: number;
	spin: number;
	width: number;
	height: number;
	color: string;
};

const createPiece = (width: number): Piece => ({
	x: Math.random() * width,
	y: -20 - Math.random() * 200,
	vx: (Math.random() - 0.5) * 4,
	vy: 2 + Math.random() * 4,
	angle: Math.random() * Math.PI,
	spin: (Math.random() - 0.5) * 0.2,
	// Slim bars, like the bars in the HU logo
	width: 4 + Math.random() * 3,
	height: 12 + Math.random() * 14,
	color:
		COLORS[Math.floor(Math.random() * COLORS.length)] ??
		"#00a1e1",
});

/** One burst of HU-colored confetti over the whole screen. */
export const Confetti = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		if (
			!canvas ||
			!context ||
			window.matchMedia("(prefers-reduced-motion: reduce)")
				.matches
		) {
			return;
		}

		const ratio = window.devicePixelRatio || 1;
		const { innerWidth: width, innerHeight: height } =
			window;
		canvas.width = width * ratio;
		canvas.height = height * ratio;
		context.scale(ratio, ratio);

		const pieces = Array.from({ length: PIECE_COUNT }, () =>
			createPiece(width),
		);
		const start = performance.now();
		let frame = 0;

		const draw = (time: number) => {
			const elapsed = time - start;
			context.clearRect(0, 0, width, height);
			// Fade out during the last second
			context.globalAlpha = Math.min(
				1,
				(DURATION_MS - elapsed) / 1000,
			);
			for (const piece of pieces) {
				piece.vy += 0.05;
				piece.vx *= 0.99;
				piece.x +=
					piece.vx + Math.sin(elapsed / 300 + piece.angle);
				piece.y += piece.vy;
				piece.angle += piece.spin;
				context.save();
				context.translate(piece.x, piece.y);
				context.rotate(piece.angle);
				context.fillStyle = piece.color;
				context.fillRect(
					-piece.width / 2,
					-piece.height / 2,
					piece.width,
					piece.height,
				);
				context.restore();
			}
			if (elapsed < DURATION_MS) {
				frame = requestAnimationFrame(draw);
			} else {
				context.clearRect(0, 0, width, height);
			}
		};
		frame = requestAnimationFrame(draw);

		return () => cancelAnimationFrame(frame);
	}, []);

	// Portal to body, so it renders above dialogs (#root is an isolated stacking context)
	return createPortal(
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 z-60"
		>
			<canvas ref={canvasRef} className="size-full" />
		</div>,
		document.body,
	);
};
