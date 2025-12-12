"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { ComponentProps, ComponentType, useEffect, useMemo, useState } from "react";
import {
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  FaceSmileIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { Chip } from "@/components/ui/chip";
import { socialCategories, socialPosts, type SocialCategory } from "@/data/command-center";
import { cn } from "@/lib/utils";

const filters: Array<"All" | SocialCategory> = ["All", ...socialCategories];
const placeholderImage = "/assets/background_image.png";

const shareOptions = [
  { id: "copy", label: "Copy", color: "#ff7300" },
  { id: "whatsapp", label: "WA", color: "#25D366" },
  { id: "telegram", label: "TG", color: "#2CA5E0" },
  { id: "mail", label: "Mail", color: "#f9d423" },
];

const commentsMock = [
  { id: "c1", author: "Rhea", text: "On it. Sending team now ⚡" },
  { id: "c2", author: "Command", text: "Route opened via Gate 3." },
  { id: "c3", author: "Ops", text: "Need med kits ETA 5m." },
];

function formatTimestamp(value: string) {
  try {
    return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return value;
  }
}

function percent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function highlightCaption(text: string) {
  return text.split(/(\s+)/).map((part, index) => {
    if (part.startsWith("#")) {
      return (
        <span key={`${part}-${index}`} className="text-primary drop-shadow-[0_0_12px_rgba(255,115,0,0.6)]">
          {part}
        </span>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function GlassAvatar() {
  return (
    <Canvas camera={{ position: [0, 0, 3.2] }} className="h-16 w-16">
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 4]} intensity={2.6} color="#ff7300" />
      <pointLight position={[-3, -1, -2]} intensity={1.4} color="#3b82f6" />
      <Float speed={2.4} rotationIntensity={0.9} floatIntensity={0.8}>
        <mesh>
          <sphereGeometry args={[0.9, 64, 64]} />
          <meshStandardMaterial color="#fef3c7" metalness={0.4} roughness={0.15} />
        </mesh>
      </Float>
    </Canvas>
  );
}

function ParallaxMedia({ src, alt }: { src: string; alt: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-20, 20], [6, -6]);
  const rotateY = useTransform(x, [-20, 20], [-6, 6]);
  const smoothX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      className="group relative h-[420px] w-full overflow-hidden rounded-3xl border border-soft bg-gradient-to-b from-[color:var(--panel-tint,#fff1e0)] via-[color:var(--surface)] to-[color:var(--panel-tint,#fff1e0)] shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
      style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: "preserve-3d" }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 40;
        const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 40;
        x.set(offsetX);
        y.set(offsetY);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Image
        src={src || placeholderImage}
        alt={alt}
        fill
        className="object-cover transition duration-700 group-hover:scale-[1.03]"
        sizes="(min-width: 1024px) 640px, 100vw"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/40" />
    </motion.div>
  );
}

type IconType = ComponentType<ComponentProps<"svg">>;

function InteractionButton({
  icon: Icon,
  label,
  onClick,
  color,
}: {
  icon: IconType;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.08 }}
      className="group inline-flex items-center gap-2 rounded-full border border-soft bg-[color:var(--surface)] px-4 py-3 text-sm font-semibold text-ink shadow-sm transition"
      style={{ color }}
    >
      <Icon className="size-5" />
      <span className="text-ink group-hover:text-primary">{label}</span>
    </motion.button>
  );
}

