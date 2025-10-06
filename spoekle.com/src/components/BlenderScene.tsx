'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlenderSceneProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  autoPlay?: boolean;
  animationName?: string;
  debug?: boolean;
}

export function BlenderScene({ 
  modelPath, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1,
  autoPlay = true,
  animationName,
  debug = false
}: BlenderSceneProps) {
  const group = useRef<THREE.Group>(null);
  
  // Load the GLTF model
  const gltf = useGLTF(modelPath);
  
  // Clone the scene once and memoize it
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    
    // Force all materials to be visible and bright
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.visible = true;
        child.frustumCulled = false; // Prevent culling issues
        
        if (child.material) {
          // Make sure materials are visible
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            mat.visible = true;
            mat.opacity = 1;
            mat.transparent = false;
            mat.depthWrite = true;
            mat.side = THREE.DoubleSide; // Render both sides
            
            // Replace material with bright basic material for debugging
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.emissive = new THREE.Color('#ff00ff');
              mat.emissiveIntensity = 1;
              mat.color = new THREE.Color('#ffffff');
            }
          });
        }
      }
    });
    
    return clone;
  }, [gltf.scene]);
  
  // Use animations with the group ref (not the cloned scene)
  const { actions, names, mixer } = useAnimations(gltf.animations, group);

  // Debug logging
  useEffect(() => {
    if (debug) {
      console.log('🎨 Blender Model Loaded:', modelPath);
      console.log('📦 Original Scene:', gltf.scene);
      console.log('🎬 Animations available:', names);
      console.log('🎬 Animation objects:', gltf.animations);
      console.log('🎭 Actions:', actions);
      console.log('🎵 Mixer:', mixer);
      console.log('📍 Position:', position);
      console.log('📏 Scale:', scale);
      
      // Log bounding box to help with positioning
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      console.log('📐 Model size:', size);
      console.log('📦 Bounding box MIN:', box.min);
      console.log('📦 Bounding box MAX:', box.max);
      console.log('🎯 Bounding box CENTER:', center);
      console.log('📊 Children count:', gltf.scene.children.length);
      
      // Log all children to see what's in the scene
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log('🔷 Mesh found:', child.name, 'Geometry:', child.geometry.type);
        }
      });
    }
  }, [gltf.scene, gltf.animations, names, actions, mixer, modelPath, position, scale, debug]);

  useEffect(() => {
    if (debug) {
      console.log('🔄 Animation effect running...');
      console.log('AutoPlay:', autoPlay);
      console.log('Actions available:', Object.keys(actions || {}));
    }

    if (autoPlay && actions) {
      // If specific animation name provided, play it
      if (animationName && actions[animationName]) {
        if (debug) console.log(`▶️ Playing animation: ${animationName}`);
        const action = actions[animationName];
        action?.reset().fadeIn(0.5).play();
        
        if (debug) {
          console.log('Action state:', {
            isRunning: action?.isRunning(),
            paused: action?.paused,
            time: action?.time,
            timeScale: action?.timeScale,
            weight: action?.weight
          });
        }
      } 
      // Otherwise play all animations
      else if (names.length > 0) {
        if (debug) console.log('▶️ Playing all animations:', names);
        names.forEach((name) => {
          const action = actions[name];
          action?.reset().fadeIn(0.5).play();
          
          if (debug) {
            console.log(`Animation "${name}" state:`, {
              isRunning: action?.isRunning(),
              paused: action?.paused
            });
          }
        });
      } else if (debug) {
        console.log('⚠️ No animations found to play');
      }
    }

    // Cleanup on unmount
    return () => {
      if (actions) {
        Object.values(actions).forEach((action) => action?.stop());
      }
    };
  }, [actions, names, animationName, autoPlay, debug]);

  // Continuous animation state monitoring
  useFrame((state) => {
    if (debug && actions && names.length > 0) {
      // Log animation state every 60 frames (once per second at 60fps)
      if (Math.floor(state.clock.elapsedTime * 60) % 60 === 0) {
        names.forEach((name) => {
          const action = actions[name];
          if (action) {
            console.log(`⏱️ [${state.clock.elapsedTime.toFixed(1)}s] "${name}":`, {
              time: action.time.toFixed(2),
              isRunning: action.isRunning(),
              paused: action.paused,
              enabled: action.enabled,
              weight: action.weight
            });
          }
        });
      }
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
      
      {/* Debug helpers */}
      {debug && (
        <>
          {/* Green wireframe box at origin */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshBasicMaterial color="#00ff00" wireframe />
          </mesh>
          
          {/* Red solid sphere to show exact center */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          
          {/* Axis helpers */}
          <axesHelper args={[5]} />
        </>
      )}
    </group>
  );
}

// Preload the model for better performance
export function preloadBlenderModel(path: string) {
  useGLTF.preload(path);
}

export default BlenderScene;
