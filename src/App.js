import React, { useRef, useEffect } from "react";
import "./App.css";
import { Canvas, extend, useThree, useFrame } from "react-three-fiber";
import {
  CubeTextureLoader,
  CubeCamera,
  WebGLCubeRenderTarget,
  RGBFormat,
  LinearMipmapLinearFilter,
} from "three";
import { OrbitControls } from "@react-three/drei";

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef();
  useFrame(() => controls.current.update());
  return (
    <OrbitControls
      ref={controls}
      args={[camera, domElement]}
      autoRotate={true}
      enableZoom={true}
    />
  );
};

function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  const texture = loader.load([
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
  ]);
  scene.background = texture;
  return null;
}

function Sphere({ position, rotation, args }) {
  const { scene, gl } = useThree();
  const cubeRenderTarget = new WebGLCubeRenderTarget(256, {
    format: RGBFormat,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
  });
  const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget);
  cubeCamera.position.set(position[0], position[1], position[2]);
  scene.add(cubeCamera);
  useFrame(() => cubeCamera.update(gl, scene));

  return (
    <mesh visible position={position} rotation={rotation} castShadow>
      <sphereGeometry attach="geometry" args={args} />
      <meshBasicMaterial
        attach="material"
        envMap={cubeCamera.renderTarget.texture}
        color="white"
        roughness={0.1}
        metalness={1}
      />
    </mesh>
  );
}

function App() {
  return (
    <>
      <Canvas>
        {/* <OrbitControls /> */}
        <CameraControls />
        <Sphere position={[0, 0, 0]} rotation={[0, 0, 0]} args={[2, 32, 32]} />
        <Sphere position={[10, 0, 0]} rotation={[0, 0, 0]} args={[5, 32, 32]} />
        <SkyBox />
      </Canvas>
    </>
  );
}

export default App;
