# Fixing: Animations Not Exported from Blender

## The Problem
Your model loads but shows:
```
🎬 Animations available: []
🎬 Animation objects: []
```

This means the animation exists in Blender but didn't export to the GLB file.

## Solution: Proper Blender Export Settings

### Step 1: Check Your Animation in Blender

1. Open your Blender file
2. Check if animation is in one of these:
   - **Dope Sheet** → Action Editor (look for action name)
   - **NLA Editor** (look for tracks)
   - **Timeline** (keyframes visible)

### Step 2: Prepare Animation for Export

#### Option A: Using Actions (Recommended)
1. Go to **Dope Sheet** editor
2. Switch mode to **Action Editor** (top left dropdown)
3. Make sure your animation has a **name** (shows at top)
4. Click the **shield icon** (fake user) next to the action name
   - This prevents Blender from deleting it
5. Make sure the action is **assigned** to your object

#### Option B: Using NLA Tracks
1. Go to **NLA Editor**
2. If your animation is loose keyframes:
   - Select your object
   - Press **Tab** to enter Edit mode, then **Tab** again to exit
   - In NLA Editor, click **Push Down** button (↓ icon)
   - This converts keyframes to an NLA strip
3. Name your NLA track clearly

### Step 3: Export with Correct Settings

**File → Export → glTF 2.0 (.glb/.gltf)**

#### Critical Animation Settings:

**Include Tab:**
- ☑ **Selected Objects** (or uncheck for everything)
- ☑ **Custom Properties**

**Animation Tab:** (THIS IS KEY!)
- ☑ **Animation** ← MUST BE CHECKED!
- Animation Mode: Choose based on your setup:
  - **Actions** ← Use this if you have actions in Action Editor
  - **Active Actions** ← Only exports currently active action
  - **NLA Tracks** ← Use this if you pushed to NLA
  - **Scene** ← Exports all animations in scene
- ☑ **Limit to Playback Range** (optional)
- ☑ **Always Sample Animations** (helps with complex animations)
- ☑ **Shape Keys** (if using morphing)
- ☑ **Group by NLA Track** (if using NLA)

**Other Important Settings:**
- Format: **glTF Binary (.glb)**
- Transform: **+Y Up** ☑
- Geometry: **Apply Modifiers** ☑

### Step 4: Verify Before Export

In Blender, before exporting:
1. Play your animation (Spacebar)
2. Make sure it actually plays in Blender
3. Check the timeline shows keyframes
4. Verify object is selected if using "Selected Objects"

### Step 5: Re-export

1. Export with settings above
2. **Replace** the old sparky.glb in `/public/models/`
3. **Hard refresh** your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check console again - should now show animation names!

## Common Issues

### "I checked Animation but still nothing exports"

**Problem:** Animation not properly attached to object

**Fix:**
```
1. Select your animated object
2. Go to Object Properties (orange square icon)
3. Check "Animation" section - should show your action
4. If empty, re-assign action in Action Editor
```

### "My animation is just loose keyframes"

**Fix:**
```
1. Select object with keyframes
2. Go to Dope Sheet → Action Editor
3. Click "New" button (+ icon)
4. Name your action (e.g., "Walk" or "Idle")
5. Click shield icon (fake user)
6. Now export
```

### "I have multiple animations"

**Fix:**
```
Option 1: Use Actions
- Each animation = separate action
- All will export

Option 2: Use NLA
- Push each action to NLA track
- Export with "NLA Tracks" mode
- Each track = separate animation
```

## Test Export

Try this simple test:
1. Create a new Blender file
2. Select default cube
3. Press **I** → Location (adds keyframe)
4. Move timeline to frame 60
5. Move cube up (G, Z, 2)
6. Press **I** → Location
7. Go to Action Editor, name it "TestMove", click shield
8. Export with Animation checked
9. Use this test file to verify your export works

## After Re-export

Your console should show:
```
🎬 Animations available: ["YourAnimationName"]
▶️ Playing animation: YourAnimationName
```

If you see animation names but it still doesn't play, let me know!
