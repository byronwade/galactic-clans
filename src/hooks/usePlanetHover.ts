import { useRef, useCallback, useState } from "react";

interface HoverState {
	isHovered: boolean;
	planetData: any;
	mousePosition: { x: number; y: number };
}

export const usePlanetHover = () => {
	const raycasterRef = useRef<any>(null);
	const mouseRef = useRef({ x: 0, y: 0 });
	const [hoverState, setHoverState] = useState<HoverState>({
		isHovered: false,
		planetData: null,
		mousePosition: { x: 0, y: 0 },
	});

	const initializeRaycaster = useCallback(async () => {
		if (!raycasterRef.current) {
			const THREE = await import("three");
			raycasterRef.current = new THREE.Raycaster();
		}
		return raycasterRef.current;
	}, []);

	const handleMouseMove = useCallback(
		(event: MouseEvent, camera: any, planets: any[]) => {
			if (!camera || !raycasterRef.current) return;

			// Update mouse position
			mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

			// Update raycaster
			raycasterRef.current.setFromCamera(mouseRef.current, camera);

			// Check for intersections with planets
			const intersects = raycasterRef.current.intersectObjects(planets, true);

			if (intersects.length > 0) {
				const intersectedObject = intersects[0].object;
				let planetMesh = intersectedObject;

				// Find the planet mesh (may be nested in groups)
				while (planetMesh.parent && !planetMesh.userData.planetData) {
					planetMesh = planetMesh.parent;
				}

				if (planetMesh.userData.planetData) {
					setHoverState({
						isHovered: true,
						planetData: planetMesh.userData.planetData,
						mousePosition: { x: event.clientX, y: event.clientY },
					});

					// Change cursor to pointer
					document.body.style.cursor = "pointer";
					return;
				}
			}

			// No intersection found
			if (hoverState.isHovered) {
				setHoverState({
					isHovered: false,
					planetData: null,
					mousePosition: { x: 0, y: 0 },
				});
				document.body.style.cursor = "default";
			}
		},
		[hoverState.isHovered]
	);

	const handleMouseLeave = useCallback(() => {
		setHoverState({
			isHovered: false,
			planetData: null,
			mousePosition: { x: 0, y: 0 },
		});
		document.body.style.cursor = "default";
	}, []);

	const attachPlanetData = useCallback((mesh: any, data: any) => {
		mesh.userData.planetData = data;
	}, []);

	return {
		hoverState,
		initializeRaycaster,
		handleMouseMove,
		handleMouseLeave,
		attachPlanetData,
		clearHover: () =>
			setHoverState({
				isHovered: false,
				planetData: null,
				mousePosition: { x: 0, y: 0 },
			}),
	};
};
