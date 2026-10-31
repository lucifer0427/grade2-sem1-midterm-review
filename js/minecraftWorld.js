/**
 * 3D 麥塊方塊冒險版：體素世界與像素材質引擎 (Three.js Voxel Engine)
 * 100% 程式化生成 16x16 像素貼圖 (THREE.NearestFilter)，零外部圖片依賴：
 * - 三大生態域：主世界綠茵平原 (Overworld) -> 熾熱下界要塞 (Nether) -> 終界黑曜石之巔 (The End)
 * - 三大體素魔王：巨型苦力怕 (Creeper) -> 烈焰使者王 (Blaze) -> 終界黑龍王 (Ender Dragon)
 * - 左 [A]、中 [S]、右 [D] 三座懸浮發光礦石方塊 + 挖礦碎裂粒子 + 經驗球特效
 * - 鑽石小勇者 (Steve) + 4 把 3D 像素神兵換裝 + 披風自訂編號
 */
import * as THREE from 'three';

export class MinecraftWorld {
  constructor(scene) {
    this.scene = scene;
    this.textures = {};
    this.groundBlocks = [];
    this.treeMeshes = [];
    this.oreBlocks = [];
    this.debrisParticles = [];
    this.xpOrbs = [];
    this.blazeRods = [];
    this.dragonWings = [];
    this.projectile = null;
    this.currentStage = 0;

    this.initPixelTextures();
    this.createLights();
    this.createSkyParticles();
    this.createVoxelTerrain();
    this.createTreesAndPillars();
    this.createHeroCharacter();
    this.createBossGroup();
    this.createMysteryOreBlocks();
    this.createEnergyProjectile();
  }

