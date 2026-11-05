import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import type { Step, StepShape } from '../data/projects'

interface Props {
  steps: Step[]
  active: number
  onSelect?: (index: number) => void
}

// Scene palette: pale "clay" models on a dark floor, so shape and state read clearly.
// Blue is reserved for progress — finished steps are tinted, the active one is full signal blue.
const C = {
  floor: 0x0c1018,
  pad: 0x1b2332,
  padEdge: 0x323e54,
  body: 0xc9d0dc,
  top: 0xeef1f6,
  edge: 0x56627a,
  past: 0xa9c4ef,
  pastTop: 0xd2e1f9,
  signal: 0x5b9dff,
  soft: 0x9cc3ff,
  belt: 0x2a3446,
}

const tmpColor = new THREE.Color()

const COLS = 3
const GAP = 4.4

/** Serpentine grid: left-to-right, down a row, right-to-left — the same order as the 2D diagram. */
function layout(count: number) {
  const pts = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / COLS)
    const c = i % COLS
    const col = row % 2 === 0 ? c : COLS - 1 - c
    return new THREE.Vector3(col * GAP, 0, row * GAP)
  })
  const center = new THREE.Box3().setFromPoints(pts).getCenter(new THREE.Vector3())
  pts.forEach((p) => p.sub(center))
  return pts
}

interface Station {
  group: THREE.Group
  materials: THREE.MeshStandardMaterial[]
  edges: THREE.LineBasicMaterial
  hit: THREE.Mesh
  height: number
}

/** Builds one low-poly "machine" for a step. Every mesh shares one material so it lights up as a unit. */
function buildStation(shape: StepShape, material: THREE.MeshStandardMaterial, edges: THREE.LineBasicMaterial) {
  const group = new THREE.Group()
  const topMat = material.clone()
  topMat.color.set(C.top)

  const add = (geo: THREE.BufferGeometry, x: number, y: number, z: number, mat = material, ry = 0) => {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, z)
    mesh.rotation.y = ry
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
    const line = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edges)
    line.position.copy(mesh.position)
    line.rotation.copy(mesh.rotation)
    group.add(line)
    return mesh
  }

  let height = 1
  switch (shape) {
    case 'stack': {
      // Paper stack: documents, records, prompts
      for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(1.9, 0.16, 1.35), 0, 0.1 + i * 0.2, 0, i === 3 ? topMat : material, (i % 2 ? 1 : -1) * 0.06 * i)
      height = 0.9
      break
    }
    case 'db': {
      // Database: three stacked platters
      for (let i = 0; i < 3; i++) add(new THREE.CylinderGeometry(0.85, 0.85, 0.42, 28), 0, 0.22 + i * 0.5, 0, i === 2 ? topMat : material)
      height = 1.45
      break
    }
    case 'rack': {
      // Server rack: tall slabs side by side
      for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.46, 1.7, 1.3), (i - 1) * 0.6, 0.85, 0)
      add(new THREE.BoxGeometry(2.0, 0.12, 1.45), 0, 1.76, 0, topMat)
      height = 1.85
      break
    }
    case 'screen': {
      // Dashboard: a panel on a stand
      add(new THREE.BoxGeometry(1.4, 0.2, 0.9), 0, 0.1, 0)
      add(new THREE.BoxGeometry(0.16, 0.8, 0.16), 0, 0.6, 0)
      const panel = add(new THREE.BoxGeometry(2.2, 1.3, 0.1), 0, 1.55, 0, topMat)
      panel.rotation.x = -0.12
      height = 2.25
      break
    }
    case 'beacon': {
      // Alert: a post with a lamp
      add(new THREE.CylinderGeometry(0.7, 0.85, 0.3, 24), 0, 0.15, 0)
      add(new THREE.CylinderGeometry(0.12, 0.12, 1.0, 12), 0, 0.8, 0)
      add(new THREE.SphereGeometry(0.42, 24, 16), 0, 1.5, 0, topMat)
      height = 1.95
      break
    }
    default: {
      // Machine: a processing block with a raised head and two gates
      add(new THREE.BoxGeometry(2.1, 0.8, 1.5), 0, 0.4, 0)
      add(new THREE.BoxGeometry(1.2, 0.5, 0.9), 0, 1.05, 0, topMat)
      add(new THREE.BoxGeometry(0.14, 0.7, 1.5), -0.8, 1.15, 0)
      add(new THREE.BoxGeometry(0.14, 0.7, 1.5), 0.8, 1.15, 0)
      height = 1.5
    }
  }

  return { group, height, topMat }
}

