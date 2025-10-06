# Using Blender Models in Your Scene

## Quick Start Guide

### 1. Export from Blender
1. Open your Blender project
2. Go to **File → Export → glTF 2.0 (.glb/.gltf)**
3. Choose settings:
   - Format: **glTF Binary (.glb)** ✅ (single file, easier)
   - Include: Select objects or entire scene
   - Transform: **+Y Up** ✅
   - Check: **Apply Modifiers**, **UVs**, **Normals**
   - Animation: Check if you have animations
4. Export to desktop or temp location

### 2. Place Model in Project
- Copy your `.glb` file to: `/public/models/`
- Example: `/public/models/my-environment.glb`

### 3. Use in Your Scene

#### Basic Usage (No Animation):
```typescript
<BlenderScene 
  modelPath="/models/my-environment.glb"
  position={[0, 0, -5]}
  scale={1}
/>
```

#### With Animation:
```typescript
<BlenderScene 
  modelPath="/models/animated-model.glb"
  position={[2, 0, -3]}
  scale={1.5}
  autoPlay={true}
  animationName="MyAnimation"  // Name from Blender
/>
```

### 4. Add to ParticleBackground.tsx

Open `ParticleBackground.tsx` and uncomment/add:

```typescript
{/* Your Blender Models */}
<BlenderScene 
  modelPath="/models/environment.glb"
  position={[0, -2, -5]}
  scale={2}
/>
```

## Tips & Tricks

### Positioning
- `position={[x, y, z]}` - x: left/right, y: up/down, z: forward/back
- Start with `[0, 0, -5]` and adjust from there

### Scaling
- `scale={1}` - original size
- `scale={2}` - double size
- `scale={0.5}` - half size
- `scale={[2, 1, 1]}` - stretch only on x-axis

### Animations
- Find animation names in Blender's Action Editor or NLA Editor
- Leave `animationName` empty to play all animations
- Set `autoPlay={false}` if you don't want it to play immediately

### Mix Procedural + Blender
You can combine:
- Your Blender environment models
- Procedural effects (CosmicParticles, EnergyOrbs, etc.)
- Both together for the best of both worlds!

### Performance
- Keep models under 100k triangles
- Compress textures (use 1024x1024 or 2048x2048)
- Use Draco compression for smaller files:
  ```bash
  npx gltf-pipeline -i model.glb -o model-optimized.glb -draco.compressionLevel 10
  ```

## Example Complete Scene

```typescript
<Canvas>
  {/* Lights */}
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  
  {/* Your Blender Environment */}
  <BlenderScene 
    modelPath="/models/sci-fi-room.glb"
    position={[0, 0, 0]}
    scale={1}
  />
  
  {/* Animated Character */}
  <BlenderScene 
    modelPath="/models/character.glb"
    position={[2, 0, -3]}
    animationName="Walk"
    autoPlay={true}
  />
  
  {/* Mix with procedural effects */}
  <CosmicParticles />
  <EnergyOrb position={[0, 2, 0]} color="#ec4899" speed={0.5} />
</Canvas>
```

## Need Help?
- Can't see your model? Check browser console (F12) for errors
- Model too big/small? Adjust `scale` prop
- Wrong orientation? Adjust `rotation={[x, y, z]}` (in radians)
- Animation not playing? Check animation name matches Blender exactly