  // 產生 16x16 經典像素風貼圖 (NearestFilter 保持銳利馬賽克方塊感)
  makePixelTexture(baseColor, noiseColors, spots = []) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 16, 16);

    // 隨機種子固定像素雜訊
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        if ((x * 7 + y * 13) % 5 === 0) {
          ctx.fillStyle = noiseColors[(x + y) % noiseColors.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // 繪製礦石斑點或特殊圖樣
    spots.forEach(([sx, sy, sw, sh, col]) => {
      ctx.fillStyle = col;
      ctx.fillRect(sx, sy, sw, sh);
    });

    // 方塊微邊框強化立體積木感
    ctx.strokeStyle = 'rgba(0,0,0,0.22)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, 15, 15);

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  initPixelTextures() {
    this.textures.grassTop = this.makePixelTexture('#4ade80', ['#22c55e', '#16a34a', '#86efac']);
    this.textures.dirt = this.makePixelTexture('#92400e', ['#78350f', '#b45309', '#451a03']);
    this.textures.nether = this.makePixelTexture('#7f1d1d', ['#991b1b', '#450a0a', '#ef4444']);
    this.textures.endStone = this.makePixelTexture('#fef08a', ['#fde047', '#ca8a04', '#fef9c3']);
    this.textures.wood = this.makePixelTexture('#78350f', ['#451a03', '#92400e']);
    this.textures.leaves = this.makePixelTexture('#15803d', ['#166534', '#22c55e', '#14532d']);
    this.textures.obsidian = this.makePixelTexture('#1e1b4b', ['#0f172a', '#312e81', '#4c1d95']);
    this.textures.bedrock = this.makePixelTexture('#334155', ['#0f172a', '#1e293b', '#64748b']);

    // 三座選項礦石貼圖：鑽石礦 [A]、黃金礦 [S]、綠寶石紅石礦 [D]
    const oreSpots = (color, hi) => [
      [3, 3, 3, 2, color], [4, 4, 1, 1, hi],
      [10, 4, 3, 3, color], [11, 5, 1, 1, hi],
      [4, 10, 4, 2, color], [5, 10, 1, 1, hi],
      [10, 11, 3, 2, color]
    ];
    this.textures.diamondOre = this.makePixelTexture('#64748b', ['#475569', '#94a3b8'], oreSpots('#38bdf8', '#e0f2fe'));
    this.textures.goldOre = this.makePixelTexture('#64748b', ['#475569', '#94a3b8'], oreSpots('#facc15', '#fef9c3'));
    this.textures.emeraldOre = this.makePixelTexture('#64748b', ['#475569', '#94a3b8'], oreSpots('#4ade80', '#dcfce7'));
  }

  createLights() {
    this.dirLight = new THREE.DirectionalLight(0xfffbeb, 1.5);
    this.dirLight.position.set(25, 45, 30);
    this.dirLight.castShadow = true;
    this.scene.add(this.dirLight);

    this.hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x166534, 0.85);
    this.scene.add(this.hemiLight);
  }

  createSkyParticles() {
    const geo = new THREE.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 220; i++) {
      pos.push((Math.random() - 0.5) * 140, Math.random() * 55 + 8, (Math.random() - 0.5) * 100 - 15);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    this.skyParticles = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.75, transparent: true, opacity: 0.35 })
    );
    this.scene.add(this.skyParticles);
  }

  // 建立 3D 方塊地形平台
  createVoxelTerrain() {
    this.terrainGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    this.topMat = new THREE.MeshStandardMaterial({ map: this.textures.grassTop, roughness: 0.85 });
    const underMat = new THREE.MeshStandardMaterial({ map: this.textures.dirt, roughness: 0.9 });

    for (let x = -18; x <= 18; x += 2) {
      for (let z = -22; z <= 32; z += 2) {
        // 邊緣高低起伏的麥塊階梯地形
        const dist = Math.hypot(x, z - 6);
        let y = -1;
        if (dist > 22) y = 1;
        if (dist > 26) y = 3;

        const block = new THREE.Mesh(boxGeo, this.topMat);
        block.position.set(x, y, z);
        block.receiveShadow = true;
        this.terrainGroup.add(block);
        this.groundBlocks.push(block);

        if (y > -1) {
          const filler = new THREE.Mesh(boxGeo, underMat);
          filler.position.set(x, y - 2, z);
          this.terrainGroup.add(filler);
        }
      }
    }
    this.scene.add(this.terrainGroup);
  }

  // 建立方塊橡木樹與黑曜石柱
  createTreesAndPillars() {
    const treePositions = [
      [-14, -10], [14, -10], [-16, 4], [16, 4], [-12, -18], [12, -18]
    ];
    const boxGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    this.trunkMat = new THREE.MeshStandardMaterial({ map: this.textures.wood });
    this.leafMat = new THREE.MeshStandardMaterial({ map: this.textures.leaves });

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      for (let h = 1; h <= 3; h++) {
        const log = new THREE.Mesh(boxGeo, this.trunkMat);
        log.position.y = h * 1.8 - 0.5;
        tree.add(log);
      }
      for (let lx = -1; lx <= 1; lx++) {
        for (let lz = -1; lz <= 1; lz++) {
          const leaf = new THREE.Mesh(boxGeo, this.leafMat);
          leaf.position.set(lx * 1.6, 6.2, lz * 1.6);
          tree.add(leaf);
        }
      }
      const topLeaf = new THREE.Mesh(boxGeo, this.leafMat);
      topLeaf.position.set(0, 7.8, 0);
      tree.add(topLeaf);

      tree.position.set(tx, 0, tz);
      this.scene.add(tree);
      this.treeMeshes.push(tree);
    });
  }

  // 切換三大生態域與魔王 (0: 主世界苦力怕, 1: 下界烈焰使者, 2: 終界黑龍)
  setBiomeAndBossStage(stageIdx) {
    this.currentStage = stageIdx;
    if (stageIdx === 0) {
      this.scene.background.setHex(0x38bdf8);
      this.scene.fog.color.setHex(0x7dd3fc);
      this.topMat.map = this.textures.grassTop;
      this.trunkMat.map = this.textures.wood;
      this.leafMat.map = this.textures.leaves;
      this.skyParticles.material.color.setHex(0xffffff);
      this.skyParticles.material.opacity = 0.35;
    } else if (stageIdx === 1) {
      this.scene.background.setHex(0x450a0a);
      this.scene.fog.color.setHex(0x7f1d1d);
      this.topMat.map = this.textures.nether;
      this.trunkMat.map = this.textures.obsidian;
      this.leafMat.map = this.textures.goldOre;
      this.skyParticles.material.color.setHex(0xf97316);
      this.skyParticles.material.opacity = 0.85;
    } else {
      this.scene.background.setHex(0x090d16);
      this.scene.fog.color.setHex(0x1e1b4b);
      this.topMat.map = this.textures.endStone;
      this.trunkMat.map = this.textures.obsidian;
      this.leafMat.map = this.textures.obsidian;
      this.skyParticles.material.color.setHex(0xd8b4fe);
      this.skyParticles.material.opacity = 0.95;
    }
    this.topMat.needsUpdate = true;
    this.trunkMat.needsUpdate = true;
    this.leafMat.needsUpdate = true;

    if (this.creeperBoss) this.creeperBoss.visible = stageIdx === 0;
    if (this.blazeBoss) this.blazeBoss.visible = stageIdx === 1;
    if (this.dragonBoss) this.dragonBoss.visible = stageIdx === 2;
  }

  // 建立鑽石小勇者 (Steve) 與手部揮動工具 + 背部編號披風
  createHeroCharacter() {
    this.heroGroup = new THREE.Group();

    const cyanMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfdba74, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });

    const legs = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.65), blueMat);
    legs.position.y = 0.65;
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.7), cyanMat);
    torso.position.y = 2.0;
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.15), skinMat);
    head.position.y = 3.3;
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.45, 1.25), hairMat);
    helmet.position.y = 3.72;

    // 勇者披風編號 (CanvasTexture)
    const capeCanvas = document.createElement('canvas');
    capeCanvas.width = 128;
    capeCanvas.height = 128;
    const capeTex = new THREE.CanvasTexture(capeCanvas);
    const capeMat = new THREE.MeshBasicMaterial({ map: capeTex, side: THREE.DoubleSide });
    const capeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.35), capeMat);
    capeMesh.position.set(0, 1.95, 0.45);
    capeMesh.rotation.x = -0.1;
    this.heroGroup.capeCanvas = capeCanvas;
    this.heroGroup.capeTex = capeTex;
    this.updateHeroCapeNumber('99');

    // 右手與像素神兵樞紐
    this.armPivot = new THREE.Group();
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.3, 0.45), cyanMat);
    rightArm.position.y = -0.45;
    this.armPivot.add(rightArm);

    // 3D 像素十字鎬 / 神劍模型
    const toolGroup = new THREE.Group();
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      emissive: 0x000000,
      emissiveIntensity: 0
    });
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.18), handleMat);
    handle.position.y = 0.6;
    const pickHead = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.32, 0.24), headMat);
    pickHead.position.y = 1.35;
    toolGroup.add(handle, pickHead);
    toolGroup.position.set(0, -0.95, -0.35);
    toolGroup.rotation.x = -Math.PI / 3;

    this.armPivot.add(toolGroup);
    this.armPivot.position.set(0.88, 2.55, 0);
    this.heroGroup.toolHeadMat = headMat;
    this.heroGroup.toolHeadMesh = pickHead;

    // 超級 TNT / 紅石覺醒光環
    const auraGeo = new THREE.RingGeometry(1.1, 1.65, 4);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.08;
    aura.visible = false;
    this.heroGroup.feverAura = aura;

    this.heroGroup.add(legs, torso, head, helmet, capeMesh, this.armPivot, aura);
    this.heroGroup.position.set(0, 0, 21.5);
    this.scene.add(this.heroGroup);
  }

  updateHeroCapeNumber(numStr) {
    const canvas = this.heroGroup?.capeCanvas;
    const tex = this.heroGroup?.capeTex;
    if (!canvas || !tex) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, 116, 116);

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 64px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(numStr || '99').slice(0, 2), 64, 68);
    tex.needsUpdate = true;
  }

  equipWeaponSkin(weaponId) {
    const mat = this.heroGroup?.toolHeadMat;
    const mesh = this.heroGroup?.toolHeadMesh;
    if (!mat || !mesh) return;

    if (weaponId === 'wood_pick') {
      mat.color.setHex(0xb45309);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
      mesh.scale.set(1, 1, 1);
    } else if (weaponId === 'gold_sword') {
      mat.color.setHex(0xfacc15);
      mat.emissive.setHex(0xca8a04);
      mat.emissiveIntensity = 0.6;
      mesh.scale.set(0.45, 2.2, 1.1);
    } else if (weaponId === 'diamond_pick') {
      mat.color.setHex(0x38bdf8);
      mat.emissive.setHex(0x0284c7);
      mat.emissiveIntensity = 0.85;
      mesh.scale.set(1.3, 1.15, 1.2);
    } else if (weaponId === 'netherite_trident') {
      mat.color.setHex(0xa855f7);
      mat.emissive.setHex(0xec4899);
      mat.emissiveIntensity = 1.0;
      mesh.scale.set(1.5, 1.4, 1.3);
    }
  }

  // 建立三大體素魔王 (苦力怕、烈焰使者、終界黑龍)
  createBossGroup() {
    this.bossRoot = new THREE.Group();
    this.bossRoot.position.set(0, 0, -4);
    this.scene.add(this.bossRoot);

    // 1. 巨型苦力怕隊長 (Creeper)
    this.creeperBoss = new THREE.Group();
    const creeperMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });
    const darkMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });

    const cBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.8, 1.4), creeperMat);
    cBody.position.y = 3.1;
    const cHead = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 2.4), creeperMat);
    cHead.position.y = 6.2;

    // 苦力怕經典像素五官
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), darkMat);
    eyeL.position.set(-0.55, 6.5, 1.21);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.55;
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.1), darkMat);
    mouth.position.set(0, 5.65, 1.21);

    const legGeo = new THREE.BoxGeometry(1.0, 1.4, 1.0);
    const leg1 = new THREE.Mesh(legGeo, creeperMat); leg1.position.set(-0.7, 0.7, 0.7);
    const leg2 = new THREE.Mesh(legGeo, creeperMat); leg2.position.set(0.7, 0.7, 0.7);
    const leg3 = new THREE.Mesh(legGeo, creeperMat); leg3.position.set(-0.7, 0.7, -0.7);
    const leg4 = new THREE.Mesh(legGeo, creeperMat); leg4.position.set(0.7, 0.7, -0.7);

    this.creeperBoss.add(cBody, cHead, eyeL, eyeR, mouth, leg1, leg2, leg3, leg4);
    this.bossRoot.add(this.creeperBoss);

    // 2. 烈焰使者王 (Blaze Boss)
    this.blazeBoss = new THREE.Group();
    const blazeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xea580c,
      emissiveIntensity: 0.75
    });
    const bHead = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), blazeMat);
    bHead.position.y = 5.6;
    this.blazeBoss.add(bHead);

    const rodGeo = new THREE.BoxGeometry(0.42, 2.6, 0.42);
    for (let i = 0; i < 8; i++) {
      const rod = new THREE.Mesh(rodGeo, blazeMat);
      rod.userData = { angle: (i / 8) * Math.PI * 2, radius: 2.6, baseY: 3.2 + (i % 2) * 1.1 };
      this.blazeBoss.add(rod);
      this.blazeRods.push(rod);
    }
    this.blazeBoss.visible = false;
    this.bossRoot.add(this.blazeBoss);

    // 3. 終界黑龍王 (Ender Dragon Boss)
    this.dragonBoss = new THREE.Group();
    const dragonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const dragonGlowMat = new THREE.MeshBasicMaterial({ color: 0xd946ef });

    const dTorso = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.4, 5.2), dragonMat);
    dTorso.position.y = 6.2;
    const dHead = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 2.6), dragonMat);
    dHead.position.set(0, 6.8, 3.4);
    const dEyeL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.1), dragonGlowMat);
    dEyeL.position.set(-0.6, 7.0, 4.72);
    const dEyeR = dEyeL.clone();
    dEyeR.position.x = 0.6;

    // 雙翼樞紐
    const wingGeo = new THREE.BoxGeometry(5.5, 0.25, 3.2);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x3b0764, emissive: 0x7e22ce, emissiveIntensity: 0.35 });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-4.2, 6.8, 0);
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(4.2, 6.8, 0);
    this.dragonWings = [leftWing, rightWing];

    this.dragonBoss.add(dTorso, dHead, dEyeL, dEyeR, leftWing, rightWing);
    this.dragonBoss.visible = false;
    this.bossRoot.add(this.dragonBoss);
  }

  // 建立左 [A]、中 [S]、右 [D] 三座發光選項礦石方塊
  createMysteryOreBlocks() {
    const coords = [-5.2, 0, 5.2];
    const texList = [this.textures.diamondOre, this.textures.goldOre, this.textures.emeraldOre];
    const geo = new THREE.BoxGeometry(2.3, 2.3, 2.3);

    coords.forEach((x, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        map: texList[idx],
        roughness: 0.4,
        metalness: 0.15
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 2.3, 13.5);
      mesh.castShadow = true;
      mesh.userData = { baseX: x, baseY: 2.3, origMap: texList[idx], idx };
      this.scene.add(mesh);
      this.oreBlocks.push(mesh);
    });
  }

  // 更新礦石方塊狀態（例如被真視藥水或第一次答錯變成基岩）
  updateOreBlockStates(eliminatedSet) {
    this.oreBlocks.forEach((b, idx) => {
      b.visible = true;
      b.scale.setScalar(1);
      if (eliminatedSet.has(idx)) {
        b.material.map = this.textures.bedrock;
      } else {
        b.material.map = b.userData.origMap;
      }
      b.material.needsUpdate = true;
    });
  }

  createEnergyProjectile() {
    const geo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.projectile = new THREE.Mesh(geo, mat);
    this.projectile.visible = false;
    this.scene.add(this.projectile);
  }

  // 礦石擊碎像素粒子與經驗球噴發特效
  spawnOreShatterParticles(pos, isSuccess = true) {
    const count = isSuccess ? 26 : 12;
    const geo = new THREE.BoxGeometry(0.38, 0.38, 0.38);

    for (let i = 0; i < count; i++) {
      const color = isSuccess
        ? (i % 2 === 0 ? 0x4ade80 : 0xfacc15)
        : 0xef4444;
      const mat = new THREE.MeshBasicMaterial({ color });
      const cube = new THREE.Mesh(geo, mat);
      cube.position.copy(pos);
      cube.userData = {
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.65,
          Math.random() * 0.55 + 0.15,
          (Math.random() - 0.5) * 0.65
        ),
        life: 1.0
      };
      this.scene.add(cube);
      this.debrisParticles.push(cube);
    }
  }

  updateEffects(time) {
    // 懸浮礦石旋轉與上下浮動
    this.oreBlocks.forEach((b, i) => {
      if (b.visible) {
        b.position.y = b.userData.baseY + Math.sin(time * 3 + i * 1.4) * 0.25;
        b.rotation.y = Math.sin(time * 1.5 + i) * 0.35;
      }
    });

    // 烈焰使者旋轉烈焰棒
    if (this.blazeBoss && this.blazeBoss.visible) {
      this.blazeRods.forEach(rod => {
        const a = rod.userData.angle + time * 3.2;
        rod.position.set(
          Math.cos(a) * rod.userData.radius,
          rod.userData.baseY + Math.sin(time * 5 + a) * 0.35,
          Math.sin(a) * rod.userData.radius
        );
      });
    }

    // 終界黑龍拍動雙翼
    if (this.dragonBoss && this.dragonBoss.visible && this.dragonWings.length === 2) {
      const flap = Math.sin(time * 6) * 0.42;
      this.dragonWings[0].rotation.z = flap;
      this.dragonWings[1].rotation.z = -flap;
      this.dragonBoss.position.y = Math.sin(time * 3) * 0.5;
    }

    // 苦力怕左右搖擺逼近感
    if (this.creeperBoss && this.creeperBoss.visible) {
      this.creeperBoss.rotation.z = Math.sin(time * 4) * 0.05;
      this.creeperBoss.position.y = Math.abs(Math.sin(time * 6)) * 0.25;
    }

    // 勇者超級 TNT 氣場旋轉
    if (this.heroGroup?.feverAura && this.heroGroup.feverAura.visible) {
      this.heroGroup.feverAura.rotation.z = time * 4;
      this.heroGroup.feverAura.scale.setScalar(1 + Math.sin(time * 8) * 0.15);
    }

    // 更新方塊碎屑與經驗球粒子
    for (let i = this.debrisParticles.length - 1; i >= 0; i--) {
      const p = this.debrisParticles[i];
      p.position.add(p.userData.vel);
      p.rotation.x += 0.12;
      p.rotation.y += 0.12;
      p.userData.vel.y -= 0.025;
      p.userData.life -= 0.035;
      p.scale.setScalar(Math.max(0.01, p.userData.life));
      if (p.userData.life <= 0) {
        this.scene.remove(p);
        p.geometry.dispose();
        p.material.dispose();
        this.debrisParticles.splice(i, 1);
      }
    }
  }
}
