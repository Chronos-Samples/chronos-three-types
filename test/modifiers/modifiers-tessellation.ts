import * as THREE from 'three-ts-types/index';

import { TrackballControls } from 'three-ts-types/examples/jsm/controls/TrackballControls';
import { TessellateModifier } from 'three-ts-types/examples/jsm/modifiers/TessellateModifier';
import { Font, FontLoader } from 'three-ts-types/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three-ts-types/examples/jsm/geometries/TextGeometry';

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;

let controls: TrackballControls;

let mesh: THREE.Mesh;
let uniforms: {
    amplitude: THREE.IUniform<number>;
};

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const loader = new FontLoader();
loader.load('fonts/helvetiker_bold.typeface.json', font => {
    init(font);
    animate();
});

function init(font: Font) {
    camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000);
    camera.position.set(-100, 100, 200);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    //

    let geometry = new TextGeometry('THREE', {
        font,
        size: 40,
        height: 5,
        curveSegments: 3,
        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true,
    });

    geometry.center();

    const tessellateModifier = new TessellateModifier(8, 6);

    geometry = tessellateModifier.modify(geometry);

    //

    const numFaces = geometry.attributes.position.count / 3;

    const colors = new Float32Array(numFaces * 3 * 3);
    const displacement = new Float32Array(numFaces * 3 * 3);

    const color = new THREE.Color();

    for (let f = 0; f < numFaces; f++) {
        const index = 9 * f;

        const h = 0.2 * Math.random();
        const s = 0.5 + 0.5 * Math.random();
        const l = 0.5 + 0.5 * Math.random();

        color.setHSL(h, s, l);

        const d = 10 * (0.5 - Math.random());

        for (let i = 0; i < 3; i++) {
            colors[index + 3 * i] = color.r;
            colors[index + 3 * i + 1] = color.g;
            colors[index + 3 * i + 2] = color.b;

            displacement[index + 3 * i] = d;
            displacement[index + 3 * i + 1] = d;
            displacement[index + 3 * i + 2] = d;
        }
    }

    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

    //

    uniforms = {
        amplitude: { value: 0.0 },
    };

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
        uniform float amplitude;

        attribute vec3 customColor;
        attribute vec3 displacement;

        varying vec3 vNormal;
        varying vec3 vColor;

        void main() {
            vNormal = normal;
            vColor = customColor;
            vec3 newPosition = position + normal * amplitude * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
        `,
        fragmentShader: `varying vec3 vNormal;
                    varying vec3 vColor;
                    void main() {
                        const float ambient = 0.4;
                        vec3 light = vec3( 1.0 );
                        light = normalize( light );
                        float directional = max( dot( vNormal, light ), 0.0 );
                        gl_FragColor = vec4( ( directional + ambient ) * vColor, 1.0 );
                    }`,
    });

    //

    mesh = new THREE.Mesh(geometry, shaderMaterial);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    const container = document.getElementById('container')!;
    container.appendChild(renderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    const time = Date.now() * 0.001;

    uniforms.amplitude.value = 1.0 + Math.sin(time * 0.5);

    controls.update();

    renderer.render(scene, camera);
}
