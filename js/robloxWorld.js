/**
 * 國小二年級期中考：3D Roblox 極限跑酷天梯世界引擎 (RobloxWorld)
 * 核心特色：
 * 1. 經典亮面塑膠積木美學 (High-Gloss Smooth Plastic + Neon Emissive)
 * 2. 9 座垂直螺旋上升之霓虹懸浮 Checkpoint 平台
 * 3. 3D Robloxian 積木人角色 (Classic Noob / Bacon Hair / 經典笑臉)
 * 4. 跑酷跳躍、障礙機關 (紅光雷射、旋轉推桿、彩虹階梯) 與經典 OOF! 跌倒煙霧動畫
 */
import * as THREE from 'three';

export class RobloxWorld {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    this.currentStage = 0;
    this.totalStages = 9;

    this.platforms = [];
    this.checkpointRings = [];
    this.lasers = [];
    this.spinners = [];
    this.sparkles = [];

    this.jumpAnimation = null;
    this.oofAnimation = null;

    this.initLighting();
    this.initSkyAndArena();
    this.initObbyTower();
    this.initPlayerAvatar();
    this.initPetCompanionGroup();
  }

  // 1. 光照系統：明亮陽光 + 賽博霓虹點光源
  initLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    this.sunLight.position.set(25, 45, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.scene.add(this.sunLight);

    // 隨角色上升的聚光光環
    this.playerLight = new THREE.PointLight(0x38bdf8, 1.2, 22);
    this.playerLight.position.set(0, 5, 0);
    this.scene.add(this.playerLight);
  }

  // 2. 天空盒與虛空網格地平線
  initSkyAndArena() {
    // 漸層雲端天空背景
    this.scene.background = new THREE.Color(0x0284c7); // 晴空澄藍

    // 底部虛空網格 (Void Floor)
    const gridHelper = new THREE.GridHelper(160, 40, 0x38bdf8, 0x1e3a8a);
    gridHelper.position.y = -8;
    this.scene.add(gridHelper);

    // 漂浮在空中的大型 Roblox 經典幾何裝飾方塊
    this.floatingDecor = new THREE.Group();
    const decorMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.15,
      metalness: 0.1
    });
    for (let i = 0; i < 12; i++) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), decorMat);
      const angle = (i / 12) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * (26 + (i % 3) * 6),
        10 + i * 3.5,
        Math.sin(angle) * (26 + (i % 3) * 6)
      );
      mesh.rotation.set(i * 0.4, i * 0.7, 0);
      mesh.userData = { rotSpeed: 0.01 + (i % 3) * 0.005 };
      this.floatingDecor.add(mesh);
    }
    this.scene.add(this.floatingDecor);
  }

  // 3. 建立 9 座螺旋上升之 Obby Checkpoint 平台與障礙機關
  initObbyTower() {
    this.towerGroup = new THREE.Group();
    this.scene.add(this.towerGroup);

    const platformColors = [
      0xef4444, // 1. 火焰紅
      0xf97316, // 2. 活力橘
      0xfacc15, // 3. 耀眼黃
      0x22c55e, // 4. 翡翠綠
      0x06b6d4, // 5. 晴空青
      0x3b82f6, // 6. 皇家藍
      0xa855f7, // 7. 霓虹紫
      0xec4899, // 8. 甜心粉
      0xfbbf24  // 9. 終點傳奇黃金頂峰
    ];

    for (let i = 0; i < this.totalStages; i++) {
      const angle = (i / this.totalStages) * Math.PI * 3.2; // 螺旋 1.6 圈
      const radius = 13.5;
      const x = Math.cos(angle) * radius;
      const y = i * 4.6;
      const z = Math.sin(angle) * radius;

      const platGroup = new THREE.Group();
      platGroup.position.set(x, y, z);

      // 主平台 (亮面高反光塑料)
      const isApex = (i === this.totalStages - 1);
      const platSize = isApex ? 9.0 : 6.2;
      const platGeo = new THREE.BoxGeometry(platSize, 0.9, platSize);
      const platMat = new THREE.MeshStandardMaterial({
        color: platformColors[i],
        roughness: 0.18,
        metalness: 0.05
      });
      const platMesh = new THREE.Mesh(platGeo, platMat);
      platMesh.receiveShadow = true;
      platGroup.add(platMesh);

      // 霓虹邊框線 (Neon Border)
      const edgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const edgeMesh = new THREE.Mesh(new THREE.BoxGeometry(platSize + 0.25, 0.2, platSize + 0.25), edgeMat);
      edgeMesh.position.y = 0.35;
      platGroup.add(edgeMesh);

      // Checkpoint 發光光圈底座
      const cpGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.25, 24);
      const cpMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? 0x22c55e : 0x64748b, // 第 1 關預設已踩上
        emissive: i === 0 ? 0x16a34a : 0x1e293b,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const cpPad = new THREE.Mesh(cpGeo, cpMat);
      cpPad.position.y = 0.55;
      platGroup.add(cpPad);

      // 關卡編號光圈柱
      const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.2, 8);
      const pillarMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(platSize * 0.35, 1.2, platSize * 0.35);
      platGroup.add(pillar);

      // 障礙機關：依不同關卡加入不同 Roblox 經典障礙
      if (i > 0 && i < this.totalStages - 1) {
        if (i % 3 === 1) {
          // 致命紅光雷射柵欄 (Laser Gate)
          const laser = this.createLaserGate(platSize);
          platGroup.add(laser);
          this.lasers.push({ mesh: laser, stage: i });
        } else if (i % 3 === 2) {
          // 旋轉推桿 (Rotating Sweeper)
          const spinner = this.createRotatingSweeper();
          platGroup.add(spinner);
          this.spinners.push({ mesh: spinner, stage: i });
        }
      }

      this.towerGroup.add(platGroup);
      this.platforms.push({
        position: new THREE.Vector3(x, y + 0.55, z),
        group: platGroup,
        pad: cpPad,
        isCleared: i === 0
      });
    }
  }

  // 障礙機關：紅光雷射柵欄
  createLaserGate(platSize) {
    const laserGroup = new THREE.Group();
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, platSize * 0.7, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    for (let j = 0; j < 3; j++) {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.rotation.z = Math.PI / 2;
      beam.position.set(0, 0.9 + j * 0.8, 0);
      laserGroup.add(beam);
    }
    laserGroup.position.set(0, 0, 0);
    return laserGroup;
  }

  // 障礙機關：旋轉推桿
  createRotatingSweeper() {
    const swGroup = new THREE.Group();
    const armGeo = new THREE.BoxGeometry(5.2, 0.45, 0.45);
    const armMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xd97706,
      emissiveIntensity: 0.4
    });
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.y = 0.9;
    swGroup.add(arm);
    return swGroup;
  }

  // 4. 建立 3D Robloxian 積木人角色 (Classic Noob)
  initPlayerAvatar() {
    this.playerGroup = new THREE.Group();
    this.scene.add(this.playerGroup);

    // 材質庫 (Roblox 塑料 Smooth Plastic)
    this.mats = {
      yellowSkin: new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.18 }), // 頭部、雙手
      blueTorso: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.18 }),  // 軀幹
      greenLegs: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.18 }),  // 雙腳
      whiteFace: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      blackEyes: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      baconHair: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35 }),
      haloGold: new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    };

    // 軀幹 (Torso: 2x2x1 標準積木比例)
    this.torso = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 0.75), this.mats.blueTorso);
    this.torso.position.y = 1.6;
    this.torso.castShadow = true;
    this.playerGroup.add(this.torso);

    // 頭部 (Head: 1.25x1.25x1.25)
    this.head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), this.mats.yellowSkin);
    this.head.position.set(0, 2.75, 0);
    this.head.castShadow = true;

    // 經典笑臉 (畫在畫布上轉成貼圖)
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 128;
    faceCanvas.height = 128;
    const ctx = faceCanvas.getContext('2d');
    ctx.fillStyle = '#fde047';
    ctx.fillRect(0, 0, 128, 128);
    // 兩顆大黑眼
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(38, 48, 9, 0, Math.PI * 2);
    ctx.arc(90, 48, 9, 0, Math.PI * 2);
    ctx.fill();
    // 經典 U 型大微笑
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(64, 66, 30, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    const faceTex = new THREE.CanvasTexture(faceCanvas);
    const faceMat = new THREE.MeshBasicMaterial({ map: faceTex });
    const facePlate = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), faceMat);
    facePlate.position.set(0, 0, 0.46);
    this.head.add(facePlate);
    this.playerGroup.add(this.head);

    // 手臂 (Arms)
    const armGeo = new THREE.BoxGeometry(0.55, 1.35, 0.55);
    this.armL = new THREE.Mesh(armGeo, this.mats.yellowSkin);
    this.armL.position.set(-1.0, 1.6, 0);
    this.armR = new THREE.Mesh(armGeo, this.mats.yellowSkin);
    this.armR.position.set(1.0, 1.6, 0);
    this.playerGroup.add(this.armL, this.armR);

    // 雙腳 (Legs)
    const legGeo = new THREE.BoxGeometry(0.65, 1.35, 0.65);
    this.legL = new THREE.Mesh(legGeo, this.mats.greenLegs);
    this.legL.position.set(-0.36, 0.68, 0);
    this.legR = new THREE.Mesh(legGeo, this.mats.greenLegs);
    this.legR.position.set(0.36, 0.68, 0);
    this.playerGroup.add(this.legL, this.legR);

    // 頭頂天使光環裝飾 (預設隱藏)
    this.halo = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 8, 24), this.mats.haloGold);
    this.halo.rotation.x = Math.PI / 2;
    this.halo.position.set(0, 3.45, 0);
    this.halo.visible = false;
    this.playerGroup.add(this.halo);

    // 角色外觀配件：培根頭髮 (預設隱藏)
    this.baconHairGroup = new THREE.Group();
    const hair1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.95), this.mats.baconHair);
    hair1.position.set(0, 3.25, 0);
    const strand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), this.mats.baconHair);
    strand.position.set(-0.35, 2.9, 0.4);
    this.baconHairGroup.add(hair1, strand);
    this.baconHairGroup.visible = false;
    this.playerGroup.add(this.baconHairGroup);

    // 手持裝備道具：黃金重力彈簧 (Gravity Coil)
    this.gravityCoil = this.createCoilMesh(0xfacc15);
    this.gravityCoil.position.set(1.0, 1.0, 0.45);
    this.playerGroup.add(this.gravityCoil);

    // 初始位置設定在第 0 關 Checkpoint
    this.setPlayerToStage(0);
  }

  // 建立彈簧圈 3D 模型
  createCoilMesh(hexColor) {
    const coilGroup = new THREE.Group();
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.06, 8, 20),
      new THREE.MeshStandardMaterial({ color: hexColor, roughness: 0.15, metalness: 0.4 })
    );
    coil.rotation.x = Math.PI / 2;
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.65, 8),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
    );
    handle.position.y = 0.25;
    coilGroup.add(coil, handle);
    coilGroup.scale.setScalar(1.2);
    return coilGroup;
  }

  // 5. 隨身 3D 浮空寵物 (Doge 柴犬 / Bloxy Cat / Golden Blox)
  initPetCompanionGroup() {
    this.petRoot = new THREE.Group();
    this.scene.add(this.petRoot);
    this.petModels = {};

    // 🐶 Doge 經典柴犬
    const doge = new THREE.Group();
    const dogeFur = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 });
    const dogeBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.65, 0.95), dogeFur);
    const dogeHead = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), dogeFur);
    dogeHead.position.set(0, 0.55, 0.4);
    doge.add(dogeBody, dogeHead);
    doge.visible = false;
    this.petRoot.add(doge);
    this.petModels.doge = doge;

    // 🐱 Bloxy Cat 像素霓虹貓
    const cat = new THREE.Group();
    const catMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.3 });
    const catBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 0.85), catMat);
    const catHead = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), catMat);
    catHead.position.set(0, 0.5, 0.35);
    cat.add(catBody, catHead);
    cat.visible = false;
    this.petRoot.add(cat);
    this.petModels.cat = cat;

    // 👑 Golden Blox 黃金方塊之王
    const goldBlox = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.85, 0.85),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.6, roughness: 0.15 })
    );
    goldBlox.visible = false;
    this.petRoot.add(goldBlox);
    this.petModels.gold_blox = goldBlox;
  }

  setPetCompanion(petId) {
    if (!this.petModels) return;
    Object.keys(this.petModels).forEach(k => {
      this.petModels[k].visible = (k === petId);
    });
  }

  setPlayerAvatarSkin(skinId) {
    if (skinId === 'bacon_hair') {
      this.baconHairGroup.visible = true;
      this.halo.visible = false;
      this.torso.material.color.setHex(0xef4444); // 紅衣培根男
    } else if (skinId === 'pink_halo') {
      this.baconHairGroup.visible = false;
      this.halo.visible = true;
      this.torso.material.color.setHex(0xec4899); // 粉色天使
    } else {
      // 經典 Noob
      this.baconHairGroup.visible = false;
      this.halo.visible = false;
      this.torso.material.color.setHex(0x0284c7);
    }
  }

  // 將角色設定到指定 Stage Checkpoint
  setPlayerToStage(stageIdx) {
    this.currentStage = Math.max(0, Math.min(this.totalStages - 1, stageIdx));
    const targetPos = this.platforms[this.currentStage].position;
    this.playerGroup.position.copy(targetPos);
    this.playerGroup.rotation.y = -(this.currentStage / this.totalStages) * Math.PI * 3.2 - Math.PI / 2;

    this.playerLight.position.set(targetPos.x, targetPos.y + 4.5, targetPos.z);

    // 標記 Checkpoint 踩上亮燈
    this.platforms[this.currentStage].isCleared = true;
    this.platforms[this.currentStage].pad.material.color.setHex(0x22c55e);
    this.platforms[this.currentStage].pad.material.emissive.setHex(0x16a34a);

    // 關閉當前關卡的雷射門
    const laserObj = this.lasers.find(l => l.stage === this.currentStage);
    if (laserObj) laserObj.mesh.visible = false;
  }

  // 觸發答對後的極限彈簧跳躍大位移 (Jump to next platform)
  jumpToNextStage(targetIdx, onComplete) {
    const startPos = this.playerGroup.position.clone();
    const endPos = this.platforms[targetIdx].position.clone();
    let progress = 0;

    this.jumpAnimation = {
      tick: () => {
        progress += 0.026;
        this.playerGroup.position.lerpVectors(startPos, endPos, progress);
        // 拋物線彈跳高空弧度
        this.playerGroup.position.y += Math.sin(progress * Math.PI) * 5.2;

        // 跳躍空翻特效
        this.playerGroup.rotation.x = Math.sin(progress * Math.PI) * Math.PI * 2;
        this.armL.rotation.x = -Math.sin(progress * Math.PI) * 2.2;
        this.armR.rotation.x = Math.sin(progress * Math.PI) * 2.2;

        if (progress >= 1) {
          this.jumpAnimation = null;
          this.playerGroup.rotation.x = 0;
          this.setPlayerToStage(targetIdx);
          this.spawnConfettiSparks(endPos);
          if (onComplete) onComplete();
        }
      }
    };
  }

  // 答錯觸發經典「OOF! 角色搞笑跌倒」動畫
  triggerOofDeath(onComplete) {
    let progress = 0;
    const originY = this.playerGroup.position.y;

    this.oofAnimation = {
      tick: () => {
        progress += 0.05;
        // 角色後仰倒地
        this.playerGroup.rotation.z = Math.min(Math.PI / 2, progress * Math.PI);
        this.playerGroup.position.y = originY - Math.sin(progress * Math.PI * 0.5) * 1.5;

        // 雙臂與雙腳無力晃動
        this.armL.rotation.z = -progress * 1.8;
        this.armR.rotation.z = progress * 1.8;

        if (progress >= 1.2) {
          this.oofAnimation = null;
          this.playerGroup.rotation.z = 0;
          this.armL.rotation.z = 0;
          this.armR.rotation.z = 0;
          this.setPlayerToStage(this.currentStage); // 幽靈復活回到當前 Checkpoint
          if (onComplete) onComplete();
        }
      }
    };
  }

  // 產生踩上 Checkpoint 時的彩帶光芒粒子
  spawnConfettiSparks(center) {
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let i = 0; i < 18; i++) {
      const spark = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), sparkMat);
      spark.position.copy(center);
      spark.position.y += 0.8;
      const angle = (i / 18) * Math.PI * 2;
      spark.userData = {
        vel: new THREE.Vector3(
          Math.cos(angle) * (0.15 + Math.random() * 0.2),
          0.25 + Math.random() * 0.25,
          Math.sin(angle) * (0.15 + Math.random() * 0.2)
        ),
        life: 1.0
      };
      this.scene.add(spark);
      this.sparkles.push(spark);
    }
  }

  // 每幀更新動畫
  updateEffects(time) {
    // 旋轉背景裝飾
    if (this.floatingDecor) {
      this.floatingDecor.children.forEach(mesh => {
        mesh.rotation.x += mesh.userData.rotSpeed;
        mesh.rotation.y += mesh.userData.rotSpeed * 1.4;
      });
    }

    // 旋轉推桿障礙機關
    this.spinners.forEach(s => {
      s.mesh.rotation.y = time * 1.8;
    });

    // 處理跑酷跳躍或 OOF 跌倒動畫
    if (this.jumpAnimation) {
      this.jumpAnimation.tick();
    } else if (this.oofAnimation) {
      this.oofAnimation.tick();
    } else {
      // 靜止時輕微呼吸與手部待機微動
      this.armL.rotation.x = Math.sin(time * 3) * 0.15;
      this.armR.rotation.x = -Math.sin(time * 3) * 0.15;
      this.gravityCoil.rotation.y = time * 2;
    }

    // 隨身寵物跟隨與浮動
    if (this.petRoot && this.playerGroup) {
      const pPos = this.playerGroup.position;
      this.petRoot.position.set(pPos.x - 1.8, pPos.y + 1.2 + Math.sin(time * 4) * 0.25, pPos.z + 1.2);
      this.petRoot.rotation.y = time * 1.5;
    }

    // 粒子更新與自動銷毀
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const p = this.sparkles[i];
      p.position.add(p.userData.vel);
      p.userData.vel.y -= 0.015;
      p.userData.life -= 0.035;
      p.scale.setScalar(Math.max(0.01, p.userData.life));
      if (p.userData.life <= 0) {
        this.scene.remove(p);
        p.geometry.dispose();
        p.material.dispose();
        this.sparkles.splice(i, 1);
      }
    }

    // 平滑第三人稱跟隨攝影機 (Smooth Follow Cam)
    if (this.playerGroup) {
      const targetP = this.playerGroup.position;
      const camOffset = new THREE.Vector3(
        targetP.x * 0.6 + Math.sin(time * 0.15) * 4,
        targetP.y + 7.5,
        targetP.z + 14.5
      );
      this.camera.position.lerp(camOffset, 0.06);
      this.camera.lookAt(targetP.x, targetP.y + 2.0, targetP.z);
    }
  }
}
