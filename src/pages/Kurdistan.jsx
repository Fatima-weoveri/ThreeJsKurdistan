import { PresentationControls, Stage, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Model({ setLandscape, ...props }) {
  const gltf = useGLTF("/landscape_free.glb");

  useEffect(() => {
    // Ensure the terrain is positioned above the ground level
    gltf.scene.position.set(0, 0, 0); // Set the terrain's position here

    setLandscape(gltf.scene);
  }, [gltf, setLandscape]);

  return <primitive object={gltf.scene} {...props} scale={[0.8, 0.8, 0.8]} />;
}

function Marker({ initialPosition, landscape, onClick }) {
  const markerRef = useRef();

  useEffect(() => {
    if (landscape && markerRef.current) {
      const raycaster = new THREE.Raycaster();
      raycaster.params.Line.threshold = 0.1;
      const direction = new THREE.Vector3(0, -1, 0);
      const positionAdjusted = initialPosition.clone();
      positionAdjusted.y += 1;

      raycaster.set(positionAdjusted, direction);

      const intersects = raycaster.intersectObject(landscape, true);
      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;

        markerRef.current.position.copy(intersectionPoint);
        markerRef.current.position.y += 0.17;
      } else {
        console.warn("No intersection found for marker at", initialPosition);
      }
    }
  }, [initialPosition, landscape]);

  const { scene } = useGLTF("/pointer.glb");
  const clone = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clone}
      ref={markerRef}
      scale={[0.02, 0.02, 0.02]}
      onPointerDown={(e) => {
        e.stopPropagation(); // Prevent click events from bubbling up
        if (onClick) {
          onClick(initialPosition); // Pass marker's position or other info to callback
        }
      }}
    />
  );
}

const coordinates = [
  new THREE.Vector3(0, 0, 0), // Midpoint of the bounds
  new THREE.Vector3(-0.4, 0.02, -0.4), // A point near the bottom-left-front corner
  new THREE.Vector3(0.4, 0.08, 0.4), // A point near the top-right-back corner
  new THREE.Vector3(0.2, 1.5, -0.6), // A point near the top-right-back corner
];

function Kurdistan() {
  const [landscape, setLandscape] = useState(null);

  return (
    <div>
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ fov: 45 }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          touchAction: "none",
        }}
      >
        <color attach="background" args={["#BFA899"]} />
        <PresentationControls
          speed={1.5}
          global
          zoom={1}
          polar={[-0.1, Math.PI / 4]}
        >
          <Stage environment="sunset">
            {coordinates.map((coord, index) => {
              return (
                <Marker
                  key={index}
                  initialPosition={coord}
                  landscape={landscape}
                  onClick={() => console.log("clicked!")}
                />
              );
            })}
            <Model scale={0.8} setLandscape={setLandscape} />
          </Stage>
        </PresentationControls>
      </Canvas>
    </div>
  );
}

export default Kurdistan;
