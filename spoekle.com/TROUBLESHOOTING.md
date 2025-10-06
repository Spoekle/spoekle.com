# Troubleshooting: Blender Model Not Showing

## Quick Checklist

### 1. Open Browser Console (F12)
Look for the debug messages with emojis:
- 🎨 Blender Model Loaded
- 📦 Scene info
- 🎬 Animations
- 📐 Model size

### 2. Can you see the red wireframe box?
- **YES** → Your scene is working, model might be:
  - Too small/large (check size in console)
  - Wrong position (behind camera or too far)
  - No materials (check in Blender)
  
- **NO** → Three.js/Canvas issue:
  - Check for JavaScript errors in console
  - Make sure dev server is running

### 3. Common Issues & Fixes

#### Model is invisible but loads:
```typescript
// Try different positions
position={[0, 0, -5]}    // Move back
position={[0, 2, 0]}     // Move up
position={[5, 0, 0]}     // Move right
```

#### Model is too small:
```typescript
scale={10}  // Make it bigger
scale={100} // Even bigger
```

#### Model is too big:
```typescript
scale={0.1}  // Make it smaller
scale={0.01} // Much smaller
```

#### Model has no color in Three.js:
In Blender before export:
1. Make sure materials are assigned
2. Use Principled BSDF shader
3. Check "Include → Materials" in export settings

#### Animation not playing:
Check console for animation names, then:
```typescript
animationName="YourExactAnimationName"
```

### 4. Test Scene
Replace your BlenderScene with this simple test:
```typescript
{/* Simple test sphere - should always be visible */}
<mesh position={[0, 0, -5]}>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial color="#00ff00" />
</mesh>
```

If you see a green sphere, your scene works!

### 5. Camera Position
Your camera is at: `[0, 2, 10]` looking at origin `[0, 0, 0]`
- Objects at z=0 are 10 units away
- Objects at z=-10 are 20 units away
- Objects at z=10 are at camera

### 6. Still Not Working?
Share the console output (F12) showing:
- The 🎨 model info
- 📐 Model size
- Any error messages
