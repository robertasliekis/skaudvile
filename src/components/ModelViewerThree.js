import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader, MeshStandardMaterial } from "three";
import { connect } from "react-redux";
import { setModelLoaded } from "../actions";

import OrbitControls from "three-orbitcontrols";

const objectTransforms = [
  [
    [0, 0, 0],
    [0, 0, 0],
    [1.1, 1.1, 1.1]
  ]
];

class ModelViewerThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelLoading: false
    };
  }
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.scene = new THREE.Scene({ alpha: true });

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    this.addCamera(width, height);
    this.addLights();
    this.addModels();

    this.renderScene();
    this.start();
  }

  setModelTransforms() {
    const { position, rotation, scale } = this.model;
    const modelTransfors = [position, rotation, scale];
    modelTransfors.map((transform, index) => {
      transform.x = objectTransforms[0][index][0];
      transform.y = objectTransforms[0][index][1];
      transform.z = objectTransforms[0][index][2];
      return null;
    });
  }

  addCamera(width, height) {
    let FOV = 50;
    let positionZ = 20;
    let positionY = 0;

    this.camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 1000);
    this.camera.position.z = positionZ;
    this.camera.position.y = positionY;
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.rotateSpeed = 0.3;
  }

  addLights() {
    var lights = [];
    lights[0] = new THREE.AmbientLight("white", 1, 0);
    this.scene.add(lights[0]);
  }

  addModels() {
    let modelUrl;
    let textureUrl;
    modelUrl = `./models/sphere.glb`;
    textureUrl = `./textures/panorama01.jpg`;

    const manager = new THREE.LoadingManager();
    manager.onStart = () => {
      //this.setState({ modelLoading: true });
      this.props.setModelLoaded(false);
    };

    manager.onLoad = () => {
      // this.setState({ modelLoading: false });
      this.props.setModelLoaded(true);
    };

    manager.onProgress = function () {};

    this.loader = new GLTFLoader();
    if (modelUrl !== undefined) {
      this.loader.load(
        modelUrl,
        (gltf) => {
          this.model = gltf.scene;
          this.setModelTransforms();
          const textureLoader = new TextureLoader(manager);
          const texture = textureLoader.load(textureUrl);
          texture.wrapS = THREE.RepeatWrapping;
          texture.flipY = false;
          const modelMaterial = new MeshStandardMaterial({
            roughness: 0.7,
            map: texture
          });
          modelMaterial.side = THREE.DoubleSide;
          this.model.traverse(function (object) {
            if (object.isMesh) {
              object.material = modelMaterial;
            }
          });
          this.scene.add(this.model);
        },
        function (xhr) {
          // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          //console.log("An error happened");
        }
      );
    }
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    let rotationSpeed = 0.001;
    if (this.model) this.model.rotation.y += rotationSpeed;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        className="model-view-container"
        key={this.props.virtualTourOpen}
        ref={(mount) => {
          this.mount = mount;
        }}
      >
        <div className="loading-screen" style={{ display: this.props.modelLoaded ? "none" : "flex" }}>
          <div className="text">Kraunama...</div>
          <div className="icon"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modelLoaded: state.setModelLoaded.modelLoaded
  };
};

const mapDispatchToProps = {
  setModelLoaded
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelViewerThree);
