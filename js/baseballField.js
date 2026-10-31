/**
 * 3D 實況滿貫王 3.0 豪華球場與特效引擎 (Three.js)
 * 包含：
 * - 日/夕陽/星光夜賽 3 階段動態天色與巨型光束
 * - 3 大傳奇魔王投手 3D 變身與氣場光環
 * - 4 把 3D 神兵球棒外觀即時換裝
 * - 打者真實繞壘奔跑動畫 + 黃金必殺覺醒氣場
 */
import * as THREE from 'three';

export class BaseballField {
  constructor(scene) {
    this.scene = scene;
    this.baseCoords = [
      new THREE.Vector3(0, 0, 27.5),     // 0: 本壘
      new THREE.Vector3(12.5, 0, 15),    // 1: 一壘
      new THREE.Vector3(0, 0, 2.5),      // 2: 二壘
      new THREE.Vector3(-12.5, 0, 15)    // 3: 三壘
    ];
    this.runners = [null, null, null];
    this.crowdMeshes = [];
    this.fielders = [];
    this.trailParticles = [];
    this.sparkParticles = [];
    this.lightBeams = [];
    this.isCrowdCheering = false;
    this.activeRunningAnim = null;

    this.createLights();
    this.createSkyStars();
    this.createField();
    this.createBasesAndBoxes();
    this.createStadiumAndCrowd();
    this.createLightTowers();
    this.createScoreboard();
    this.createCharacters();
    this.createFielders();
    this.createRunnersPool();
    this.createBallTrail();
  }

