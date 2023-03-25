import * as THREE from 'three';

export default class GameEngine {
  constructor() {
    // Set up the scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Set up the car model
    // const loader = new THREE.GLTFLoader();
    // loader.load('car.glb', (gltf) => {
    //   this.car = gltf.scene;
    //   this.car.position.set(0, 0, 0);
    //   this.scene.add(this.car);
    // });

    // Set up the controls
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'w':
          this.keys.forward = true;
          break;
        case 's':
          this.keys.backward = true;
          break;
        case 'a':
          this.keys.left = true;
          break;
        case 'd':
          this.keys.right = true;
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'w':
          this.keys.forward = false;
          break;
        case 's':
          this.keys.backward = false;
          break;
        case 'a':
          this.keys.left = false;
          break;
        case 'd':
          this.keys.right = false;
          break;
      }
    });

    // Set up the physics engine
    this.clock = new THREE.Clock();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.friction = new THREE.Vector3();
    this.maxSpeed = 10;
    this.maxAcceleration = 5;
    this.maxFriction = 2;
  }

  update() {
    // Update the physics engine
    const delta = this.clock.getDelta();
    this.acceleration.set(0, 0, 0);
    this.friction.set(0, 0, 0);

    if (this.keys.forward) {
      this.acceleration.z = -this.maxAcceleration;
    }

    if (this.keys.backward) {
      this.acceleration.z = this.maxAcceleration;
    }

    if (this.keys.left) {
      this.acceleration.x = -this.maxAcceleration;
    }

    if (this.keys.right) {
      this.acceleration.x = this.maxAcceleration;
    }

    this.velocity.add(this.acceleration.multiplyScalar(delta));
    this.velocity.clampLength(0, this.maxSpeed);
    this.friction.copy(this.velocity).normalize().multiplyScalar(-this.maxFriction);
    this.velocity.add(this.friction.multiplyScalar(delta));

    // Update the car model
    if (this.car) {
      this.car.position.add(this.velocity.multiplyScalar(delta));
      this.car.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);
    }

    // Render the scene
    this.renderer.render(this.scene, this.camera);

    // Request the next frame
    requestAnimationFrame(() => this.update());
  }
}

const game = new GameEngine();
game.update();