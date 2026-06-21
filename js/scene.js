// ORION Dashboard — 3D Scene
// Three.js interactive torus knot with gold/amber metallic material

//  THREE.JS — 3D SCENE
// ===================================================================
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  (async () => {
    const THREE = await import('three');
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08080f);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    canvas.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffeedd, 0.1));
    const key = new THREE.DirectionalLight(0xfbbf24, 1.5);
    key.position.set(3, 4, 5); scene.add(key);
    const fill = new THREE.DirectionalLight(0xf59e0b, 0.6);
    fill.position.set(-4, 2, 3); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.2);
    rim.position.set(0, -3, -4); scene.add(rim);

    // Torus Knot (gold/amber metallic)
    const geo = new THREE.TorusKnotGeometry(1.3, 0.35, 200, 32, 2, 3);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b, metalness: 0.7, roughness: 0.12,
      clearcoat: 0.9, clearcoatRoughness: 0.15,
      emissive: 0xd97706, emissiveIntensity: 0.08,
      envMapIntensity: 1.0, transparent: true, opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Wireframe
    const wireGeo = new THREE.TorusKnotGeometry(1.33, 0.37, 24, 8, 2, 3);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true, transparent: true, opacity: 0.05 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Core
    const coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.04 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Particles
    const pCount = 1200;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i*3+2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.018, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Drag rotation
    let isDragging = false, prevMouse = {x:0,y:0}, dragVel = {x:0,y:0};
    let targetRot = {x:0,y:0};
    document.addEventListener('mousedown', (e) => {
      if (e.target.closest('.btn, a, button, .wallet-option, .chain-option, .chain-btn')) return;
      isDragging = true; prevMouse = {x: e.clientX, y: e.clientY}; dragVel = {x:0,y:0};
      targetRot = {x: mesh.rotation.x, y: mesh.rotation.y};
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x, dy = e.clientY - prevMouse.y;
      targetRot.y += dx * 0.008; targetRot.x += dy * 0.008;
      dragVel = {x: dy * 0.008, y: dx * 0.008};
      prevMouse = {x: e.clientX, y: e.clientY};
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchstart', (e) => {
      if (e.target.closest('.btn, a, button, .wallet-option, .chain-option, .chain-btn')) return;
      const t = e.touches[0]; isDragging = true; prevMouse = {x: t.clientX, y: t.clientY}; dragVel = {x:0,y:0};
      targetRot = {x: mesh.rotation.x, y: mesh.rotation.y};
    }, {passive:true});
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const t = e.touches[0]; const dx = t.clientX - prevMouse.x, dy = t.clientY - prevMouse.y;
      targetRot.y += dx * 0.008; targetRot.x += dy * 0.008;
      dragVel = {x: dy * 0.008, y: dx * 0.008};
      prevMouse = {x: t.clientX, y: t.clientY};
    }, {passive:true});
    window.addEventListener('touchend', () => { isDragging = false; });

    // Resize
    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    function animate() {
      requestAnimationFrame(animate);
      const sr = Math.min(scrollY / (window.innerHeight * 1.5), 1.5);
      if (isDragging) {
        mesh.rotation.x += (targetRot.x - mesh.rotation.x) * 0.15;
        mesh.rotation.y += (targetRot.y - mesh.rotation.y) * 0.15;
      } else {
        dragVel.x *= 0.97; dragVel.y *= 0.97;
        mesh.rotation.x += dragVel.x * 0.5 + 0.001;
        mesh.rotation.y += dragVel.y * 0.5 + 0.003;
      }
      wire.rotation.copy(mesh.rotation);
      core.rotation.x = mesh.rotation.x * 0.8;
      core.rotation.y = mesh.rotation.y * 0.8;

      mesh.position.y = -sr * 1.0;
      wire.position.y = -sr * 1.0;
      core.position.y = -sr * 1.0;

      const pulse = Math.sin(Date.now() * 0.0008) * 0.5 + 0.5;
      mat.emissiveIntensity = 0.08 + pulse * 0.04;
      particles.rotation.y += 0.0004;
      particles.rotation.x += sr * 0.0002;
      camera.position.z = 8 - sr * 0.2;

      renderer.render(scene, camera);
    }
    animate();
  })();