export default function AdminSocialPostsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const filtered = useMemo(
    () => (filter === "All" ? socialPosts : socialPosts.filter((post) => post.category === filter)),
    [filter]
  );
  const [selectedId, setSelectedId] = useState<string | null>(filtered[0]?.id ?? null);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(true);

  useEffect(() => {
    if (filtered.length && !filtered.find((post) => post.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((post) => post.id === selectedId);
  const pctRaised = selected ? percent((selected.raised / selected.goal) * 100) : 0;

  return (
    <div className="relative space-y-6 pb-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[color:var(--surface)] via-[color:var(--surface-alt)] to-[#fff7ec]" />
      <header className="relative overflow-hidden rounded-3xl border border-soft bg-[color:var(--surface)] px-5 py-5 shadow-[0_25px_80px_rgba(0,0,0,0.08)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(231,136,23,0.12)] via-[rgba(255,179,71,0.08)] to-[rgba(74,58,255,0.08)] blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-soft bg-[color:var(--panel-tint)]">
              <GlassAvatar />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Immersive Feed</p>
              <h2 className="font-heading text-2xl font-bold text-ink">Holo Social Grid</h2>
              <p className="text-sm text-muted">Cinematic, real-time, glassy UI for field-grade signals.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((category) => (
              <Chip key={category} active={filter === category} onClick={() => setFilter(category)}>
                {category}
              </Chip>
            ))}
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Live Posts</p>
              <p className="text-xs text-muted">Parallax + 3D actions</p>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
                {filtered.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedId(post.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left transition backdrop-blur",
                    selectedId === post.id
                      ? "border-primary bg-primary/10 shadow-sm text-ink"
                      : "border-soft bg-[color:var(--panel-tint)] text-ink hover:border-primary/60 hover:bg-[color:var(--panel-strong,#ffe6c7)]"
                  )}
                >
                  <p className="text-xs text-muted">{formatTimestamp(post.timestamp)}</p>
                  <p className="font-semibold text-ink">
                    {post.author} <span className="font-normal text-muted">{post.handle}</span>
                  </p>
                  <p className="text-xs text-muted">{post.location}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-ink">{post.body}</p>
                </button>
              ))}
              {!filtered.length ? <p className="text-sm text-muted">No posts in this category.</p> : null}
            </div>
          </div>

          {selected ? (
            <motion.div
              layout
              className="relative overflow-hidden rounded-[28px] border border-soft bg-gradient-to-b from-[color:var(--surface)] via-[color:var(--surface-alt)] to-[#fff5e7] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(231,136,23,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(88,95,255,0.12),transparent_35%)]" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted">{formatTimestamp(selected.timestamp)}</p>
                    <p className="text-base font-semibold text-ink">
                      {selected.author} <span className="text-muted">{selected.handle}</span>
                    </p>
                    <p className="text-xs text-muted">{selected.location}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {selected.category}
                  </span>
                </div>

                <ParallaxMedia src={selected.imageUrl || placeholderImage} alt={selected.id} />

                <div className="flex flex-wrap items-center gap-3">
                  <InteractionButton
                    icon={HeartIcon}
                    label={liked ? "Loved" : "Love"}
                    color={liked ? "#ff4d6d" : "#ffb347"}
                    onClick={() => setLiked((prev) => !prev)}
                  />
                  <InteractionButton icon={ChatBubbleOvalLeftIcon} label="Comment" color="#4ade80" onClick={() => setCommentOpen((prev) => !prev)} />
                  <InteractionButton
                    icon={PaperAirplaneIcon}
                    label="Share"
                    color="#60a5fa"
                    onClick={() => setShareOpen((prev) => !prev)}
                  />
                  <InteractionButton icon={BookmarkIcon} label="Save" color="#facc15" onClick={() => {}} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 rounded-full border border-soft bg-[color:var(--surface)] px-3 py-2 text-xs text-muted"
                  >
                    <FaceSmileIcon className="size-4 text-primary" />
                    <span>Reactions ready</span>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {shareOpen ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative h-24"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {shareOptions.map((option, index) => {
                          const angle = (index / shareOptions.length) * Math.PI * 2;
                          const radius = 68;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          return (
                            <motion.button
                              key={option.id}
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="absolute flex h-12 w-12 items-center justify-center rounded-full text-xs font-semibold text-white shadow-lg shadow-black/30"
                              style={{
                                background: option.color,
                                translateX: x,
                                translateY: y,
                              }}
                            >
                              {option.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="space-y-2 text-sm text-ink">
                  <p className="font-semibold text-ink">Caption</p>
                  <p className="text-ink">{highlightCaption(selected.body)}</p>
                  <p className="text-xs text-muted">
                    Raised Rs {selected.raised.toLocaleString("en-IN")} of Rs{" "}
                    {selected.goal.toLocaleString("en-IN")} | {pctRaised}% tracked
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Micro-interactions</p>
              <p className="text-xs text-muted">120Hz smooth</p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>- 3D parallax tilt on media with lighting overlay</li>
              <li>- Heart blast, elastic comment tap, radial share halo</li>
              <li>- Magnetic hover on glass buttons</li>
              <li>- Glass header with floating 3D avatar</li>
              <li>- Responsive to mobile, tablet, desktop</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Comment Drawer</p>
              <button
                type="button"
                onClick={() => setCommentOpen((prev) => !prev)}
                className="text-xs font-semibold text-primary"
              >
                {commentOpen ? "Collapse" : "Expand"}
              </button>
            </div>
            <AnimatePresence initial={false}>
              {commentOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: 20 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3">
                    {commentsMock.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-2xl border border-soft bg-[color:var(--panel-tint)] px-3 py-2 text-sm text-ink"
                      >
                        <p className="text-xs font-semibold text-primary">{comment.author}</p>
                        <p className="text-muted">{comment.text}</p>
                      </div>
                    ))}
                    <div className="rounded-2xl border border-dashed border-soft bg-[color:var(--panel-tint)] px-3 py-3 text-xs text-muted">
                      Add frictionless comments with spring physics and emoji selector.
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
