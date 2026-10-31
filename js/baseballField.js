/**
 * 3D 棒球場景建構器 (Three.js 程式化幾何)
 * 輕量化、免加載外部模型、秒開 60FPS
 */
import * as THREE from 'three';

export class BaseballField {
  constructor(scene) {
    this.scene = scene;
    this.createField();
    this.createBases();
    this.createOutfieldWall();
    this.createScoreboard();
    this.createCharacters();
    this.createLights();
  }

  createLights() {
    // 陽光主要平行光
    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    dirLight.position.set(40, 60, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    // 自然天光
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x4a752c, 0.7);
    this.scene.add(hemiLight);
  }

  createField() {
    // 1. 外野大草皮 (半徑 80 的綠色地面)
    const grassGeo = new THREE.CircleGeometry(85, 48, 0, Math.PI);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x3b7d23,
      roughness: 0.85
    });
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.rotation.x = -Math.PI / 2;
    grassMesh.rotation.z = Math.PI / 4;
    grassMesh.position.set(0, -0.05, 0);
    grassMesh.receiveShadow = true;
    this.scene.add(grassMesh);

    // 2. 內野紅土菱形 (Diamond Infield)
    const dirtGeo = new THREE.PlaneGeometry(36, 36);
    const dirtMat = new THREE.MeshStandardMaterial({
      color: 0xb5652e, // 紅土色
      roughness: 0.9
    });
    const dirtMesh = new THREE.Mesh(dirtGeo, dirtMat);
    dirtMesh.rotation.x = -Math.PI / 2;
    dirtMesh.rotation.z = Math.PI / 4;
    dirtMesh.position.set(0, 0.01, 15);
    dirtMesh.receiveShadow = true;
    this.scene.add(dirtMesh);

    // 3. 內野草皮島 (Infield Grass Arc)
    const innerGrassGeo = new THREE.CircleGeometry(11, 32);
    const innerGrassMesh = new THREE.Mesh(innerGrassGeo, grassMat);
    innerGrassMesh.rotation.x = -Math.PI / 2;
    innerGrassMesh.position.set(0, 0.02, 15);
    innerGrassMesh.receiveShadow = true;
    this.scene.add(innerGrassMesh);

    // 4. 白色界外線 (Foul Lines)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lineGeo = new THREE.PlaneGeometry(0.35, 75);

    // 右邊界線
    const rightLine = new THREE.Mesh(lineGeo, lineMat);
    rightLine.rotation.x = -Math.PI / 2;
    rightLine.rotation.z = -Math.PI / 4;
    rightLine.position.set(26.5, 0.03, -11.5);
    this.scene.add(rightLine);

    // 左邊界線
    const leftLine = new THREE.Mesh(lineGeo, lineMat);
    leftLine.rotation.x = -Math.PI / 2;
    leftLine.rotation.z = Math.PI / 4;
    leftLine.position.set(-26.5, 0.03, -11.5);
    this.scene.add(leftLine);
  }

  createBases() {
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.5 });
    const baseGeo = new THREE.BoxGeometry(1.2, 0.25, 1.2);

    // 一壘 (右)
    const base1 = new THREE.Mesh(baseGeo, baseMat);
    base1.position.set(12.5, 0.15, 15);
    base1.rotation.y = Math.PI / 4;
    this.scene.add(base1);

    // 二壘 (中後)
    const base2 = new THREE.Mesh(baseGeo, baseMat);
    base2.position.set(0, 0.15, 2.5);
    base2.rotation.y = Math.PI / 4;
    this.scene.add(base2);

    // 三壘 (左)
    const base3 = new THREE.Mesh(baseGeo, baseMat);
    base3.position.set(-12.5, 0.15, 15);
    base3.rotation.y = Math.PI / 4;
    this.scene.add(base3);

    // 本壘板 (Home Plate 五角形或小方塊)
    const homePlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.2), baseMat);
    homePlate.position.set(0, 0.05, 27.5);
    homePlate.rotation.y = Math.PI / 4;
    this.scene.add(homePlate);

    // 投手丘 (Pitcher's Mound)
    const moundGeo = new THREE.CylinderGeometry(3.5, 4.5, 0.45, 32);
    const moundMat = new THREE.MeshStandardMaterial({ color: 0xb5652e });
    const mound = new THREE.Mesh(moundGeo, moundMat);
    mound.position.set(0, 0.2, 15);
    this.scene.add(mound);

    // 投手板 (Pitcher's Plate)
    const rubberMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rubber = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.4), rubberMat);
    rubber.position.set(0, 0.45, 15);
    this.scene.add(rubber);
  }

  createOutfieldWall() {
    // 外野全壘打大牆 (弧形深藍/深綠色防撞牆)
    const wallGeo = new THREE.CylinderGeometry(75, 75, 5, 48, 1, true, -Math.PI * 0.75, Math.PI * 0.5);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1b3b6f,
      side: THREE.DoubleSide,
      roughness: 0.6
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 2.5, 27.5);
    wall.rotation.y = Math.PI;
    this.scene.add(wall);

    // 牆頂黃色標竿線 (Home Run line)
    const topTrimGeo = new THREE.CylinderGeometry(75.2, 75.2, 0.35, 48, 1, true, -Math.PI * 0.75, Math.PI * 0.5);
    const topTrimMat = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide });
    const trim = new THREE.Mesh(topTrimGeo, topTrimMat);
    trim.position.set(0, 5, 27.5);
    trim.rotation.y = Math.PI;
    this.scene.add(trim);
  }

  createScoreboard() {
    // 中外野超大電子記分板 (Jumbotron Structure)
    const boardGroup = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(32, 14, 1.5);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x111625, metalness: 0.8, roughness: 0.3 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 15;
    boardGroup.add(frame);

    // 兩根支撐柱
    const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, 15, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x4a5568 });
    const p1 = new THREE.Mesh(pillarGeo, pillarMat);
    p1.position.set(-10, 7.5, 0);
    const p2 = new THREE.Mesh(pillarGeo, pillarMat);
    p2.position.set(10, 7.5, 0);
    boardGroup.add(p1, p2);

    boardGroup.position.set(0, 0, -42);
    this.scene.add(boardGroup);
  }

  createCharacters() {
    // 1. 投手 (Pitcher on Mound at z=15)
    this.pitcherGroup = new THREE.Group();
    const uniformMat = new THREE.MeshStandardMaterial({ color: 0xd9383a }); // 紅色球衣
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcd94 });

    // 身體
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 1.8, 16), uniformMat);
    body.position.y = 1.4;
    // 頭與球帽
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), skinMat);
    head.position.y = 2.65;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.3, 16), uniformMat);
    cap.position.y = 2.95;

    this.pitcherGroup.add(body, head, cap);
    this.pitcherGroup.position.set(0, 0.45, 15);
    this.scene.add(this.pitcherGroup);

    // 2. 打者 (Batter at Home Plate z=27.5)
    this.batterGroup = new THREE.Group();
    const batterUniform = new THREE.MeshStandardMaterial({ color: 0x2563eb }); // 藍色主隊球衣

    const bBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 1.8, 16), batterUniform);
    bBody.position.y = 1.4;
    const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), skinMat);
    bHead.position.y = 2.65;
    const bCap = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.3, 16), batterUniform);
    bCap.position.y = 2.95;

    // 球棒 (Baseball Bat)
    this.batGroup = new THREE.Group();
    const batMat = new THREE.MeshStandardMaterial({ color: 0xdfa052, roughness: 0.4 });
    const batMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.05, 1.9, 12), batMat);
    batMesh.position.y = 0.95;
    this.batGroup.add(batMesh);
    this.batGroup.position.set(0.6, 1.5, 0.2);
    this.batGroup.rotation.z = -Math.PI / 4;
    this.batGroup.rotation.x = Math.PI / 6;

    this.batterGroup.add(bBody, bHead, bCap, this.batGroup);
    this.batterGroup.position.set(-1.2, 0, 27.5);
    this.scene.add(this.batterGroup);

    // 3. 棒球 (Baseball)
    const ballGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.castShadow = true;
    this.ball.position.set(0, 2.2, 15); // 起始在投手手上
    this.scene.add(this.ball);
  }
}
