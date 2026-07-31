"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "@/lib/projects";
import { saveProjectTransition } from "@/lib/project-transition";

/** Infinite curved wall — spherical warp around view center (3D on both axes). */
const RADIUS = 16;
const TILE_W = 2.55;
const TILE_H = 3.35;
const STEP_YAW = 0.2;
const STEP_PITCH = 0.22;
const VIEW = 11;
const HALF = Math.floor(VIEW / 2);
const SLOT_COUNT = VIEW * VIEW;
const DRAG_CLICK_MAX = 10;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/** Stable hash pick — less obvious striping than a fixed grid. */
function projectAt(projects: Project[], worldCol: number, worldRow: number) {
  const n = projects.length;
  if (n === 0) throw new Error("No projects");
  let h = Math.imul(worldCol, 374761393) + Math.imul(worldRow, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return projects[mod(h >>> 0, n)]!;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeCardTexture(project: Project, cover: THREE.Texture) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return cover;

  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, 768, 1024);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 36px Syne, system-ui, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(project.title, 28, 28);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "400 22px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(project.subtitle, 740, 36);
  ctx.textAlign = "left";

  const img = cover.image as CanvasImageSource | undefined;
  if (img) {
    const boxX = 28;
    const boxY = 100;
    const boxW = 712;
    const boxH = 760;
    const iw =
      "naturalWidth" in (img as HTMLImageElement) &&
      (img as HTMLImageElement).naturalWidth
        ? (img as HTMLImageElement).naturalWidth
        : (img as HTMLImageElement).width || 1;
    const ih =
      "naturalHeight" in (img as HTMLImageElement) &&
      (img as HTMLImageElement).naturalHeight
        ? (img as HTMLImageElement).naturalHeight
        : (img as HTMLImageElement).height || 1;
    const scale = Math.max(boxW / iw, boxH / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxW, boxH);
    ctx.clip();
    ctx.drawImage(img, boxX + (boxW - dw) / 2, boxY + (boxH - dh) / 2, dw, dh);
    ctx.restore();
  } else {
    ctx.fillStyle = "#111";
    ctx.fillRect(28, 100, 712, 760);
  }

  ctx.font = "500 18px system-ui, sans-serif";
  let tagX = 28;
  for (const tag of project.tags) {
    const label = tag.toUpperCase();
    const w = ctx.measureText(label).width + 24;
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    roundRect(ctx, tagX, 900, w, 32, 16);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(label, tagX + 12, 908);
    tagX += w + 8;
  }
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.textAlign = "right";
  ctx.fillText(project.year, 740, 908);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function makePlusTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 256, 256);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(128, 56);
  ctx.lineTo(128, 200);
  ctx.moveTo(56, 128);
  ctx.lineTo(200, 128);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function curvedPosition(
  yaw: number,
  pitch: number,
  radius: number,
  curve: number,
) {
  // Full spherical mapping → depth + tilt on X and Y
  const k = Math.max(curve, 0.05);
  const cp = Math.cos(pitch * k);
  const sp = Math.sin(pitch * k);
  const cy = Math.cos(yaw * k);
  const sy = Math.sin(yaw * k);
  return new THREE.Vector3(sy * cp * radius, sp * radius, -cy * cp * radius);
}

type WallProps = {
  projects: Project[];
  curve: number;
  onSelect: (project: Project, rect: DOMRect) => void;
};

