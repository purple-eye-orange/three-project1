import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { a } from "@react-spring/web";

function App() {
  const [clicked, setClicked] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  // 배경색 전환을 위한 스프링 애니메이션
  const backgroundSpring = useSpring({
    backgroundColor: clicked ? "#cdfffe" : "#ffe8fe",
    config: { duration: 1000 },
  });

  // 박스 색상 전환을 위한 스프링 애니메이션
  const boxSpring = useSpring({
    color: clicked ? "#1BEFF5" : "#fca5f1",
    config: { duration: 1000 },
  });

  // 박스 점프 애니메이션
  const jumpSpring = useSpring({
    y: isJumping ? 8 : 0, // 점프 높이를 8로 증가
    config: {
      mass: 1, // 질량
      tension: 400, // 장력
      friction: 17, // 마찰
      velocity: 0.5, // 초기 속도
    },
    onRest: () => {
      setIsJumping(false); // 애니메이션이 끝나면 상태 리셋
    },
  });

  const boxes = [
    // 1층 (5개)
    { position: [-5, 2.5, -5] },
    { position: [5, 2.5, -5] },
    { position: [0, 2.5, 0] },
    { position: [-5, 2.5, 5] },
    { position: [5, 2.5, 5] },

    // 2층 (5개)
    { position: [0, 7.5, -5] },
    { position: [-5, 7.5, 0] },
    { position: [5, 7.5, 0] },
    { position: [0, 7.5, 5] },
    { position: [0, 7.5, 0] },

    // 3층 (5개)
    { position: [-5, 12.5, -5] },
    { position: [5, 12.5, -5] },
    { position: [0, 12.5, 0] },
    { position: [-5, 12.5, 5] },
    { position: [5, 12.5, 5] },
  ];

  const AnimatedMesh = animated.mesh;

  const handleBackgroundClick = (e) => {
    // 배경 클릭 시에만 색상 변경
    if (e.target.id === "canvas-container") {
      setClicked(!clicked);
    }
  };

  const handleBoxClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setIsJumping(true); // 박스 클릭 시 점프 시작
  };

  return (
    <a.div
      id="canvas-container"
      style={{
        width: "100vw",
        height: "100vh",
        ...backgroundSpring,
      }}
      onClick={() => setClicked(!clicked)}
    >
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[30, 30, 30]} // 카메라 위치를 더 멀리 이동
          fov={50} // 시야각 조정
        />
        <OrbitControls
          target={[0, 5, 0]} // 카메라가 바라보는 중심점을 아래로 조정
          maxPolarAngle={Math.PI / 2} // 카메라 수직 회전 제한
        />
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[2, 3, 5]} />

        {boxes.map((box, index) => (
          <AnimatedMesh
            key={index}
            position={[
              box.position[0],
              box.position[1] - 5, // 모든 박스의 y 위치를 5만큼 아래로 이동
              box.position[2],
            ]}
            onClick={handleBoxClick}
          >
            <boxGeometry args={[5, 5, 5]} />
            <animated.meshStandardMaterial
              {...boxSpring}
              metalness={0.1}
              roughness={0.2}
            />
          </AnimatedMesh>
        ))}
      </Canvas>
    </a.div>
  );
}

export default App;
