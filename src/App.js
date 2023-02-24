import React from "react";
import "./App.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import buildingTexture from "../src/assets/building.PNG";
function App() {
  const refContainer = React.useRef(null);
  React.useEffect(() => {
    const scene = new THREE.Scene();
    let currentIntersect = null;
    // const camera = new THREE.PerspectiveCamera(
    //   45,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // );
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 4;

    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);
    const light = new THREE.PointLight();
    light.position.set(10, 10, 10);
    scene.add(light);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // Texture
    const texture = new THREE.TextureLoader().load(buildingTexture);

    // plain
    const geometry = new THREE.PlaneGeometry(3, 3);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    const bbox = new THREE.Box3().setFromObject(plane);
    const center = bbox.getCenter(new THREE.Vector3());
    plane.position.sub(center);
    camera.lookAt(plane);
    plane.name = "plane";
    scene.add(plane);
    // Orbit control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 1;
    controls.maxDistance = 5;

    // controls.maxPolarAngle = Math.PI / 2;
    // New Habd
    // const shape = new THREE.Shape();
    // shape.moveTo(0, 0);
    // shape.lineTo(-2, 2);
    // shape.lineTo(2, 2);
    // shape.lineTo(2, -2);
    // shape.lineTo(-2, -2);

    // const extrudeSettings = {
    //   depth: 2,
    //   bevelEnabled: false,
    // };

    // const geometryZoka = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // const materialZoka = new THREE.MeshBasicMaterial({ color: 0x00ff00,wireframe:true });
    // const mesh = new THREE.Mesh(geometryZoka, materialZoka);
    // scene.add(mesh)
    // Add Static Line

    const materialLine = new THREE.LineBasicMaterial({
      color: "red",
    });
    const points = [];
    points.push(new THREE.Vector2(-1, 0));
    points.push(new THREE.Vector2(0, 1));
    points.push(new THREE.Vector2(1, 0));
    points.push(new THREE.Vector2(0, -1));
    points.push(new THREE.Vector2(-1, -1));
    // points.push(new THREE.Vector2(-1, 2));

    const geometryLine = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometryLine, materialLine);

    scene.add(line);

    // for ( let i = 0; i < points.length; i ++ );

    const rec = new THREE.Shape(points);

    const extrudeSettings = {
      depth: 2,
      bevelEnabled: false,
      //bevelSegments: 2,
      steps: 2,
    };
    // Rycaster
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // window.addEventListener("click", () => {
    //   if (currentIntersect) {
    //     console.log("KosmMapbox");
    //   }
    // });

    let geometryII = new THREE.ShapeGeometry(rec);

    let materialfash5 = new THREE.MeshBasicMaterial({
      color: "green",
      side: THREE.DoubleSide,
      wireframe: false,
    });
    const geometryZoka = new THREE.ExtrudeGeometry(rec, extrudeSettings);

    const meshmsh = new THREE.Mesh(geometryZoka, materialfash5);
    meshmsh.name = "meshmsh";
    scene.add(meshmsh);

    window.addEventListener("mousemove", (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // console.log("pointer", pointer);
    });
    // immediately use the texture for material creation
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    function render() {
      renderer.render(scene, camera);
    }

    const tick = () => {
      raycaster.setFromCamera(pointer, camera);
      const objectsToTest = [meshmsh];
      const intersects = raycaster.intersectObjects([meshmsh]);

      objectsToTest.map((e) => {
        e.material.color.set("#ff0000");
      });
      intersects.map((e) => {
        e.object.material.color.set("#0000ff");
      });

      if (intersects.length) {
        if (!currentIntersect) {
          console.log("mouse enter");
        }

        currentIntersect = intersects[0];
      } else {
        if (currentIntersect) {
          console.log("mouse leave");
        }

        currentIntersect = null;
      }

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    // animate();
    tick();

    refContainer.current.appendChild(renderer.domElement);

    return () => refContainer.current.removeChild(renderer.domElement);
  }, []);
  return (
    <div style={{ height: "100vh" }}>
      <div ref={refContainer}></div>
    </div>
  );
}

export default App;