function CylindricalWall({ projects, curve, onSelect }: WallProps) {
  const covers = useTexture(projects.map((p) => p.cover));
  const cardBySlug = useMemo(() => {
    const map: Record<string, THREE.Texture> = {};
    projects.forEach((project, index) => {
      const cover = Array.isArray(covers) ? covers[index]! : covers;
      cover.colorSpace = THREE.SRGBColorSpace;
      map[project.slug] = makeCardTexture(project, cover);
    });
    return map;
  }, [covers, projects]);

  const orbit = useRef({
    yaw: 0,
    pitch: 0,
    vyaw: 0,
    vpitch: 0,
    radius: RADIUS,
    targetRadius: RADIUS,
    dragging: false,
    pinching: false,
    moved: 0,
  });
  const curveRef = useRef(curve);
  const groups = useRef<(THREE.Group | null)[]>(Array(SLOT_COUNT).fill(null));
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>(
    Array(SLOT_COUNT).fill(null),
  );
  const overlayMats = useRef<(THREE.MeshBasicMaterial | null)[]>(
    Array(SLOT_COUNT).fill(null),
  );
  const plusMats = useRef<(THREE.MeshBasicMaterial | null)[]>(
    Array(SLOT_COUNT).fill(null),
  );
  const hoverAmt = useRef<number[]>(Array(SLOT_COUNT).fill(0));
  const hovered = useRef<number | null>(null);
  const slotSlug = useRef<string[]>(Array(SLOT_COUNT).fill(""));
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ dist: number; radius: number } | null>(null);
  const dragLast = useRef<{ x: number; y: number } | null>(null);
  const origin = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const { gl, camera, size } = useThree();
  const plusTex = useMemo(() => makePlusTexture(), []);

  useEffect(() => {
    return () => plusTex.dispose();
  }, [plusTex]);

  useEffect(() => {
    curveRef.current = curve;
  }, [curve]);

  useEffect(() => {
    return () => {
      for (const tex of Object.values(cardBySlug)) tex.dispose();
    };
  }, [cardBySlug]);

  useEffect(() => {
    document.body.style.cursor = "grab";
    const el = gl.domElement;
    el.style.touchAction = "none";

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        orbit.current.targetRadius = THREE.MathUtils.clamp(
          orbit.current.targetRadius + event.deltaY * 0.035,
          10,
          26,
        );
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      el.setPointerCapture(event.pointerId);
      pointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      orbit.current.moved = 0;
      orbit.current.vyaw = 0;
      orbit.current.vpitch = 0;

      if (pointers.current.size === 1) {
        orbit.current.dragging = true;
        hovered.current = null;
        dragLast.current = { x: event.clientX, y: event.clientY };
        document.body.style.cursor = "grabbing";
      }

      if (pointers.current.size === 2) {
        orbit.current.pinching = true;
        orbit.current.dragging = false;
        hovered.current = null;
        const pts = [...pointers.current.values()];
        const dist = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y);
        pinchStart.current = {
          dist: Math.max(dist, 1),
          radius: orbit.current.radius,
        };
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointers.current.has(event.pointerId)) return;
      pointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pointers.current.size >= 2 && pinchStart.current) {
        const pts = [...pointers.current.values()];
        const dist = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y);
        const scale = pinchStart.current.dist / Math.max(dist, 1);
        orbit.current.targetRadius = THREE.MathUtils.clamp(
          pinchStart.current.radius * scale,
          10,
          26,
        );
        return;
      }

      if (orbit.current.dragging && dragLast.current) {
        const dx = event.clientX - dragLast.current.x;
        const dy = event.clientY - dragLast.current.y;
        orbit.current.moved += Math.abs(dx) + Math.abs(dy);
        const sens = 0.0034;
        // Unbounded pan — relative spherical warp keeps 3D on both axes
        orbit.current.yaw -= dx * sens;
        orbit.current.pitch += dy * sens;
        orbit.current.vyaw = -dx * sens * 0.4;
        orbit.current.vpitch = dy * sens * 0.4;
        dragLast.current = { x: event.clientX, y: event.clientY };
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      pointers.current.delete(event.pointerId);
      try {
        el.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }

      if (pointers.current.size < 2) {
        orbit.current.pinching = false;
        pinchStart.current = null;
      }
      if (pointers.current.size === 1) {
        const remaining = [...pointers.current.values()][0]!;
        orbit.current.dragging = true;
        dragLast.current = { x: remaining.x, y: remaining.y };
      }
      if (pointers.current.size === 0) {
        orbit.current.dragging = false;
        dragLast.current = null;
        document.body.style.cursor = "grab";
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      document.body.style.cursor = "";
    };
  }, [gl]);

  useFrame(() => {
    const o = orbit.current;

    if (!o.dragging && !o.pinching) {
      o.yaw += 0.00012;
      o.yaw += o.vyaw;
      o.pitch += o.vpitch;
      o.vyaw *= 0.92;
      o.vpitch *= 0.92;
      if (Math.abs(o.vyaw) < 0.00005) o.vyaw = 0;
      if (Math.abs(o.vpitch) < 0.00005) o.vpitch = 0;
    }

    o.radius += (o.targetRadius - o.radius) * 0.14;
    const strength = curveRef.current;
    const radius = THREE.MathUtils.lerp(70, o.radius, Math.max(strength, 0.05));

    const centerCol = Math.round(o.yaw / STEP_YAW);
    const centerRow = Math.round(o.pitch / STEP_PITCH);

    for (let j = 0; j < VIEW; j++) {
      for (let i = 0; i < VIEW; i++) {
        const idx = j * VIEW + i;
        const group = groups.current[idx];
        if (!group) continue;

        const worldCol = centerCol + (i - HALF);
        const worldRow = centerRow + (j - HALF);
        const project = projectAt(projects, worldCol, worldRow);

        if (slotSlug.current[idx] !== project.slug) {
          slotSlug.current[idx] = project.slug;
          const mat = mats.current[idx];
          if (mat) {
            mat.map = cardBySlug[project.slug] ?? null;
            mat.needsUpdate = true;
          }
          group.userData.project = project;
          group.userData.slug = project.slug;
        }

        const yaw = worldCol * STEP_YAW - o.yaw;
        const pitch = worldRow * STEP_PITCH - o.pitch;
        group.position.copy(curvedPosition(yaw, pitch, radius, strength));
        group.lookAt(origin);

        const ang = Math.hypot(yaw, pitch);
        const dim = Math.max(0.35, 1 - ang * 0.65 * strength);
        const mat = mats.current[idx];
        if (mat) mat.color.setRGB(dim, dim, dim);

        group.visible = ang < Math.PI * 0.55;

        const want =
          hovered.current === idx && !o.dragging && !o.pinching ? 1 : 0;
        hoverAmt.current[idx] += (want - hoverAmt.current[idx]) * 0.18;
        const h = hoverAmt.current[idx]!;
        const overlay = overlayMats.current[idx];
        const plus = plusMats.current[idx];
        if (overlay) overlay.opacity = h * 0.42;
        if (plus) plus.opacity = h;
      }
    }

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(0, 0, 0);
      camera.lookAt(0, 0, -1);
      camera.near = 0.1;
      camera.far = 200;
      camera.updateProjectionMatrix();
    }
  });

  const pick = (root: THREE.Object3D) => {
    if (orbit.current.moved > DRAG_CLICK_MAX) return;
    const project = root.userData.project as Project | undefined;
    if (!project) return;

    const box = new THREE.Box3().setFromObject(root);
    const mid = new THREE.Vector3();
    box.getCenter(mid);
    const pts = [
      new THREE.Vector3(box.min.x, box.min.y, mid.z),
      new THREE.Vector3(box.max.x, box.min.y, mid.z),
      new THREE.Vector3(box.min.x, box.max.y, mid.z),
      new THREE.Vector3(box.max.x, box.max.y, mid.z),
    ].map((v) => {
      const p = v.project(camera);
      return {
        x: (p.x * 0.5 + 0.5) * size.width,
        y: (-p.y * 0.5 + 0.5) * size.height,
      };
    });
    const left = Math.min(...pts.map((p) => p.x));
    const right = Math.max(...pts.map((p) => p.x));
    const top = Math.min(...pts.map((p) => p.y));
    const bottom = Math.max(...pts.map((p) => p.y));
    onSelect(project, new DOMRect(left, top, right - left, bottom - top));
  };

  return (
    <group>
      {Array.from({ length: SLOT_COUNT }, (_, idx) => {
        const fallback = projects[idx % projects.length]!;
        return (
          <group
            key={idx}
            ref={(node) => {
              groups.current[idx] = node;
            }}
            userData={{ slug: fallback.slug, project: fallback, slot: idx }}
            frustumCulled={false}
            onClick={(event) => {
              event.stopPropagation();
              pick(event.eventObject);
            }}
            onPointerOver={(event) => {
              event.stopPropagation();
              if (orbit.current.dragging || orbit.current.pinching) return;
              hovered.current = idx;
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              if (hovered.current === idx) hovered.current = null;
              document.body.style.cursor = orbit.current.dragging
                ? "grabbing"
                : "grab";
            }}
          >
            <mesh frustumCulled={false}>
              <planeGeometry args={[TILE_W, TILE_H]} />
              <meshBasicMaterial
                ref={(mat) => {
                  mats.current[idx] = mat;
                }}
                map={cardBySlug[fallback.slug]}
                toneMapped={false}
                side={THREE.FrontSide}
                depthWrite
                depthTest
                polygonOffset
                polygonOffsetFactor={1}
                polygonOffsetUnits={1}
              />
            </mesh>
            <mesh position={[0, 0, 0.025]} renderOrder={2} frustumCulled={false}>
              <planeGeometry args={[TILE_W, TILE_H]} />
              <meshBasicMaterial
                ref={(mat) => {
                  overlayMats.current[idx] = mat;
                }}
                color="#00f306"
                transparent
                opacity={0}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, 0, 0.04]} renderOrder={3} frustumCulled={false}>
              <planeGeometry args={[0.62, 0.62]} />
              <meshBasicMaterial
                ref={(mat) => {
                  plusMats.current[idx] = mat;
                }}
                map={plusTex}
                transparent
                opacity={0}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function ScreenVignette() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthTest: false,
        depthWrite: false,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vec2 c = vUv - 0.5;
            float d = length(c * vec2(1.2, 1.05));
            float a = smoothstep(0.28, 0.98, d) * 0.88;
            gl_FragColor = vec4(0.0, 0.0, 0.0, a);
          }
        `,
      }),
    [],
  );

  return (
    <mesh frustumCulled={false} renderOrder={100}>
      <planeGeometry args={[2, 2]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function Scene(props: WallProps) {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <CylindricalWall {...props} />
      <ScreenVignette />
    </>
  );
}

export default function ProjectsWall3D({
  projects,
  curve = 1,
  onNavigate,
}: {
  projects: Project[];
  curve?: number;
  onNavigate: (href: string) => void;
}) {
  const navigating = useRef(false);

  const onSelect = (project: Project, rect: DOMRect) => {
    if (navigating.current) return;
    navigating.current = true;
    saveProjectTransition({
      slug: project.slug,
      src: project.cover,
      title: project.title,
      rect: {
        top: rect.top,
        left: rect.left,
        width: Math.max(rect.width, 1),
        height: Math.max(rect.height, 1),
      },
    });
    onNavigate(`/projets/${project.slug}`);
  };

  return (
    <div className="absolute inset-0 z-10 h-svh w-full touch-none overflow-hidden bg-black overscroll-none">
      <Canvas
        dpr={[1, 1.75]}
        eventPrefix="client"
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 0], fov: 50, near: 0.1, far: 200 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000");
          gl.domElement.style.touchAction = "none";
        }}
      >
        <Suspense fallback={null}>
          <Scene projects={projects} curve={curve} onSelect={onSelect} />
        </Suspense>
      </Canvas>
    </div>
  );
}
