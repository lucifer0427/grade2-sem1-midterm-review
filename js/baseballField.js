/**
 * 次世代 3D 實況野球級球場建構器 (Three.js)
 * 包含：條紋草皮、紅土鑽石內野、打擊區、外野看台與歡呼觀眾、巨型燈塔、
 * 守備陣容、3D 壘上跑者、火焰魔球尾跡、擊球爆炸粒子
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
    this.runners = [null, null, null]; // 一、二、三壘上的 3D 跑者模型
    this.crowdMeshes = [];
    this.fielders = [];
    this.trailParticles = [];
    this.sparkParticles = [];
    this.isCrowdCheering = false;

    this.createLights();
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
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.5);
    dirLight.position.set(35, 65, 45);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    const d = 55;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x15803d, 0.75);
    this.scene.add(hemiLight);
  }

  createField() {
    // 1. 外野大草皮與深淺條紋圓環
    const grassMain = new THREE.Mesh(
      new THREE.CircleGeometry(95, 64),
      new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.85 })
    );
    grassMain.rotation.x = -Math.PI / 2;
    grassMain.position.set(0, -0.05, 5);
    grassMain.receiveShadow = true;
    this.scene.add(grassMain);

    // 條紋草皮環 (Mowing Stripes)
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.85 });
    for (let r = 18; r <= 72; r += 10) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 5, 48), stripeMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, -0.03, 15);
      ring.receiveShadow = true;
      this.scene.add(ring);
    }

    // 2. 內野紅土區
    const dirtGeo = new THREE.PlaneGeometry(36, 36);
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0xb8622a, roughness: 0.9 });
    const dirtMesh = new THREE.Mesh(dirtGeo, dirtMat);
    dirtMesh.rotation.x = -Math.PI / 2;
    dirtMesh.rotation.z = Math.PI / 4;
    dirtMesh.position.set(0, 0.01, 15);
    dirtMesh.receiveShadow = true;
    this.scene.add(dirtMesh);

    // 本壘圓形紅土區
    const homeDirt = new THREE.Mesh(new THREE.CircleGeometry(4.2, 32), dirtMat);
    homeDirt.rotation.x = -Math.PI / 2;
    homeDirt.position.set(0, 0.015, 27.5);
    this.scene.add(homeDirt);

    // 3. 內野中央草皮
    const innerGrass = new THREE.Mesh(new THREE.CircleGeometry(10.5, 32), stripeMat);
    innerGrass.rotation.x = -Math.PI / 2;
    innerGrass.position.set(0, 0.02, 15);
    innerGrass.receiveShadow = true;
    this.scene.add(innerGrass);

    // 4. 白色界外線與兩側黃色全壘打標竿 (Foul Poles)
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

    // 黃色高聳全壘打標竿
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.3 });
    const poleGeo = new THREE.CylinderGeometry(0.25, 0.25, 22, 12);
    const leftPole = new THREE.Mesh(poleGeo, poleMat);
    leftPole.position.set(-53, 11, -25.5);
    const rightPole = new THREE.Mesh(poleGeo, poleMat);
    rightPole.position.set(53, 11, -25.5);
    this.scene.add(leftPole, rightPole);
  }

  createBasesAndBoxes() {
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const baseGeo = new THREE.BoxGeometry(1.3, 0.22, 1.3);

    // 一、二、三壘包
    [1, 2, 3].forEach(idx => {
      const b = new THREE.Mesh(baseGeo, baseMat);
      b.position.copy(this.baseCoords[idx]);
      b.position.y = 0.12;
      b.rotation.y = Math.PI / 4;
      b.castShadow = true;
      this.scene.add(b);
    });

    // 本壘板與打擊框白線
    const homePlate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 1.1), baseMat);
    homePlate.position.set(0, 0.05, 27.5);
    homePlate.rotation.y = Math.PI / 4;
    this.scene.add(homePlate);

    // 左/右打者打擊區白框
    const boxEdges = new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.4, 2.4));
    const boxLineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const leftBox = new THREE.LineSegments(boxEdges, boxLineMat);
    leftBox.rotation.x = -Math.PI / 2;
    leftBox.position.set(-1.35, 0.04, 27.5);
    const rightBox = new THREE.LineSegments(boxEdges, boxLineMat);
    rightBox.rotation.x = -Math.PI / 2;
    rightBox.position.set(1.35, 0.04, 27.5);
    this.scene.add(leftBox, rightBox);

    // 投手丘與投手板
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
    // 外野全壘打牆
    const wallGeo = new THREE.CylinderGeometry(75, 75, 4.5, 56, 1, true, -Math.PI * 0.75, Math.PI * 0.5);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f2942, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 2.25, 27.5);
    wall.rotation.y = Math.PI;
    this.scene.add(wall);

    // 牆頂黃色全壘打線
    const trimGeo = new THREE.CylinderGeometry(75.1, 75.1, 0.4, 56, 1, true, -Math.PI * 0.75, Math.PI * 0.5);
    const trim = new THREE.Mesh(trimGeo, new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide }));
    trim.position.set(0, 4.5, 27.5);
    trim.rotation.y = Math.PI;
    this.scene.add(trim);

    // 階梯式外野觀眾看台 (3層)
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, side: THREE.DoubleSide });
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

    // 80 名歡呼觀眾小人 (分佈在外野看台)
    const colors = [0xef4444, 0x3b82f6, 0xeab308, 0x22c55e, 0xa855f7, 0xf97316, 0xffffff];
    const fanGeo = new THREE.SphereGeometry(0.55, 8, 8);

    for (let i = 0; i < 80; i++) {
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
    // 4 座大聯盟高空照明燈塔
    const positions = [
      [-48, -22], [-25, -45], [25, -45], [48, -22]
    ];
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 });
    const lightPanelMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });

    positions.forEach(([x, z]) => {
      const group = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 28, 12), poleMat);
      pole.position.y = 14;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 0.8), lightPanelMat);
      panel.position.y = 28;
      panel.lookAt(0, 0, 15);
      group.add(pole, panel);
      group.position.set(x, 0, z);
      this.scene.add(group);
    });
  }

  createScoreboard() {
    const boardGroup = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(28, 11, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 })
    );
    frame.position.y = 15;
    boardGroup.add(frame);

    const arch = new THREE.Mesh(
      new THREE.CylinderGeometry(6, 6, 1.6, 24, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    arch.rotation.x = Math.PI / 2;
    arch.rotation.z = -Math.PI / 2;
    arch.position.y = 20.5;
    boardGroup.add(arch);

    const pillarGeo = new THREE.CylinderGeometry(0.7, 0.7, 15, 12);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const p1 = new THREE.Mesh(pillarGeo, pillarMat);
    p1.position.set(-9, 7.5, 0);
    const p2 = new THREE.Mesh(pillarGeo, pillarMat);
    p2.position.set(9, 7.5, 0);
    boardGroup.add(p1, p2);

    boardGroup.position.set(0, 0, -52);
    this.scene.add(boardGroup);
  }

  // 建立通用 Q 版實況野球球員模型
  buildPlayerMesh(colorHex, hasBat = false) {
    const group = new THREE.Group();
    const uniformMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });

    // Q版身體與球褲
    const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.8, 14), whiteMat);
    pants.position.y = 0.6;
    const jersey = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 1.0, 14), uniformMat);
    jersey.position.y = 1.45;

    // Q版大頭與棒球帽
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 16), skinMat);
    head.position.y = 2.45;
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), uniformMat);
    helmet.position.y = 2.48;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.45), uniformMat);
    visor.position.set(0, 2.55, 0.4);

    group.add(pants, jersey, head, helmet, visor);
    group.castShadow = true;

    if (hasBat) {
      const batPivot = new THREE.Group();
      const batMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.5, roughness: 0.2 });
      const batMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.045, 2.1, 12), batMat);
      batMesh.position.y = 1.0;
      batPivot.add(batMesh);
      batPivot.position.set(0.55, 1.55, 0.15);
      batPivot.rotation.z = -Math.PI / 5;
      batPivot.rotation.x = Math.PI / 7;
      group.add(batPivot);
      group.batPivot = batPivot;
    }

    return group;
  }

  createCharacters() {
    // 1. 投手 (紅色客隊)
    this.pitcherGroup = this.buildPlayerMesh(0xdc2626, false);
    this.pitcherGroup.position.set(0, 0.45, 15);
    this.scene.add(this.pitcherGroup);

    // 2. 打者 (藍色主隊台灣英雄)
    this.batterGroup = this.buildPlayerMesh(0x2563eb, true);
    this.batGroup = this.batterGroup.batPivot;
    this.batterGroup.position.set(-1.25, 0, 27.5);
    this.batterGroup.rotation.y = Math.PI / 2.2;
    this.scene.add(this.batterGroup);

    // 3. 捕手 (在本壘後方蹲捕)
    this.catcherGroup = this.buildPlayerMesh(0xdc2626, false);
    this.catcherGroup.scale.set(1, 0.78, 1);
    this.catcherGroup.position.set(0, 0, 29.8);
    this.catcherGroup.rotation.y = Math.PI;
    this.scene.add(this.catcherGroup);

    // 4. 棒球與目標預覽光圈
    const ballGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.25,
      roughness: 0.2
    });
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.castShadow = true;
    this.ball.position.set(0, 2.2, 15);
    this.scene.add(this.ball);
  }

  createFielders() {
    // 內外野守備員 (一壘、二壘、三壘、游擊、左中右外野)
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
    // 建立一、二、三壘上的藍隊跑者模型 (預設隱藏，上壘時顯示)
    for (let i = 0; i < 3; i++) {
      const r = this.buildPlayerMesh(0x2563eb, false);
      r.position.copy(this.baseCoords[i + 1]);
      r.lookAt(this.baseCoords[(i + 2) % 4]);
      r.visible = false;
      this.scene.add(r);
      this.runners[i] = r;
    }
  }

  // 更新壘包上 3D 跑者的可見狀態 (bases: [bool, bool, bool])
  updateBaseRunners(bases) {
    for (let i = 0; i < 3; i++) {
      if (this.runners[i]) {
        this.runners[i].visible = !!bases[i];
        this.runners[i].position.copy(this.baseCoords[i + 1]);
      }
    }
  }

  createBallTrail() {
    // 火焰魔球軌跡粒子池
    const geo = new THREE.SphereGeometry(0.22, 8, 8);
    for (let i = 0; i < 14; i++) {
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

  // 在球後方生成火焰殘影
  spawnTrailAt(pos) {
    const p = this.trailParticles.shift();
    if (!p) return;
    p.position.copy(pos);
    p.scale.setScalar(1.0);
    p.material.opacity = 0.85;
    this.trailParticles.push(p);
  }

  // 擊球瞬間產生 3D 黃金爆炸火花
  spawnHitSparks(pos, isHomeRun = true) {
    const count = isHomeRun ? 24 : 10;
    const geo = new THREE.SphereGeometry(0.18, 6, 6);
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
          (Math.random() - 0.5) * 0.7,
          Math.random() * 0.6 + 0.1,
          (Math.random() - 0.5) * 0.7
        ),
        life: 1.0
      };
      this.scene.add(spark);
      this.sparkParticles.push(spark);
    }
  }

  // 每幀更新觀眾歡呼、守備員呼吸律動、火焰殘影與爆炸粒子
  updateEffects(time) {
    // 1. 火焰軌跡衰減
    this.trailParticles.forEach(p => {
      if (p.material.opacity > 0) {
        p.material.opacity -= 0.06;
        p.scale.multiplyScalar(0.92);
      }
    });

    // 2. 爆炸火花移動與回收
    for (let i = this.sparkParticles.length - 1; i >= 0; i--) {
      const s = this.sparkParticles[i];
      s.position.add(s.userData.vel);
      s.userData.vel.y -= 0.025; // 重力
      s.userData.life -= 0.04;
      s.material.opacity = Math.max(0, s.userData.life);
      if (s.userData.life <= 0) {
        this.scene.remove(s);
        s.geometry.dispose();
        s.material.dispose();
        this.sparkParticles.splice(i, 1);
      }
    }

    // 3. 觀眾跳躍歡呼
    const jumpAmp = this.isCrowdCheering ? 0.85 : 0.12;
    const speed = this.isCrowdCheering ? 12 : 3;
    this.crowdMeshes.forEach(fan => {
      fan.position.y = fan.userData.baseY + Math.abs(Math.sin(time * speed + fan.userData.phase)) * jumpAmp;
    });

    // 4. 守備員待命律動
    this.fielders.forEach(f => {
      f.position.y = Math.abs(Math.sin(time * 4 + f.userData.phase)) * 0.12;
    });
  }
}
