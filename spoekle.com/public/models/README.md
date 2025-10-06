# 3D Models Directory

Place your Blender exported `.glb` or `.gltf` files here.

## Exporting from Blender

### Step-by-step:
1. **File → Export → glTF 2.0 (.glb/.gltf)**
2. **Export Settings:**
   - Format: `glTF Binary (.glb)` (recommended) or `glTF Separate (.gltf)`
   - Include: ☑ Selected Objects (or leave unchecked for whole scene)
   - Transform: ☑ +Y Up
   - Geometry:
     - ☑ Apply Modifiers
     - ☑ UVs
     - ☑ Normals
     - ☑ Tangents (if using normal maps)
   - Animation:
     - ☑ Animation (if you have animations)
     - Animation Mode: `Actions` or `NLA Tracks`
     - ☑ Shape Keys (if using morphing)
   - Compression: 
     - ☐ Compress (optional, for smaller files)

### Best Practices:
- **Poly Count**: Keep under 100k triangles for web
- **Textures**: Use power-of-2 sizes (1024x1024, 2048x2048)
- **Materials**: Use Principled BSDF (converts to PBR)
- **Scale**: 1 Blender unit = 1 meter in Three.js
- **Naming**: Give clear names to objects and animations
- **Origin**: Set origin to geometry center (Object → Set Origin → Origin to Geometry)

### Optimization Tools:
- **gltf-pipeline**: `npx gltf-pipeline -i model.glb -o model-optimized.glb -draco.compressionLevel 10`
- **gltfpack**: `gltfpack -i model.glb -o model-compressed.glb`

## Example Files to Add:
- `environment.glb` - Your main environment
- `animated-object.glb` - Object with animations
- `character.glb` - Character model

## Usage in Code:
```typescript
<BlenderScene 
  modelPath="/models/environment.glb"
  position={[0, 0, 0]}
  scale={1}
  autoPlay={true}
  animationName="MyAnimation"
/>
```