  createLights() {
    this.dirLight = new THREE.DirectionalLight(0xfffbeb, 1.5);
    this.dirLight.position.set(35, 65, 45);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    const d = 55;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    this.hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x15803d, 0.8);
    this.scene.add(this.hemiLight);
  }

  // 夜賽璀璨星空
  createSkyStars() {
    const starGeo = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < 300; i++) {
      positions.push(
        (Math.random() - 0.5) * 260,
        Math.random() * 90 + 25,
        (Math.random() - 0.5) * 200 - 40
      );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.starsMesh = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.9, transparent: true, opacity: 0 })
    );
    this.scene.add(this.starsMesh);
  }

  // 根據局數切換「陽光白晝 -> 熱血夕陽 -> 璀璨星光夜賽」
  setStadiumAtmosphere(stageIdx) {
    if (stageIdx === 0) {
      // 1~3局：晴空萬里
      this.scene.background.setHex(0x38bdf8);
      this.scene.fog.color.setHex(0x7dd3fc);
      this.dirLight.color.setHex(0xfffbeb);
      this.dirLight.intensity = 1.5;
      this.starsMesh.material.opacity = 0;
      this.lightBeams.forEach(b => b.visible = false);
    } else if (stageIdx === 1) {
      // 4~6局：魔幻黃金夕陽
      this.scene.background.setHex(0xf97316);
      this.scene.fog.color.setHex(0xfdba74);
      this.dirLight.color.setHex(0xfed7aa);
      this.dirLight.intensity = 1.3;
      this.starsMesh.material.opacity = 0.25;
      this.lightBeams.forEach(b => b.visible = true);
    } else {
      // 7~9局：大聯盟總決賽星光夜場
      this.scene.background.setHex(0x090d16);
      this.scene.fog.color.setHex(0x1e293b);
      this.dirLight.color.setHex(0xe0f2fe);
      this.dirLight.intensity = 1.6;
      this.starsMesh.material.opacity = 0.95;
      this.lightBeams.forEach(b => b.visible = true);
    }
  }

  createField() {
    const grassMain = new THREE.Mesh(
      new THREE.CircleGeometry(95, 64),
      new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 })
    );
    grassMain.rotation.x = -Math.PI / 2;
    grassMain.position.set(0, -0.05, 5);
    grassMain.receiveShadow = true;
    this.scene.add(grassMain);

    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.8 });
    for (let r = 18; r <= 72; r += 10) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 5, 48), stripeMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, -0.03, 15);
      ring.receiveShadow = true;
      this.scene.add(ring);
    }

    const dirtGeo = new THREE.PlaneGeometry(36, 36);
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0xb8622a, roughness: 0.9 });
    const dirtMesh = new THREE.Mesh(dirtGeo, dirtMat);
    dirtMesh.rotation.x = -Math.PI / 2;
    dirtMesh.rotation.z = Math.PI / 4;
    dirtMesh.position.set(0, 0.01, 15);
    dirtMesh.receiveShadow = true;
    this.scene.add(dirtMesh);

    const homeDirt = new THREE.Mesh(new THREE.CircleGeometry(4.5, 32), dirtMat);
    homeDirt.rotation.x = -Math.PI / 2;
    homeDirt.position.set(0, 0.015, 27.5);
    this.scene.add(homeDirt);

    const innerGrass = new THREE.Mesh(new THREE.CircleGeometry(10.5, 32), stripeMat);
    innerGrass.rotation.x = -Math.PI / 2;
    innerGrass.position.set(0, 0.02, 15);
    innerGrass.receiveShadow = true;
    this.scene.add(innerGrass);

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lineGeo = new THREE.PlaneGeometry(0.35, 80);

    const rightLine = new THREE.Mesh(lineGeo, lineMat);
    rightLine.rotation.x = -Math.PI / 2;
    rightLine.rotation.z = -Math.PI / 4;
    rightLine.position.set(28.2, 0.03, -0.7);
    this.scene.add(rightLine);

    const leftLine = new THREE.Mesh(lineGeo, lineMat);
    leftLine.rotation.x = -Math.PI / 2;
    leftLine.rotation.z = Math.PI / 4;
    leftLine.position.set(-28.2, 0.03, -0.7);
    this.scene.add(leftLine);

    const poleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.4 });
    const poleGeo = new THREE.CylinderGeometry(0.28, 0.28, 24, 12);
    const leftPole = new THREE.Mesh(poleGeo, poleMat);
    leftPole.position.set(-53, 12, -25.5);
    const rightPole = new THREE.Mesh(poleGeo, poleMat);
    rightPole.position.set(53, 12, -25.5);
    this.scene.add(leftPole, rightPole);
  }

  createBasesAndBoxes() {
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const baseGeo = new THREE.BoxGeometry(1.3, 0.22, 1.3);

    [1, 2, 3].forEach(idx => {
      const b = new THREE.Mesh(baseGeo, baseMat);
      b.position.copy(this.baseCoords[idx]);
      b.position.y = 0.12;
      b.rotation.y = Math.PI / 4;
      b.castShadow = true;
      this.scene.add(b);
    });

    const homePlate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 1.1), baseMat);
    homePlate.position.set(0, 0.05, 27.5);
    homePlate.rotation.y = Math.PI / 4;
    this.scene.add(homePlate);

    const boxEdges = new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.5, 2.5));
    const boxLineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const leftBox = new THREE.LineSegments(boxEdges, boxLineMat);
    leftBox.rotation.x = -Math.PI / 2;
    leftBox.position.set(-1.35, 0.04, 27.5);
    const rightBox = new THREE.LineSegments(boxEdges, boxLineMat);
    rightBox.rotation.x = -Math.PI / 2;
    rightBox.position.set(1.35, 0.04, 27.5);
    this.scene.add(leftBox, rightBox);

    const mound = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 4.4, 0.45, 32),
      new THREE.MeshStandardMaterial({ color: 0xa35220 })
    );
    mound.position.set(0, 0.22, 15);
    this.scene.add(mound);

    const rubber = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.35), baseMat);
    rubber.position.set(0, 0.46, 15);
    this.scene.add(rubber);
  }

  createStadiumAndCrowd() {
    const wallGeo = new THREE.CylinderGeometry(75, 75, 4.5, 56, 1, true, -Math.PI * 0.75, Math.PI * 0.5);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f2942, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 2.25, 27.5);
    wall.rotation.y = Math.PI;
    this.scene.add(wall);

    const trimGeo = new THREE.CylinderGeometry(75.1, 75.1, 0.4, 56, 1, true, -Math.PI * 0.75, Math.PI * 0.5);
    const trim = new THREE.Mesh(trimGeo, new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide }));
    trim.position.set(0, 4.5, 27.5);
    trim.rotation.y = Math.PI;
    this.scene.add(trim);

    const standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, side: THREE.DoubleSide });
    for (let tier = 0; tier < 3; tier++) {
      const r = 78 + tier * 4.5;
      const h = 5.5 + tier * 2.8;
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r, 2.6, 48, 1, true, -Math.PI * 0.72, Math.PI * 0.44),
        standMat
      );
      stand.position.set(0, h, 27.5);
      stand.rotation.y = Math.PI;
      this.scene.add(stand);
    }

    const colors = [0xef4444, 0x3b82f6, 0xeab308, 0x22c55e, 0xa855f7, 0xf97316, 0xffffff, 0xec4899];
    const fanGeo = new THREE.SphereGeometry(0.58, 8, 8);

    for (let i = 0; i < 100; i++) {
      const angle = -Math.PI * 0.21 + (Math.random() * Math.PI * 0.42);
      const tier = Math.floor(Math.random() * 3);
      const radius = 77.5 + tier * 4.2;
      const baseHeight = 6.8 + tier * 2.8;

      const color = colors[i % colors.length];
      const fan = new THREE.Mesh(fanGeo, new THREE.MeshBasicMaterial({ color }));
      fan.position.set(
        Math.sin(angle) * radius,
        baseHeight,
        27.5 - Math.cos(angle) * radius
      );
      fan.userData = { baseY: baseHeight, phase: Math.random() * Math.PI * 2 };
      this.scene.add(fan);
      this.crowdMeshes.push(fan);
    }
  }

  createLightTowers() {
    const positions = [[-48, -22], [-25, -45], [25, -45], [48, -22]];
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 });
    const lightPanelMat = new THREE.MeshBasicMaterial({ color: 0xfef9c3 });
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    });

    positions.forEach(([x, z]) => {
      const group = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 28, 12), poleMat);
      pole.position.y = 14;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(7.5, 3.8, 0.8), lightPanelMat);
      panel.position.y = 28;
      panel.lookAt(0, 0, 15);

      // 夜賽探照燈光束
      const beam = new THREE.Mesh(new THREE.ConeGeometry(12, 35, 16, 1, true), beamMat);
      beam.position.set(0, 16, 8);
      beam.rotation.x = Math.PI / 5;
      beam.visible = false;
      this.lightBeams.push(beam);

      group.add(pole, panel, beam);
      group.position.set(x, 0, z);
      this.scene.add(group);
    });
  }

  createScoreboard() {
    const boardGroup = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(30, 12, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 })
    );
    frame.position.y = 15;
    boardGroup.add(frame);

    const arch = new THREE.Mesh(
      new THREE.CylinderGeometry(6.5, 6.5, 1.6, 24, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.4 })
    );
    arch.rotation.x = Math.PI / 2;
    arch.rotation.z = -Math.PI / 2;
    arch.position.y = 21;
    boardGroup.add(arch);

    const pillarGeo = new THREE.CylinderGeometry(0.7, 0.7, 15, 12);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const p1 = new THREE.Mesh(pillarGeo, pillarMat);
    p1.position.set(-10, 7.5, 0);
    const p2 = new THREE.Mesh(pillarGeo, pillarMat);
    p2.position.set(10, 7.5, 0);
    boardGroup.add(p1, p2);

    boardGroup.position.set(0, 0, -52);
    this.scene.add(boardGroup);
  }

  buildPlayerMesh(colorHex, hasBat = false) {
    const group = new THREE.Group();
    const uniformMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.35 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });

    const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.8, 14), whiteMat);
    pants.position.y = 0.6;
    const jersey = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 1.0, 14), uniformMat);
    jersey.position.y = 1.45;

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 16), skinMat);
    head.position.y = 2.45;
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), uniformMat);
    helmet.position.y = 2.48;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.45), uniformMat);
    visor.position.set(0, 2.55, 0.4);

    group.add(pants, jersey, head, helmet, visor);
    group.uniformMaterials = [uniformMat];

    if (hasBat) {
      const batPivot = new THREE.Group();
      const batMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.3,
        roughness: 0.3,
        emissive: 0x000000,
        emissiveIntensity: 0
      });
      const batMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.048, 2.15, 14), batMat);
      batMesh.position.y = 1.02;
      batPivot.add(batMesh);
      batPivot.position.set(0.55, 1.55, 0.15);
      batPivot.rotation.z = -Math.PI / 5;
      batPivot.rotation.x = Math.PI / 7;
      group.add(batPivot);
      group.batPivot = batPivot;
      group.batMesh = batMesh;
      group.batMat = batMat;

      // 黃金必殺覺醒氣場光環 (預設隱藏)
      const auraGeo = new THREE.RingGeometry(0.85, 1.35, 24);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.rotation.x = -Math.PI / 2;
      aura.position.y = 0.08;
      aura.visible = false;
      group.add(aura);
      group.feverAura = aura;
    }

    return group;
  }

  // 切換 3D 神兵球棒外觀
  equipBatSkin(batType) {
    const mat = this.batterGroup.batMat;
    const mesh = this.batterGroup.batMesh;
    if (!mat || !mesh) return;

    if (batType === 'wood') {
      mat.color.setHex(0xd97706);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
      mesh.scale.set(1, 1, 1);
    } else if (batType === 'thunder') {
      // 雷神黃金棒
      mat.color.setHex(0xfacc15);
      mat.emissive.setHex(0xeab308);
      mat.emissiveIntensity = 0.55;
      mesh.scale.set(1.2, 1.08, 1.2);
    } else if (batType === 'dragon') {
      // 烈焰龍魂棒
      mat.color.setHex(0x38bdf8);
      mat.emissive.setHex(0x0284c7);
      mat.emissiveIntensity = 0.85;
      mesh.scale.set(1.35, 1.12, 1.35);
    } else if (batType === 'rainbow') {
      // 星際彩虹神棒
      mat.color.setHex(0xec4899);
      mat.emissive.setHex(0xa855f7);
      mat.emissiveIntensity = 1.0;
      mesh.scale.set(1.5, 1.18, 1.5);
    }
  }

  // 切換魔王投手 3D 外觀與體型
  setBossPitcherStyle(bossIdx) {
    const p = this.pitcherGroup;
    if (!p) return;
    const mat = p.uniformMaterials[0];
    if (bossIdx === 0) {
      // 森林暴熊隊長：深綠巨漢
      mat.color.setHex(0x15803d);
      p.scale.set(1.22, 1.15, 1.22);
      if (this.bossAura) this.bossAura.visible = false;
    } else if (bossIdx === 1) {
      // 閃電忍蛙・疾風丸：暗紫敏捷型
      mat.color.setHex(0x7e22ce);
      p.scale.set(1.0, 1.02, 1.0);
      if (this.bossAura) {
        this.bossAura.visible = true;
        this.bossAura.material.color.setHex(0xa855f7);
      }
    } else {
      // 黃金巨龍・大魔王凱撒：黑紅霸王 + 金色氣場
      mat.color.setHex(0xb91c1c);
      p.scale.set(1.38, 1.32, 1.38);
      if (this.bossAura) {
        this.bossAura.visible = true;
        this.bossAura.material.color.setHex(0xfacc15);
      }
    }
  }

  createCharacters() {
    // 1. 魔王投手
    this.pitcherGroup = this.buildPlayerMesh(0x15803d, false);
    this.pitcherGroup.position.set(0, 0.45, 15);

    const bossAuraGeo = new THREE.RingGeometry(1.1, 1.7, 24);
    const bossAuraMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    this.bossAura = new THREE.Mesh(bossAuraGeo, bossAuraMat);
    this.bossAura.rotation.x = -Math.PI / 2;
    this.bossAura.position.y = 0.05;
    this.bossAura.visible = false;
    this.pitcherGroup.add(this.bossAura);
    this.scene.add(this.pitcherGroup);

    // 2. 台灣小英雄打者
    this.batterGroup = this.buildPlayerMesh(0x2563eb, true);
    this.batGroup = this.batterGroup.batPivot;
    this.batterGroup.position.set(-1.25, 0, 27.5);
    this.batterGroup.rotation.y = Math.PI / 2.2;
    this.scene.add(this.batterGroup);

    // 3. 捕手
    this.catcherGroup = this.buildPlayerMesh(0xdc2626, false);
    this.catcherGroup.scale.set(1, 0.78, 1);
    this.catcherGroup.position.set(0, 0, 29.8);
    this.catcherGroup.rotation.y = Math.PI;
    this.scene.add(this.catcherGroup);

    // 4. 棒球
    const ballGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.35,
      roughness: 0.2
    });
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.castShadow = true;
    this.ball.position.set(0, 2.2, 15);
    this.scene.add(this.ball);
  }

  // 全壘打時讓打者繞著一、二、三壘奔跑慶祝！
  startBatterVictoryRun() {
    this.activeRunningAnim = { progress: 0 };
  }

  resetBatterToBox() {
    this.activeRunningAnim = null;
    this.batterGroup.position.set(-1.25, 0, 27.5);
    this.batterGroup.rotation.set(0, Math.PI / 2.2, 0);
  }

  createFielders() {
    const fielderCoords = [
      [14, 12], [7, 0], [-7, 0], [-14, 12],
      [-26, -18], [0, -25], [26, -18]
    ];
    fielderCoords.forEach(([x, z], i) => {
      const f = this.buildPlayerMesh(0xdc2626, false);
      f.position.set(x, 0, z);
      f.lookAt(0, 0, 27.5);
      f.userData = { baseX: x, phase: i * 1.1 };
      this.scene.add(f);
      this.fielders.push(f);
    });
  }

  createRunnersPool() {
    for (let i = 0; i < 3; i++) {
      const r = this.buildPlayerMesh(0x2563eb, false);
      r.position.copy(this.baseCoords[i + 1]);
      r.lookAt(this.baseCoords[(i + 2) % 4]);
      r.visible = false;
      this.scene.add(r);
      this.runners[i] = r;
    }
  }

  updateBaseRunners(bases) {
    for (let i = 0; i < 3; i++) {
      if (this.runners[i]) {
        this.runners[i].visible = !!bases[i];
        this.runners[i].position.copy(this.baseCoords[i + 1]);
      }
    }
  }

  createBallTrail() {
    const geo = new THREE.SphereGeometry(0.24, 8, 8);
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xf97316 : 0xfacc15,
        transparent: true,
        opacity: 0
      });
      const mesh = new THREE.Mesh(geo, mat);
      this.scene.add(mesh);
      this.trailParticles.push(mesh);
    }
  }

  spawnTrailAt(pos) {
    const p = this.trailParticles.shift();
    if (!p) return;
    p.position.copy(pos);
    p.scale.setScalar(1.05);
    p.material.opacity = 0.9;
    this.trailParticles.push(p);
  }

  spawnHitSparks(pos, isHomeRun = true) {
    const count = isHomeRun ? 28 : 12;
    const geo = new THREE.SphereGeometry(0.2, 6, 6);
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: isHomeRun ? (i % 2 === 0 ? 0xfacc15 : 0xef4444) : 0x38bdf8,
        transparent: true,
        opacity: 1
      });
      const spark = new THREE.Mesh(geo, mat);
      spark.position.copy(pos);
      spark.userData = {
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.85,
          Math.random() * 0.7 + 0.15,
          (Math.random() - 0.5) * 0.85
        ),
        life: 1.0
      };
      this.scene.add(spark);
      this.sparkParticles.push(spark);
    }
  }

  updateEffects(time) {
    this.trailParticles.forEach(p => {
      if (p.material.opacity > 0) {
        p.material.opacity -= 0.06;
        p.scale.multiplyScalar(0.92);
      }
    });

    for (let i = this.sparkParticles.length - 1; i >= 0; i--) {
      const s = this.sparkParticles[i];
      s.position.add(s.userData.vel);
      s.userData.vel.y -= 0.025;
      s.userData.life -= 0.04;
      s.material.opacity = Math.max(0, s.userData.life);
      if (s.userData.life <= 0) {
        this.scene.remove(s);
        s.geometry.dispose();
        s.material.dispose();
        this.sparkParticles.splice(i, 1);
      }
    }

    // 跑者繞壘慶祝動畫
    if (this.activeRunningAnim) {
      this.activeRunningAnim.progress = Math.min(1, this.activeRunningAnim.progress + 0.018);
      const totalSeg = this.activeRunningAnim.progress * 4;
      const segIdx = Math.min(3, Math.floor(totalSeg));
      const segT = totalSeg - segIdx;
      const from = this.baseCoords[segIdx];
      const to = this.baseCoords[(segIdx + 1) % 4];

      this.batterGroup.position.lerpVectors(from, to, segT);
      this.batterGroup.position.y = Math.abs(Math.sin(time * 18)) * 0.35;
      this.batterGroup.lookAt(to);
    }

    // 氣場旋轉
    if (this.batterGroup.feverAura && this.batterGroup.feverAura.visible) {
      this.batterGroup.feverAura.scale.setScalar(1 + Math.sin(time * 8) * 0.15);
    }
    if (this.bossAura && this.bossAura.visible) {
      this.bossAura.scale.setScalar(1 + Math.cos(time * 6) * 0.15);
    }

    const jumpAmp = this.isCrowdCheering ? 0.95 : 0.12;
    const speed = this.isCrowdCheering ? 13 : 3;
    this.crowdMeshes.forEach(fan => {
      fan.position.y = fan.userData.baseY + Math.abs(Math.sin(time * speed + fan.userData.phase)) * jumpAmp;
    });

    this.fielders.forEach(f => {
      f.position.y = Math.abs(Math.sin(time * 4 + f.userData.phase)) * 0.12;
    });
  }
}
