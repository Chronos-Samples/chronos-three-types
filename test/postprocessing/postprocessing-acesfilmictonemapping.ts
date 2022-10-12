import * as THREE from 'three-ts-types/index';
import { EffectComposer } from 'three-ts-types/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three-ts-types/examples/jsm/postprocessing/ShaderPass';
import { ACESFilmicToneMappingShader } from 'three-ts-types/examples/jsm/shaders/ACESFilmicToneMappingShader';

const renderer = new THREE.WebGLRenderer();
const composer = new EffectComposer(renderer);

const toneMappingPass = new ShaderPass(ACESFilmicToneMappingShader);
toneMappingPass.uniforms.exposure.value = 1.0;

composer.addPass(toneMappingPass);
