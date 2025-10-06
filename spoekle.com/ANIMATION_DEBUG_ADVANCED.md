# Animation Export Troubleshooting - Advanced

## If Animation is Checked but Still Not Exporting...

### Problem 1: Action Not Assigned to Object
Even if animation exists, it might not be connected to the object.

**Fix:**
1. Select your animated object in Blender
2. Look at **Action Editor** (Dope Sheet → Action Editor)
3. At the top, there's a dropdown - it should show your action name
4. If it says "No Action" or is empty:
   - Click the dropdown
   - Select your animation from the list
   - Click the **shield icon** (fake user)

### Problem 2: Animation Only on Armature (Rigged Model)
If your model is rigged (has bones), animation might be on armature, not mesh.

**Fix:**
```
When Exporting:
1. Select BOTH the mesh AND the armature
2. Or just select the armature if mesh is parented to it
3. Check "Selected Objects" in export panel
4. Make sure armature has the action assigned
```

### Problem 3: No Keyframes Actually Exist
Action exists but is empty.

**Check:**
1. Go to Timeline
2. Look for orange/yellow diamonds (keyframes)
3. If no keyframes visible → animation is empty
4. Press Spacebar to play - does anything move?

### Problem 4: Animation Needs to be Baked
Complex animations (constraints, drivers, physics) need baking.

**Fix:**
1. Select object
2. In 3D Viewport: **Object → Animation → Bake Action**
3. Settings:
   - Visual Keying: ☑
   - Clear Constraints: ☐ (keep unchecked)
   - Clear Parents: ☐
   - Bake Data: Pose (for armatures) or Object (for objects)
4. Click OK
5. Now export

### Problem 5: Animation in NLA but Not as Action
If you pushed animation to NLA, it's no longer an action.

**Fix:**
```
Option A: Export as NLA Tracks
- In export settings: Animation Mode → "NLA Tracks"

Option B: Convert back to action
1. In NLA Editor, select your strip
2. Tab → Edit mode
3. Copy all keyframes (A to select all, Ctrl+C)
4. Delete NLA strip
5. Go to Action Editor
6. Create new action
7. Paste keyframes (Ctrl+V)
8. Export with "Actions" mode
```

### Problem 6: Frame Range Issue
Animation exists but outside export range.

**Fix:**
1. Check your animation start/end frames in Timeline
2. In export settings:
   - Uncheck "Limit to Playback Range"
   - Or adjust scene start/end frames to include your animation

### Problem 7: Animation on Shape Keys
Shape key animations need special handling.

**Fix:**
```
In export settings:
☑ Shape Keys
☑ Shape Key Normals
☑ Shape Key Tangents
```

## Test: Create Simple Animation

Let's verify Blender export works at all:

```
1. New Blender file (default cube)
2. Select cube
3. Frame 1: Press I → Location
4. Frame 60: Move cube (G Z 2), press I → Location
5. Action Editor: Name action "TestAnim", click shield
6. Export:
   - Animation: ☑
   - Animation Mode: Actions
   - Export as test.glb
7. Try loading test.glb in your app

If test.glb works → problem is with your specific file
If test.glb doesn't work → export settings issue
```

## Debugging: Check in another tool

Download and use **glTF Viewer**:
- https://gltf-viewer.donmccurdy.com/
- Drag your sparky.glb into it
- Click "Animations" tab on right
- Does it show animations there?

If YES → Your export worked, issue is in our code
If NO → Animation didn't export, issue is in Blender

## Nuclear Option: Re-export Everything

Sometimes Blender caching causes issues:

```
1. Save your .blend file
2. Close Blender completely
3. Reopen Blender
4. Open your file
5. Select all objects (A)
6. File → Export → glTF 2.0
7. Settings:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects (UNCHECKED - export all)
   - Transform: +Y Up
   - Geometry: Apply Modifiers ☑
   - Animation: ☑
   - Animation Mode: Actions
   - Always Sample Animations: ☑
8. Export to different filename (sparky_new.glb)
9. Try the new file
```

## Last Resort: Share Blend File

If nothing works, you might have a specific Blender issue. Can you:
1. Share the .blend file, or
2. Share console output when you export (Window → Toggle System Console in Blender)
3. Check if Blender shows any warnings/errors during export