/**
 * A working 3D model of a project's pipeline. Each step is a small machine on a pad; conveyors
 * connect them; a glowing packet rides the line to whichever step is active. Drag to turn it.
 */
export default function Scene3D({ steps, active, onSelect }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const selectRef = useRef(onSelect)

  // The render loop reads these refs, so prop changes never rebuild the scene
  useEffect(() => {
    activeRef.current = active
    selectRef.current = onSelect
  }, [active, onSelect])

  useEffect(() => {
    const host = hostRef.current
    const labelHost = labelsRef.current
    if (!host || !labelHost) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ----- Renderer, scene, camera -----
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200)
    camera.position.set(22, 22, 22)
    camera.lookAt(0, 0, 0)

    // Soft sky fill, a crisp key light for shadows, a gentle front fill and a blue rim
    scene.add(new THREE.HemisphereLight(0xe6ecff, 0x0b0e14, 1.1))
    const key = new THREE.DirectionalLight(0xffffff, 2.4)
    key.position.set(9, 18, 5)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 50 })
    key.shadow.bias = -0.0005
    key.shadow.normalBias = 0.02
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.7)
    fill.position.set(-6, 9, 12)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(C.signal, 0.6)
    rim.position.set(-10, 6, -8)
    scene.add(rim)

    // Everything that turns when dragged lives in `world`; `content` is what the camera frames
    const world = new THREE.Group()
    const content = new THREE.Group()
    world.add(content)
    scene.add(world)

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: C.floor, roughness: 1 }))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    world.add(floor)
    const grid = new THREE.GridHelper(80, 40, 0x1c2433, 0x141a25)
    grid.position.y = 0.005
    world.add(grid)

    // ----- Stations -----
    const points = layout(steps.length)
    const padEdges = new THREE.LineBasicMaterial({ color: C.padEdge })
    const stations: Station[] = points.map((p, i) => {
      const material = new THREE.MeshStandardMaterial({ color: C.body, roughness: 0.55, metalness: 0.05, emissive: C.signal, emissiveIntensity: 0 })
      const edges = new THREE.LineBasicMaterial({ color: C.edge, transparent: true, opacity: 0.55 })

      const pad = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.14, 3.1), new THREE.MeshStandardMaterial({ color: C.pad, roughness: 0.9 }))
      pad.position.set(p.x, 0.07, p.z)
      pad.receiveShadow = true
      content.add(pad)
      const padEdge = new THREE.LineSegments(new THREE.EdgesGeometry(pad.geometry), padEdges)
      padEdge.position.copy(pad.position)
      content.add(padEdge)

      const { group, height, topMat } = buildStation(steps[i].shape ?? 'machine', material, edges)
      topMat.color.set(C.top)
      group.position.set(p.x, 0.14, p.z)
      content.add(group)

      // Invisible box for hover and click; it also gives the camera room for the label above
      const hit = new THREE.Mesh(new THREE.BoxGeometry(3.1, height + 0.9, 3.1), new THREE.MeshBasicMaterial({ visible: false }))
      hit.position.set(p.x, (height + 0.9) / 2, p.z)
      hit.userData.index = i
      content.add(hit)

      return { group, materials: [material, topMat], edges, hit, height }
    })

    // ----- Conveyors between stations -----
    const conveyors = points.slice(1).map((p, i) => {
      const a = points[i]
      const len = a.distanceTo(p) - 3.1
      const mat = new THREE.MeshStandardMaterial({ color: C.belt, roughness: 0.5, emissive: C.signal, emissiveIntensity: 0 })
      const belt = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.46), mat)
      belt.position.set((a.x + p.x) / 2, 0.12, (a.z + p.z) / 2)
      belt.rotation.y = Math.abs(a.x - p.x) > 0.01 ? 0 : Math.PI / 2
      belt.receiveShadow = true
      content.add(belt)
      return mat
    })

    // ----- Packet and active ring -----
    const packet = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.44, 0.44),
      new THREE.MeshStandardMaterial({ color: C.soft, emissive: C.signal, emissiveIntensity: 2.2 }),
    )
    packet.castShadow = true
    content.add(packet)
    const glow = new THREE.PointLight(C.signal, 7, 6, 1.6)
    content.add(glow)

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.72, 1.9, 64),
      new THREE.MeshBasicMaterial({ color: C.signal, transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.16
    content.add(ring)

    // ----- HTML labels projected onto the stations -----
    const labels = steps.map((s, i) => {
      const el = document.createElement('button')
      el.type = 'button'
      el.className = 'scene3d__label'
      el.setAttribute('aria-label', `Step ${i + 1}: ${s.label}`)
      const num = document.createElement('span')
      num.textContent = String(i + 1).padStart(2, '0')
      const text = document.createElement('em')
      text.className = 'scene3d__text'
      text.textContent = s.label
      el.append(num, text)
      el.addEventListener('click', () => selectRef.current?.(i))
      labelHost.appendChild(el)
      return el
    })

    // ----- Sizing -----
    let width = 1
    let height = 1
    const box = new THREE.Box3()
    const corner = new THREE.Vector3()

    // Frame the model exactly: measure its bounding box as the camera sees it and fit the
    // orthographic frustum around it, with a margin for the idle sway and the labels.
    const resize = () => {
      width = host.clientWidth
      height = host.clientHeight
      renderer.setSize(width, height, false)

      const savedYaw = world.rotation.y
      world.rotation.y = 0
      world.updateMatrixWorld(true)
      camera.updateMatrixWorld()

      // Measure station by station: one box around the whole serpentine would include empty
      // corners that show up as dead space in the isometric view
      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity
      for (const s of stations) {
        box.setFromObject(s.hit)
        for (let i = 0; i < 8; i++) {
          corner
            .set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z)
            .applyMatrix4(camera.matrixWorldInverse)
          minX = Math.min(minX, corner.x)
          maxX = Math.max(maxX, corner.x)
          minY = Math.min(minY, corner.y)
          maxY = Math.max(maxY, corner.y)
        }
      }
      world.rotation.y = savedYaw

      const aspect = width / height
      let w = (maxX - minX) * 1.1
      let h = (maxY - minY) * 1.16
      if (w / h > aspect) h = w / aspect
      else w = h * aspect
      const cx = (minX + maxX) / 2
      const cy = (minY + maxY) / 2 + (maxY - minY) * 0.03
      camera.left = cx - w / 2
      camera.right = cx + w / 2
      camera.top = cy + h / 2
      camera.bottom = cy - h / 2
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // ----- Drag to turn, hover and click to select -----
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let yaw = 0
    let yawTarget = 0
    let dragging = false
    let dragX = 0
    let moved = 0
    let hovered = -1

    const pick = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect()
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(stations.map((s) => s.hit))[0]
      return hit ? (hit.object.userData.index as number) : -1
    }
    const onDown = (e: PointerEvent) => {
      dragging = true
      dragX = e.clientX
      moved = 0
      renderer.domElement.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (dragging) {
        const dx = e.clientX - dragX
        dragX = e.clientX
        moved += Math.abs(dx)
        yawTarget = THREE.MathUtils.clamp(yawTarget + dx * 0.006, -0.6, 0.6)
      } else {
        hovered = pick(e)
        renderer.domElement.style.cursor = hovered >= 0 ? 'pointer' : 'grab'
      }
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      if (moved < 5) {
        const i = pick(e)
        if (i >= 0) selectRef.current?.(i)
      }
    }
    const onLeave = () => {
      hovered = -1
    }
    const canvas = renderer.domElement
    canvas.style.cursor = 'grab'
    canvas.style.touchAction = 'pan-y'
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onLeave)

    // ----- Animation -----
    const along = new THREE.Vector3()
    const proj = new THREE.Vector3()
    let packetT = activeRef.current
    const clock = new THREE.Clock()

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      const target = activeRef.current
      const k = reduced ? 1 : 1 - Math.exp(-dt * 4)

      // Turn: user yaw plus a slow idle sway
      yaw += (yawTarget - yaw) * (reduced ? 1 : 1 - Math.exp(-dt * 6))
      world.rotation.y = yaw + (reduced ? 0 : Math.sin(t * 0.25) * 0.06)

      // Packet rides the conveyors toward the active station
      packetT += (target - packetT) * k
      const i0 = Math.floor(packetT)
      const i1 = Math.min(points.length - 1, i0 + 1)
      along.lerpVectors(points[i0], points[i1], packetT - i0)
      const bob = reduced ? 0 : Math.sin(t * 3) * 0.06
      packet.position.set(along.x, 0.5 + bob, along.z)
      packet.rotation.y = t * 0.8
      glow.position.set(along.x, 1.4, along.z)

      // Ring under the active station
      const ap = points[target]
      ring.position.x += (ap.x - ring.position.x) * k
      ring.position.z += (ap.z - ring.position.z) * k
      const pulse = reduced ? 1 : 1 + Math.sin(t * 2.4) * 0.04
      ring.scale.set(pulse, pulse, 1)

      // Colour by state: pale clay ahead, light blue once done, full blue while active
      stations.forEach((s, i) => {
        const isActive = i === target
        const isPast = i < target
        const [body, top] = s.materials
        body.color.lerp(tmpColor.set(isActive ? C.signal : isPast ? C.past : C.body), k)
        top.color.lerp(tmpColor.set(isActive ? C.soft : isPast ? C.pastTop : C.top), k)
        const glowGoal = isActive ? 0.22 : i === hovered ? 0.14 : 0
        s.materials.forEach((m) => (m.emissiveIntensity += (glowGoal - m.emissiveIntensity) * k))
        s.edges.color.set(isActive ? 0x1d4fa8 : isPast ? 0x5a7cb6 : i === hovered ? C.signal : C.edge)
        const lift = isActive && !reduced ? 0.14 + Math.sin(t * 2) * 0.05 : 0
        s.group.position.y += (0.14 + lift - s.group.position.y) * k
      })
      conveyors.forEach((m, i) => {
        const lit = i < target
        m.color.lerp(tmpColor.set(lit ? C.signal : C.belt), k)
        m.emissiveIntensity += ((lit ? 0.35 : 0) - m.emissiveIntensity) * k
      })

      renderer.render(scene, camera)

      // Labels follow their stations on screen
      stations.forEach((s, i) => {
        proj.set(points[i].x, s.height + 0.75, points[i].z)
        world.localToWorld(proj)
        proj.project(camera)
        const x = (proj.x * 0.5 + 0.5) * width
        const y = (-proj.y * 0.5 + 0.5) * height
        const el = labels[i]
        el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`
        el.classList.toggle('is-active', i === target)
        el.classList.toggle('is-past', i < target)
      })
    }

    // Only render while on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        clock.getDelta()
        renderer.setAnimationLoop(frame)
      } else {
        renderer.setAnimationLoop(null)
      }
    })
    io.observe(host)
    frame()

    return () => {
      io.disconnect()
      ro.disconnect()
      renderer.setAnimationLoop(null)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
      labels.forEach((el) => el.remove())
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        mesh.geometry?.dispose()
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat?.dispose()
      })
      renderer.dispose()
      canvas.remove()
    }
  }, [steps])

  return (
    <div className="scene3d" ref={hostRef}>
      <div className="scene3d__labels" ref={labelsRef} />
    </div>
  )
}
