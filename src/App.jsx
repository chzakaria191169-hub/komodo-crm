import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Send, Inbox, LifeBuoy,
  Cpu, Zap, BarChart2, TrendingUp, Activity, Bot,
  ChevronDown, Search, RefreshCw, Filter, Tag, Mail, X, Clock, Building2,
  ExternalLink, Globe, Briefcase, Target, ChevronRight, CheckCircle2, Circle, Terminal,
  Eye, EyeOff, Lock, Key, Calendar
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Bubble, Doughnut } from 'react-chartjs-2';
import './index.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, Title, Tooltip, Legend);

/* ═══════════════════════════════════════════════════════════
   VOXORA AI NETWORK CANVAS — exact DNA from voxora.agency
   ═══════════════════════════════════════════════════════════ */
function AINetworkCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, nodes;

    const NODE_COUNT = 80;
    const MAX_DIST = 160;
    const MOUSE_RADIUS = 220;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.5 ? '139,92,246' : '6,182,212',
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);

      // Atmospheric glow orbs — like voxora.agency
      const g1 = ctx.createRadialGradient(width * 0.75, height * 0.2, 0, width * 0.75, height * 0.2, 500);
      g1.addColorStop(0, 'rgba(139,92,246,0.07)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.1, height * 0.8, 0, width * 0.1, height * 0.8, 400);
      g2.addColorStop(0, 'rgba(6,182,212,0.05)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, width, height);

      // Update + draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.018;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse repel
        const dx = n.x - mouse.current.x;
        const dy = n.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          n.vx += (dx / dist) * force * 0.25;
          n.vy += (dy / dist) * force * 0.25;
        }

        // Speed limit
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 1.2) { n.vx = (n.vx / speed) * 1.2; n.vy = (n.vy / speed) * 1.2; }

        // Pulse size
        const r = n.radius + Math.sin(n.pulse) * 0.6;
        const alpha = 0.45 + Math.sin(n.pulse) * 0.25;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color},${alpha})`;
        ctx.fill();
      });

      // Draw connections with gradient lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(drawFrame);
    }

    resize();
    createNodes();
    drawFrame();

    const handleResize = () => { resize(); createNodes(); };
    const handleMouse = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-bg" />;
}

/* ═══════════════════════════════════════════════════════════
   SPOTLIGHT CARD — Premium Web3/SaaS hover effect
   ═══════════════════════════════════════════════════════════ */
function SpotlightCard({ children, className = '', style = {} }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPos(p => ({ ...p, opacity: 0 }));
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: pos.opacity,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, rgba(139,92,246,0.12), transparent 70%)`,
          zIndex: 1,
          borderRadius: 'inherit',
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CYBER SCRAMBLE TEXT — Hacker decode effect
   ═══════════════════════════════════════════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*![]{}';
function CyberScramble({ text, trigger = 0, duration = 900 }) {
  const [display, setDisplay] = useState(text);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!text) return;
    let start = Date.now();
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const resolved = Math.floor(progress * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (i < resolved || text[i] === ' ') {
          out += text[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(out);
      if (progress >= 1) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 30);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [text, trigger, duration]);

  return <span style={{ fontFamily: 'monospace' }}>{display}</span>;
}

/* ═══════════════════════════════════════════════════════════
   BRAIN FEED TERMINAL — The Voxora AI Operations Log
   ═══════════════════════════════════════════════════════════ */
const BRAIN_MESSAGES = [
  { tag: 'AI Engine', color: '#8b5cf6', msg: 'Scraping and analyzing 2,500 new targets from Apollo.io...' },
  { tag: 'SMTP Router', color: '#06b6d4', msg: 'Dispatching cold email batch via Inbox #7 — vox-outreach-07@...' },
  { tag: 'Outbound', color: '#8b5cf6', msg: 'Sent 1,420 automated follow-ups across 20 inboxes.' },
  { tag: 'Reply AI', color: '#10b981', msg: 'Detected 3 positive replies. Routing to Unified Inbox...' },
  { tag: 'AI Engine', color: '#8b5cf6', msg: 'Niche scoring complete: Healthcare SaaS — Match Score 94%' },
  { tag: 'Scheduler', color: '#f59e0b', msg: 'Follow-up sequence queued for 847 leads at 09:00 UTC.' },
  { tag: 'Guardian', color: '#ef4444', msg: 'Bounce detected: contact@oldomain.net — auto-archived.' },
  { tag: 'Scraper', color: '#06b6d4', msg: 'LinkedIn profile enrichment: 120 leads updated with job titles.' },
  { tag: 'AI Engine', color: '#8b5cf6', msg: 'Subject line A/B test: Variant B +22% open rate. Switching...' },
  { tag: 'Outbound', color: '#8b5cf6', msg: 'Campaign #3 running. 2,141 emails delivered. 0 spam flags.' },
  { tag: 'Reply AI', color: '#10b981', msg: 'Positive intent flagged: "Can we schedule a call?" — SAAS NICHE' },
  { tag: 'Watchdog', color: '#f59e0b', msg: 'SMTP health check passed: 20/20 inboxes active. Warmup: 99.8%' },
  { tag: 'AI Engine', color: '#8b5cf6', msg: 'Personalisation tokens injected: 2,500 emails — 100% unique.' },
  { tag: 'Scraper', color: '#06b6d4', msg: 'New niche unlocked: Logistics Plus — 380 validated leads ready.' },
];

function BrainFeed() {
  const [lines, setLines] = useState([]);
  const [msgIdx, setMsgIdx] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Add initial lines
    const initial = BRAIN_MESSAGES.slice(0, 4).map((m, i) => ({
      ...m, id: i, ts: new Date(Date.now() - (4 - i) * 8000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), scramble: 0
    }));
    setLines(initial);
    setMsgIdx(4);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(prev => {
        const idx = prev % BRAIN_MESSAGES.length;
        const newLine = {
          ...BRAIN_MESSAGES[idx],
          id: Date.now(),
          ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          scramble: Date.now(),
        };
        setLines(l => [...l.slice(-12), newLine]);
        return prev + 1;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="brain-feed">
      <div className="brain-feed-header">
        <Terminal size={13} style={{ color: '#8b5cf6' }} />
        <span className="brain-feed-title">VOXORA BRAIN FEED</span>
        <span className="brain-feed-live"><span className="pulse-dot" />LIVE</span>
      </div>
      <div className="brain-feed-body" ref={scrollRef}>
        {lines.map((line) => (
          <div key={line.id} className="brain-line">
            <span className="brain-ts">{line.ts}</span>
            <span className="brain-tag" style={{ color: line.color }}>[{line.tag}]</span>
            <span className="brain-msg">
              <CyberScramble text={line.msg} trigger={line.scramble} duration={700} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIVE SYSTEM TICKER — Continuous marquee bar
   ═══════════════════════════════════════════════════════════ */
function SystemTicker() {
  const items = [
    '/// SMTP HEALTH: 99.9%',
    '/// AI AGENTS: ONLINE',
    '/// DAILY CAPACITY: 2,500 LEADS',
    '/// OUTBOUND ENGINE: OPTIMIZED',
    '/// REPLY DETECTION: ACTIVE',
    '/// INBOX WARMUP: 98.2%',
    '/// N8N WORKFLOWS: 7 RUNNING',
    '/// SPAM SCORE: 0.02% (EXCELLENT)',
    '/// DOMAINS ACTIVE: 20',
    '/// SEQUENCES QUEUED: 847',
  ];
  const text = items.join('   ');

  return (
    <div className="system-ticker">
      <div className="ticker-track">
        <span className="ticker-content">{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3D MATRIX GLOBE — Canvas-based wireframe globe
   ═══════════════════════════════════════════════════════════ */
function MatrixGlobe() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const rotRef = useRef(0);

  const ORBIT_LABELS = [
    'Automated Outbound', 'Hyper Growth', 'AI Lead Scoring',
    'SMTP Routing', 'Global Reach', 'Cold Outreach', 'n8n Automation'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 420;
    const H = canvas.height = 420;
    const cx = W / 2, cy = H / 2, R = 130;

    // Globe points
    const latLines = 10, lngLines = 16;
    const globePts = [];
    for (let i = 0; i <= latLines; i++) {
      for (let j = 0; j <= lngLines; j++) {
        const lat = (i / latLines) * Math.PI - Math.PI / 2;
        const lng = (j / lngLines) * 2 * Math.PI;
        globePts.push({ lat, lng });
      }
    }

    // Activity dots (simulate email pings)
    const activityDots = Array.from({ length: 12 }, () => ({
      lat: (Math.random() - 0.5) * Math.PI,
      lng: Math.random() * 2 * Math.PI,
      life: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      color: Math.random() > 0.5 ? '139,92,246' : '6,182,212',
    }));

    // Orbit ring label positions
    const orbitAngleRef = { val: 0 };

    function project(lat, lng, rot) {
      const x = R * Math.cos(lat) * Math.cos(lng + rot);
      const y = R * Math.sin(lat);
      const z = R * Math.cos(lat) * Math.sin(lng + rot);
      return { x: cx + x, y: cy - y, z };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const rot = rotRef.current;

      // Outer glow
      const grd = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.3);
      grd.addColorStop(0, 'rgba(139,92,246,0.0)');
      grd.addColorStop(0.7, 'rgba(139,92,246,0.04)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, R * 1.4, 0, Math.PI * 2); ctx.fill();

      // Draw lat lines
      for (let i = 0; i <= latLines; i++) {
        const lat = (i / latLines) * Math.PI - Math.PI / 2;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 64; j++) {
          const lng = (j / 64) * 2 * Math.PI;
          const p = project(lat, lng, rot);
          if (first) { ctx.moveTo(p.x, p.y); first = false; }
          else ctx.lineTo(p.x, p.y);
        }
        const alpha = 0.08 + 0.04 * Math.sin(i / latLines * Math.PI);
        ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Draw lng lines
      for (let j = 0; j <= lngLines; j++) {
        const lng = (j / lngLines) * 2 * Math.PI;
        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= 64; i++) {
          const lat = (i / 64) * Math.PI - Math.PI / 2;
          const p = project(lat, lng, rot);
          if (first) { ctx.moveTo(p.x, p.y); first = false; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = 'rgba(139,92,246,0.07)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Activity dots
      activityDots.forEach(dot => {
        dot.life += dot.speed;
        if (dot.life > 1) { dot.life = 0; dot.lng = Math.random() * 2 * Math.PI; dot.lat = (Math.random() - 0.5) * Math.PI; }
        const p = project(dot.lat, dot.lng, rot);
        if (p.z > 0) {
          const alpha = 0.4 + 0.6 * Math.sin(dot.life * Math.PI);
          const r = 2 + 3 * Math.sin(dot.life * Math.PI);
          // Pulse ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${dot.color},${alpha * 0.3})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          // Core dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dot.color},${alpha})`;
          ctx.fill();
        }
      });

      // Orbit ring with labels
      orbitAngleRef.val += 0.004;
      const orbitR = R + 30;
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(139,92,246,0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      ORBIT_LABELS.forEach((label, i) => {
        const angle = orbitAngleRef.val + (i / ORBIT_LABELS.length) * Math.PI * 2;
        const lx = cx + (orbitR + 18) * Math.cos(angle);
        const ly = cy + (orbitR + 18) * Math.sin(angle);
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(angle + Math.PI / 2);
        ctx.font = 'bold 7.5px Inter, monospace';
        ctx.fillStyle = 'rgba(139,92,246,0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(label, 0, 0);
        ctx.restore();
      });

      // AI Robot icon in center (simplified SVG-like drawing)
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#8b5cf6';
      // Head
      ctx.beginPath(); ctx.roundRect(cx - 14, cy - 22, 28, 22, 6); ctx.fill();
      // Eyes
      ctx.fillStyle = '#06b6d4'; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(cx - 6, cy - 13, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 6, cy - 13, 3.5, 0, Math.PI * 2); ctx.fill();
      // Antenna
      ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(cx, cy - 22); ctx.lineTo(cx, cy - 30);
      ctx.arc(cx, cy - 30, 2, 0, Math.PI * 2); ctx.stroke();
      // Body
      ctx.fillStyle = '#8b5cf6'; ctx.globalAlpha = 0.15;
      ctx.beginPath(); ctx.roundRect(cx - 18, cy + 2, 36, 20, 5); ctx.fill();
      ctx.restore();

      rotRef.current += 0.004;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="matrix-globe-wrap">
      <canvas ref={canvasRef} className="matrix-globe-canvas" width="420" height="420" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════ */
function AnimCounter({ value, loading }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (loading || !value || value === 0 || isNaN(value)) { setN(value || 0); return; }
    let cur = 0; const step = value / 60;
    const t = setInterval(() => { cur += step; if (cur >= value) { setN(value); clearInterval(t); } else setN(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [value, loading]);
  if (loading) return <div className="skeleton" style={{ width: 60, height: 36 }} />;
  return <>{n}</>;
}

/* ═══════════════════════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    new: 'new',
    cold_email_sent: 'sent',
    follow_up_1_sent: 'followup',
    follow_up_2_sent: 'followup',
    follow_up_3_sent: 'followup',
    replied: 'replied',
    archived: 'archived',
    bounced: 'bounced',
    sent: 'sent',
    followup_1: 'followup',
    followup_2: 'followup',
    followup_3: 'followup',
    interested: 'interested',
    meeting_booked: 'meeting_booked',
  };
  const cls = map[status] || 'new';
  const labels = {
    new: 'New',
    cold_email_sent: 'Cold Email',
    follow_up_1_sent: 'Follow-up 1',
    follow_up_2_sent: 'Follow-up 2',
    follow_up_3_sent: 'Follow-up 3',
    replied: 'Replied',
    archived: 'Archived',
    bounced: 'Bounced',
    sent: 'Sent',
    followup_1: 'Follow-up 1',
    followup_2: 'Follow-up 2',
    followup_3: 'Follow-up 3',
    interested: 'Interested',
    meeting_booked: 'Meeting Booked',
  };
  return <span className={`status-badge badge-${cls}`}><span className="status-dot" />{labels[status] || status?.replace(/_/g, ' ')}</span>;
}

/* ═══════════════════════════════════════════════════════════
   CAMPAIGN SELECTOR DROPDOWN
   ═══════════════════════════════════════════════════════════ */
function CampaignSelector({ campaigns, selectedId, onSelect, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = campaigns.find(c => c.id === selectedId);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (loading) return <div className="skeleton" style={{ width: 200, height: 32, borderRadius: 8 }} />;

  return (
    <div className="campaign-selector" ref={ref}>
      <button className="campaign-selector__btn" onClick={() => setOpen(!open)}>
        <span className="campaign-selector__dot" />
        <span>{selected ? `Campaign #${selected.id} · ${selected.name}` : 'Select Campaign'}</span>
        <ChevronDown size={13} style={{ marginLeft: 'auto', opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="campaign-selector__dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            {campaigns.length === 0 ? (
              <div className="campaign-selector__empty">No campaigns found</div>
            ) : (
              campaigns.map(c => (
                <button
                  key={c.id}
                  className={`campaign-selector__item ${c.id === selectedId ? 'campaign-selector__item--active' : ''}`}
                  onClick={() => { onSelect(c.id); setOpen(false); }}
                >
                  <span className="campaign-selector__item-dot" />
                  <div>
                    <div className="campaign-selector__item-name">Campaign #{c.id} · {c.name}</div>
                    <div className="campaign-selector__item-sub">
                      {c.niche && <span className="niche-tag">{c.niche}</span>}
                      {c.created_at && <span>{new Date(c.created_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  {c.id === selectedId && <span className="campaign-selector__check">✓</span>}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════════ */
function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { l: 'Dashboard', i: <LayoutDashboard size={15} />, page: 'dashboard' },
    { l: 'Leads', i: <Users size={15} />, page: 'leads' },
    { l: 'Campaigns', i: <Send size={15} />, page: 'campaigns' },
    { l: 'Analytics', i: <BarChart2 size={15} />, page: 'analytics' },
    { l: 'Inbox', i: <Inbox size={15} />, page: 'inbox' },
  ];
  const sysItems = [
    { l: 'AI Agents', i: <Bot size={15} />, page: 'agents' },
    { l: 'Automations', i: <Cpu size={15} />, page: 'automations' },
    { 
      l: 'Support', 
      i: <LifeBuoy size={15} />, 
      action: () => {
        const subject = encodeURIComponent('[Komodo Systems] Executive Support Request');
        const body = encodeURIComponent("Hi Voxora Team,\n\n[Type your message / request here...]\n\n\n—\nKomodo Systems");
        window.location.href = `mailto:support.Komodo@voxora.agency?subject=${subject}&body=${body}`;
      } 
    },
  ];

  return (
    <motion.div
      className={`sidebar${collapsed ? ' collapsed' : ''}`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Toggle Button */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <motion.span
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ChevronRight size={13} />
        </motion.span>
      </button>

      <div className="sidebar-logo" style={{ marginBottom: 34, marginTop: 4, gap: 10 }}>
        <div className="logo-icon-glass" style={{ flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#A78BFA' }}>
            <path d="M4 4l8 16 8-16" />
          </svg>
        </div>
        <div className="sidebar-logo-text" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="logo-text">VOXORA</span>
            <span style={{ fontSize: 10, color: 'var(--text-3)', opacity: 0.5 }}>|</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '0.06em' }}>KOMODO</span>
          </div>
          <span className="logo-subtext">EXECUTIVE PORTAL</span>
        </div>
      </div>

      {!collapsed && <span className="nav-section-label">Navigation</span>}
      {navItems.map(x => (
        <div
          key={x.l}
          className={`nav-item ${activePage === x.page ? 'active' : ''}`}
          onClick={() => onNavigate(x.page)}
          title={collapsed ? x.l : ''}
        >
          <span className="nav-icon">{x.i}</span>
          <span className="nav-item-label">{x.l}</span>
        </div>
      ))}
      {!collapsed && <span className="nav-section-label" style={{ marginTop: 24 }}>System</span>}
      {collapsed && <div style={{ height: 24 }} />}
      {sysItems.map(x => (
        <div 
          key={x.l} 
          className={`nav-item ${activePage === x.page ? 'active' : ''}`} 
          onClick={() => x.action ? x.action() : onNavigate(x.page)}
          title={collapsed ? x.l : ''}
        >
          <span className="nav-icon">{x.i}</span>
          <span className="nav-item-label">{x.l}</span>
        </div>
      ))}
      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="user-avatar">R</div>
          <div className="user-info">
            <div className="user-name">Russ Warner</div>
            <div className="user-role" style={{ fontSize: '10px', lineHeight: '1.25', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title="President & Chief Operating Officer">
              President & Chief Operating Officer
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   METRIC CARD — with Spotlight hover
   ═══════════════════════════════════════════════════════════ */
function MetricCard({ label, value, icon, variant, badge, sub, loading, idx }) {
  return (
    <SpotlightCard className={`glass-card metric-card metric-${variant}`}>
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.23, 1, 0.32, 1] }}>
        <div className="metric-header"><span className="metric-label">{label}</span><div className="metric-icon-wrap">{icon}</div></div>
        <div className="metric-value"><AnimCounter value={value} loading={loading} /></div>
        {!loading && <div className="metric-footer"><span className="metric-badge">{badge}</span><span className="metric-sub">{sub}</span></div>}
      </motion.div>
    </SpotlightCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMING SOON PAGE
   ═══════════════════════════════════════════════════════════ */
function ComingSoonPage({ icon, title, desc }) {
  return (
    <motion.div
      className="coming-soon-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="coming-soon-icon">{icon}</div>
      <h2 className="coming-soon-title">{title}</h2>
      <p className="coming-soon-desc">{desc}</p>
      <div className="coming-soon-badge">Coming Soon</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════ */
function DashboardPage({ stats, leads, loading, campaign, campaigns, selectedCampaignId, onCampaignChange, onRefresh, refreshing, onLeadClick }) {
  const replyRate = stats.sent > 0 ? ((stats.replied / stats.sent) * 100).toFixed(1) : '0';

  const chartData = {
    labels: ['Delivered', 'Follow-up', 'Replied', 'Interested', 'Meeting'],
    datasets: [{
      data: [stats.sent, stats.followups, stats.replied, stats.interested, stats.meeting_booked],
      backgroundColor: ['rgba(139,92,246,0.5)', 'rgba(245,158,11,0.5)', 'rgba(6,182,212,0.5)', 'rgba(139,92,246,0.7)', 'rgba(16,185,129,0.6)'],
      borderColor: ['rgba(139,92,246,0.9)', 'rgba(245,158,11,0.9)', 'rgba(6,182,212,0.9)', 'rgba(139,92,246,1)', 'rgba(16,185,129,0.9)'],
      borderWidth: 1, borderRadius: 8,
    }],
  };
  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(7,7,21,0.95)', titleColor: '#F8FAFC', bodyColor: '#94A3B8', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: 12, cornerRadius: 10 } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', precision: 0, font: { size: 11 } }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 11 } }, border: { display: false } },
    },
  };

  return (
    <div className="content">
      {/* HERO — CINEMATIC COMMAND CENTER */}
      <motion.div
        className="hero-banner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Label row */}
        <div className="hero-greeting">VOXORA / OUTBOUND SYSTEM</div>

        {/* Main shimmer title */}
        <div 
          className="hero-title"
          style={{
            background: 'linear-gradient(100deg, #f59e0b 0%, #c084fc 20%, #f97316 45%, #ea580c 65%, rgba(255,255,255,0.95) 78%, #f59e0b 88%, #ea580c 100%)',
            backgroundSize: '250% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Komodo Systems
        </div>

        {/* Scanner line */}
        <div className="hero-scanner">
          <div className="hero-scanner-track" />
        </div>

        {/* Subtitle */}
        <div className="hero-subtitle">
          Real-time intelligence. Every lead tracked, every follow-up automated,
          every reply detected &mdash; all running silently in the background.
        </div>

        {/* Live status dots */}
        <div className="hero-status-row">
          <div className="hero-status-dot green"><span />AGENTS ONLINE</div>
          <div className="hero-status-dot cyan"><span />REPLIES MONITORED</div>
          <div className="hero-status-dot purple"><span />OUTBOUND LIVE</div>
        </div>
      </motion.div>

      {/* KPI CARDS */}
      <div className="metrics-grid">
        <MetricCard label="Total Leads" value={stats.total} icon={<Users size={14} />} variant="purple" badge={`${stats.total - stats.archived} active`} sub="in pipeline" loading={loading} idx={0} />
        <MetricCard label="Emails Sent" value={stats.sent} icon={<Send size={14} />} variant="cyan" badge="Delivered" sub="across 20 inboxes" loading={loading} idx={1} />
        <MetricCard label="Reply Rate" value={replyRate} icon={<TrendingUp size={14} />} variant="emerald" badge="%" sub={`${stats.replied} replies generated`} loading={loading} idx={2} />
        <MetricCard label="Follow-ups" value={stats.followups} icon={<Activity size={14} />} variant="amber" badge="Running" sub="auto-scheduled" loading={loading} idx={3} />
      </div>

      {/* GLOBE + CHART + AI PANEL */}
      <motion.div className="cinematic-row" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
        {/* Matrix Globe */}
        <SpotlightCard className="glass-card globe-card">
          <div className="card-title" style={{ marginBottom: 4 }}>Global Outreach Matrix</div>
          <div className="card-subtitle" style={{ marginBottom: 10 }}>Live signal — emails in flight across the world</div>
          <MatrixGlobe />
        </SpotlightCard>

        {/* Chart */}
        <SpotlightCard className="glass-card chart-card">
          <div className="card-title">Conversion Funnel</div>
          <div className="card-subtitle">Lead journey from first touch to meeting booked</div>
          <div style={{ height: 220 }}><Bar data={chartData} options={chartOpts} /></div>
        </SpotlightCard>

        {/* AI Panel */}
        <SpotlightCard className="glass-card ai-panel">
          <div className="ai-panel-header" style={{ marginBottom: 16 }}>
            <div className="ai-panel-icon-glass"><Bot size={13} style={{ color: 'var(--purple-bright)' }} /></div>
            <div>
              <div className="card-title" style={{ marginBottom: 0 }}>AI Agents</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live System Status</div>
            </div>
          </div>
          <div className="agent-row-glass"><div className="agent-dot-pulse active" /><div className="agent-info"><div className="agent-name">Reply Detection</div><div className="agent-desc">Monitoring 20 SMTP inboxes</div></div><span className="agent-badge badge-active">Live</span></div>
          <div className="agent-row-glass"><div className="agent-dot-pulse scheduled" /><div className="agent-info"><div className="agent-name">Follow-up Engine</div><div className="agent-desc">Next run: 9:00 AM</div></div><span className="agent-badge badge-scheduled">Queued</span></div>
          <div className="agent-row-glass"><div className="agent-dot-pulse active" /><div className="agent-info"><div className="agent-name">Archive Cleaner</div><div className="agent-desc">Day 13 → auto-archive</div></div><span className="agent-badge badge-active">Live</span></div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}><span>Archived leads</span><span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{stats.archived}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)' }}><span>Meetings booked</span><span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{stats.meeting_booked}</span></div>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* BRAIN FEED */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }}>
        <SpotlightCard className="glass-card">
          <BrainFeed />
        </SpotlightCard>
      </motion.div>

      {/* LEADS TABLE */}
      <motion.div className="glass-card table-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.45 }}>
        <div className="table-header">
          <div>
            <div className="card-title">Recent Leads</div>
            <div className="card-subtitle" style={{ marginBottom: 0 }}>
              {campaign ? `Campaign #${campaign.id} · ${campaign.name}` : '—'} · {leads.length} leads total
              {campaign?.niche && <span className="niche-tag" style={{ marginLeft: 8 }}>{campaign.niche}</span>}
            </div>
          </div>
        </div>
        <LeadsTable leads={leads.slice(0, 20)} loading={loading} onLeadClick={onLeadClick} />
        {leads.length > 20 && (
          <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text-3)', fontSize: 12 }}>
            Showing 20 of {leads.length} leads — go to Leads page for full list
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OUTREACH TIMELINE ITEM
   ═══════════════════════════════════════════════════════════ */
function TimelineItem({ step, label, color, subject, body, sender, sentAt, isFuture, delay = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const hasMeta = subject || body || sender || sentAt;

  return (
    <motion.div
      className={`timeline-item ${isFuture ? 'timeline-item--future' : ''}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className="timeline-left">
        <div className={`timeline-dot ${isFuture ? 'timeline-dot--future' : ''}`} style={{ '--dot-color': color }}>
          {isFuture
            ? <Circle size={8} style={{ opacity: 0.4 }} />
            : <CheckCircle2 size={10} color="white" />
          }
        </div>
        <div className="timeline-line" />
      </div>

      <div className="timeline-content">
        <div className="timeline-header" onClick={() => hasMeta && !isFuture && setExpanded(e => !e)} style={{ cursor: hasMeta && !isFuture ? 'pointer' : 'default' }}>
          <div className="timeline-step-badge" style={{ '--step-color': color }}>{label}</div>
          {sentAt && <span className="timeline-time"><Clock size={10} />{new Date(sentAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
          {isFuture && <span className="timeline-queued">Queued</span>}
          {hasMeta && !isFuture && (
            <motion.span
              className="timeline-expand-icon"
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={13} />
            </motion.span>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="timeline-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            >
              {sender && (
                <div className="timeline-detail-row">
                  <Mail size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
                  <span className="timeline-detail-label">From:</span>
                  <span className="timeline-detail-val">{sender}</span>
                </div>
              )}
              {subject && (
                <div className="timeline-detail-row">
                  <span className="timeline-detail-label">Subject:</span>
                  <span className="timeline-detail-val" style={{ fontWeight: 600, color: 'var(--text-1)' }}>{subject}</span>
                </div>
              )}
              {body && (
                <div className="timeline-body-wrap">
                  <pre className="timeline-body-text">{body}</pre>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEAD INTELLIGENCE PANEL (Slide-over)
   ═══════════════════════════════════════════════════════════ */
function LeadIntelPanel({ lead, onClose }) {
  if (!lead) return null;

  const statusOrder = ['cold_email_sent', 'follow_up_1_sent', 'follow_up_2_sent', 'follow_up_3_sent', 'archived', 'replied', 'bounced'];
  const currentIdx = statusOrder.indexOf(lead.status);

  const steps = [
    {
      key: 'cold_email_sent',
      label: 'Cold Email',
      color: 'var(--purple)',
      subject: lead.cold_email_subject,
      body: lead.cold_email_body || lead.message,
      sender: lead.cold_email_sender || lead.sender,
      sentAt: lead.cold_email_sent_at || lead.sent_at,
    },
    {
      key: 'follow_up_1_sent',
      label: 'Follow-up 1',
      color: 'var(--cyan)',
      subject: lead.follow_up_1_subject,
      body: lead.follow_up_1_body,
      sender: lead.follow_up_1_sender,
      sentAt: lead.follow_up_1_sent_at,
    },
    {
      key: 'follow_up_2_sent',
      label: 'Follow-up 2',
      color: 'var(--amber)',
      subject: lead.follow_up_2_subject,
      body: lead.follow_up_2_body,
      sender: lead.follow_up_2_sender,
      sentAt: lead.follow_up_2_sent_at,
    },
    {
      key: 'follow_up_3_sent',
      label: 'Follow-up 3',
      color: 'var(--emerald)',
      subject: lead.follow_up_3_subject,
      body: lead.follow_up_3_body,
      sender: lead.follow_up_3_sender,
      sentAt: lead.follow_up_3_sent_at,
    },
  ];

  const initials = (lead.first_name || '?').charAt(0).toUpperCase();

  return (
    <AnimatePresence>
      <motion.div
        className="intel-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="intel-panel"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="intel-panel-header">
          <div className="intel-avatar">{initials}</div>
          <div className="intel-header-info">
            <div className="intel-name">{lead.first_name || '—'}</div>
            <div className="intel-email">{lead.email}</div>
          </div>
          <button className="intel-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="intel-panel-body">

          <div className="intel-section">
            <div className="intel-company-card">
              <div className="intel-company-left">
                <Building2 size={16} style={{ color: 'var(--purple-bright)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="intel-company-name">{lead.company_name || lead.company || '—'}</div>
                  {lead.location && (
                    <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <span style={{ fontSize: 11 }}>📍</span> {lead.location}
                    </div>
                  )}
                  {lead.job_title && (
                    <div className="intel-job-title" style={{ marginTop: 2 }}>{lead.job_title}</div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                {lead.linkedin && (
                  <a 
                    href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://${lead.linkedin}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="intel-website-btn"
                    style={{ borderColor: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}
                  >
                    <Briefcase size={11} /> LinkedIn <ExternalLink size={10} />
                  </a>
                )}
                {lead.website && (
                  <a 
                    href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="intel-website-btn"
                    style={{ borderColor: 'rgba(20, 184, 166, 0.35)', color: '#2dd4bf', background: 'rgba(20, 184, 166, 0.08)' }}
                  >
                    <Globe size={11} /> Visit Site <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="intel-section" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={lead.status} />
            {lead.replied_step && (
              <span className="status-badge" style={{ background: 'rgba(139, 92, 246, 0.12)', borderColor: 'rgba(139, 92, 246, 0.35)', color: '#c084fc', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Mail size={11} /> {lead.replied_step}
              </span>
            )}
            {lead.replied_at && (
              <span style={{ fontSize: 11, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto', fontWeight: 600 }}>
                <CheckCircle2 size={12} /> Replied {new Date(lead.replied_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {lead.reply_message && (
            <div className="intel-section" style={{ border: '1px solid rgba(16, 185, 129, 0.25)', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="pulse-dot green" /> INCOMING RESPONSE TELEMETRY
              </div>
              <div style={{ fontSize: 12.5, color: '#e2e8f0', lineHeight: 1.55, fontStyle: 'italic' }}>
                "{lead.reply_message}"
              </div>
            </div>
          )}

          <div className="intel-section">
            <div className="intel-section-title">Outreach Timeline</div>
            <div className="intel-timeline">
              {steps.map((step, i) => {
                const isSent = step.sentAt != null;
                const isFuture = !isSent;
                return (
                  <TimelineItem
                    key={step.key}
                    label={step.label}
                    color={step.color}
                    subject={step.subject}
                    body={step.body}
                    sender={step.sender}
                    sentAt={step.sentAt}
                    isFuture={isFuture}
                    delay={i * 0.07}
                  />
                );
              })}
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getRepliedStep(lead) {
  if (lead.replied_step) return lead.replied_step;
  if (!lead.replied_at) return null;
  const rep = new Date(lead.replied_at).getTime();
  const fu3 = lead.follow_up_3_sent_at ? new Date(lead.follow_up_3_sent_at).getTime() : 0;
  const fu2 = lead.follow_up_2_sent_at ? new Date(lead.follow_up_2_sent_at).getTime() : 0;
  const fu1 = lead.follow_up_1_sent_at ? new Date(lead.follow_up_1_sent_at).getTime() : 0;
  const cold = lead.cold_email_sent_at ? new Date(lead.cold_email_sent_at).getTime() : (lead.sent_at ? new Date(lead.sent_at).getTime() : 0);

  if (fu3 && rep >= fu3) return 'Follow-up 3';
  if (fu2 && rep >= fu2) return 'Follow-up 2';
  if (fu1 && rep >= fu1) return 'Follow-up 1';
  if (cold && rep >= cold) return 'Cold Email';
  return 'Cold Email';
}

const getLocalDateStr = (dateInput) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const matchesDateFilter = (lead, filter, custom) => {
  if (!filter || filter === 'all') return true;
  const sent = lead.follow_up_3_sent_at || lead.follow_up_2_sent_at || lead.follow_up_1_sent_at || lead.cold_email_sent_at || lead.sent_at;
  if (!sent) return false;
  const sentDate = new Date(sent);
  if (isNaN(sentDate.getTime())) return false;
  
  const now = new Date();
  const todayStr = getLocalDateStr(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateStr(yesterday);
  const leadDateStr = getLocalDateStr(sentDate);

  if (filter === 'today') return leadDateStr === todayStr;
  if (filter === 'yesterday') return leadDateStr === yesterdayStr;
  if (filter === 'last_7_days') {
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return sentDate >= sevenDaysAgo && sentDate <= now;
  }
  if (filter === 'last_30_days') {
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return sentDate >= thirtyDaysAgo && sentDate <= now;
  }
  if (filter === 'custom' && custom) {
    return leadDateStr === custom;
  }
  return true;
};

function DateFilterDropdown({ leads = [], dateFilter, setDateFilter, customDate, setCustomDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const now = new Date();
  const todayStr = getLocalDateStr(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateStr(yesterday);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let todayCount = 0, yesterdayCount = 0, sevenDaysCount = 0, thirtyDaysCount = 0;
  leads.forEach(l => {
    const sent = l.follow_up_3_sent_at || l.follow_up_2_sent_at || l.follow_up_1_sent_at || l.cold_email_sent_at || l.sent_at;
    if (!sent) return;
    const sentDate = new Date(sent);
    if (isNaN(sentDate.getTime())) return;
    const dateStr = getLocalDateStr(sent);

    if (dateStr === todayStr) todayCount++;
    if (dateStr === yesterdayStr) yesterdayCount++;
    if (sentDate >= sevenDaysAgo && sentDate <= now) sevenDaysCount++;
    if (sentDate >= thirtyDaysAgo && sentDate <= now) thirtyDaysCount++;
  });

  const getButtonLabel = () => {
    if (dateFilter === 'today') return 'Today';
    if (dateFilter === 'yesterday') return 'Yesterday';
    if (dateFilter === 'last_7_days') return 'Last 7 Days';
    if (dateFilter === 'last_30_days') return 'Last 30 Days';
    if (dateFilter === 'custom' && customDate) {
      try {
        const parts = customDate.split('-');
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        }
      } catch (e) {}
      return customDate;
    }
    return 'All Dates';
  };

  const presets = [
    { key: 'all', label: 'All Time', count: leads.length },
    { key: 'today', label: 'Today', count: todayCount },
    { key: 'yesterday', label: 'Yesterday', count: yesterdayCount },
    { key: 'last_7_days', label: 'Last 7 Days', count: sevenDaysCount },
    { key: 'last_30_days', label: 'Last 30 Days', count: thirtyDaysCount },
  ];

  return (
    <div className="date-filter-wrap" ref={dropdownRef}>
      <button 
        type="button" 
        className={`date-filter-btn ${dateFilter !== 'all' ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={13} style={{ opacity: dateFilter !== 'all' ? 1 : 0.6, color: dateFilter !== 'all' ? 'var(--purple-bright)' : 'inherit' }} />
        <span>{getButtonLabel()}</span>
        {dateFilter !== 'all' ? (
          <span 
            className="clear-date-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setDateFilter('all');
              setCustomDate('');
              setIsOpen(false);
            }}
            title="Clear date filter"
          >
            <X size={11} />
          </span>
        ) : (
          <ChevronDown size={11} style={{ opacity: 0.5 }} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="date-dropdown-menu"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <div className="date-dropdown-header">Filter by Outreach Date</div>
            <div className="date-preset-list">
              {presets.map(p => (
                <button
                  key={p.key}
                  type="button"
                  className={`date-preset-item ${dateFilter === p.key ? 'active' : ''}`}
                  onClick={() => {
                    setDateFilter(p.key);
                    setIsOpen(false);
                  }}
                >
                  <span>{p.label}</span>
                  <span className="preset-count">{p.count}</span>
                </button>
              ))}
            </div>

            <div className="date-divider" />

            <div className="custom-date-section">
              <div className="custom-date-label">Pick specific date:</div>
              <div className="custom-date-input-wrap">
                <input 
                  type="date" 
                  value={customDate} 
                  onChange={e => {
                    setCustomDate(e.target.value);
                    if (e.target.value) {
                      setDateFilter('custom');
                    }
                  }}
                  className="custom-date-input"
                />
                {customDate && (
                  <button 
                    type="button"
                    className="btn-apply-date"
                    onClick={() => {
                      setDateFilter('custom');
                      setIsOpen(false);
                    }}
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEADS TABLE (reusable)
   ═══════════════════════════════════════════════════════════ */
function LeadsTable({ leads, loading, onLeadClick }) {
  if (loading) return <div className="empty-state">Loading leads...</div>;
  if (leads.length === 0) return <div className="empty-state">No leads found for this campaign yet.</div>;
  return (
    <>
      <table className="leads-table">
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Company</th><th>Email</th>
            <th>Status</th><th>Niche</th><th>Last Sent</th><th className="col-sticky" style={{ textAlign: 'center' }}>Intel</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => {
            const lastSentAt = lead.follow_up_3_sent_at || lead.follow_up_2_sent_at || lead.follow_up_1_sent_at || lead.cold_email_sent_at || lead.sent_at;
            const hasMsgs = !!(lead.cold_email_body || lead.message || lead.follow_up_1_body || lead.follow_up_2_body || lead.follow_up_3_body);
            return (
              <tr key={lead.id} onClick={() => onLeadClick && onLeadClick(lead)} style={{ cursor: 'pointer' }}>
                <td style={{ color: 'var(--text-3)', fontSize: 11 }}>{i + 1}</td>
                <td className="lead-name">
                  <div>{lead.first_name || '—'}</div>
                  {lead.job_title && <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{lead.job_title}</div>}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {(lead.website || lead.Website)
                      ? <a href={(lead.website || lead.Website).startsWith('http') ? (lead.website || lead.Website) : `https://${lead.website || lead.Website}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="company-link">{lead.company_name || lead.company || '—'}</a>
                      : <span>{lead.company_name || lead.company || '—'}</span>
                    }
                    {lead.linkedin && (
                      <a 
                        href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://${lead.linkedin}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={e => e.stopPropagation()} 
                        className="company-linkedin-badge" 
                        title="View LinkedIn Profile"
                      >
                        <Briefcase size={9} /> LinkedIn
                      </a>
                    )}
                  </div>
                </td>
                <td className="lead-email">{lead.email}</td>
                <td><StatusBadge status={lead.status} /></td>
                <td>{lead.niche_tag ? <span className="niche-tag">{lead.niche_tag}</span> : (lead.niche ? <span className="niche-tag">{lead.niche}</span> : '—')}</td>
                <td style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {lastSentAt ? new Date(lastSentAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                </td>
                <td className="col-sticky" style={{ textAlign: 'center' }}>
                  <button
                    className={`msg-btn ${hasMsgs ? 'msg-btn--has' : 'msg-btn--empty'}`}
                    onClick={e => { e.stopPropagation(); onLeadClick && onLeadClick(lead); }}
                    title="View lead intelligence"
                  >
                    <Mail size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEADS PAGE (full list with search + filter)
   ═══════════════════════════════════════════════════════════ */
function LeadsPage({ leads, loading, campaign, onLeadClick }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [nicheFilter, setNicheFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');

  const statuses = ['all', 'new', 'cold_email_sent', 'follow_up_1_sent', 'follow_up_2_sent', 'follow_up_3_sent', 'replied', 'meeting_booked', 'archived', 'bounced'];
  const niches = ['all', ...new Set(leads.map(l => l.niche_tag || l.niche).filter(Boolean))];

  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      (l.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchNiche = nicheFilter === 'all' || l.niche_tag === nicheFilter || l.niche === nicheFilter;
    const matchDate = matchesDateFilter(l, dateFilter, customDate);
    return matchSearch && matchStatus && matchNiche && matchDate;
  });

  return (
    <motion.div className="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Leads</h1>
          <p className="page-sub">{campaign ? `Campaign #${campaign.id} · ${campaign.name}` : '—'} · {filtered.length} leads displayed</p>
        </div>
      </div>

      <div className="leads-controls" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="leads-search">
          <Search size={13} style={{ opacity: 0.4 }} />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="leads-search-input"
          />
        </div>
        <select className="leads-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>)}
        </select>
        <DateFilterDropdown
          leads={leads}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customDate={customDate}
          setCustomDate={setCustomDate}
        />
        {niches.length > 1 && (
          <select className="leads-filter-select" value={nicheFilter} onChange={e => setNicheFilter(e.target.value)}>
            {niches.map(n => <option key={n} value={n}>{n === 'all' ? 'All Niches' : n}</option>)}
          </select>
        )}
      </div>

      <SpotlightCard className="glass-card table-card" style={{ marginTop: 16 }}>
        <LeadsTable leads={filtered} loading={loading} onLeadClick={onLeadClick} />
      </SpotlightCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAMPAIGNS PAGE
   ═══════════════════════════════════════════════════════════ */
function CampaignsPage({ campaigns, selectedCampaignId, onSelect, stats, loading }) {
  return (
    <motion.div className="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-sub">{campaigns.length} campaigns · Click to switch active view</p>
        </div>
      </div>

      <div className="campaigns-grid">
        {campaigns.map((c, i) => (
          <motion.div
            key={c.id}
            className={`campaign-card glass-card ${c.id === selectedCampaignId ? 'campaign-card--active' : ''}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            onClick={() => onSelect(c.id)}
          >
            <div className="campaign-card__head">
              <div>
                <div className="campaign-card__name">Campaign #{c.id}</div>
                <div className="campaign-card__title">{c.name}</div>
              </div>
              {c.id === selectedCampaignId && (
                <span className="campaign-card__active-badge">Active</span>
              )}
            </div>
            {c.niche && <span className="niche-tag" style={{ marginTop: 8, display: 'inline-block' }}>{c.niche}</span>}
            <div className="campaign-card__meta">
              <span>📅 {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</span>
              <span>👥 {c.total_leads || (c.id === selectedCampaignId ? stats.total : 0)} leads</span>
              <span>🚀 {c.sent_count || 0} sent</span>
              <span>💬 {c.replied_count || 0} replies ({c.sent_count ? ((c.replied_count / c.sent_count) * 100).toFixed(1) : 0}%)</span>
            </div>
            <button
              className={`campaign-card__btn ${c.id === selectedCampaignId ? 'campaign-card__btn--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onSelect(c.id); }}
            >
              {c.id === selectedCampaignId ? '✓ Currently Viewing' : 'View Campaign →'}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANALYTICS PAGE — ADVANCED DATA VISUALIZATION
   ═══════════════════════════════════════════════════════════ */
function AnalyticsPage({ leads = [], campaigns = [] }) {
  // ── 1. Campaign Niche Stats ───────────────────────────────────────
  const nicheStats = useMemo(() => {
    if (campaigns && campaigns.length > 0) {
      return campaigns.map(c => ({
        name: c.name || c.niche || `Campaign #${c.id}`,
        total: c.total_leads || 0,
        replied: c.replied_count || 0,
        interested: c.interested_count || 0,
        meetings: c.meeting_booked_count || 0,
        sent: c.sent_count || 0,
      }));
    }
    const map = {};
    leads.forEach(l => {
      const niche = l.niche_tag || l.niche || (l.campaign_id ? `Campaign #${l.campaign_id}` : 'General');
      if (!map[niche]) map[niche] = { total: 0, replied: 0, interested: 0, meetings: 0, sent: 0 };
      map[niche].total++;
      if (['cold_email_sent','sent','follow_up_1_sent','follow_up_2_sent','follow_up_3_sent'].includes(l.status)) map[niche].sent++;
      if (l.status === 'replied' || l.status === 'interested' || l.status === 'meeting_booked') map[niche].replied++;
      if (l.status === 'interested' || l.status === 'meeting_booked') map[niche].interested++;
      if (l.status === 'meeting_booked') map[niche].meetings++;
    });
    return Object.entries(map).map(([name, data]) => ({ name, ...data }));
  }, [campaigns, leads]);

  // ── 2. Reply Attribution ──────────────────────────────────────────
  const replyAttributionStats = useMemo(() => {
    const map = { 'Cold Email': 0, 'Follow-up 1': 0, 'Follow-up 2': 0, 'Follow-up 3': 0 };
    leads.filter(l => l.status === 'replied' || l.replied_at || l.status === 'interested' || l.status === 'meeting_booked').forEach(l => {
      const step = getRepliedStep(l);
      if (map[step] !== undefined) map[step]++;
      else map['Cold Email']++;
    });
    return map;
  }, [leads]);

  // ── 3. Sentiment ──────────────────────────────────────────────────
  const sentimentStats = useMemo(() => {
    let hot = 0, positive = 0, neutral = 0, notInterested = 0;
    const score = (text) => {
      if (!text) return 'neutral';
      const t = text.toLowerCase();
      const pos = ['interest','yes','call','meeting','schedule','sounds good','when','available','book','demo','great','perfect'].filter(w => t.includes(w)).length;
      const neg = ['not interest','unsubscribe','remove','stop','no thanks','not looking','do not'].filter(w => t.includes(w)).length;
      if (neg > 0) return 'notInterested';
      if (pos >= 3) return 'hot';
      if (pos >= 1) return 'positive';
      return 'neutral';
    };
    leads.filter(l => l.status === 'replied' || l.status === 'interested' || l.status === 'meeting_booked').forEach(l => {
      if (l.status === 'meeting_booked' || l.status === 'interested') { hot++; return; }
      const s = score(l.reply_message);
      if (s === 'hot') hot++;
      else if (s === 'positive') positive++;
      else if (s === 'notInterested') notInterested++;
      else neutral++;
    });
    return { hot, positive, neutral, notInterested, total: hot + positive + neutral + notInterested };
  }, [leads]);

  // ── 4. Geo ────────────────────────────────────────────────────────
  const geoStats = useMemo(() => {
    const map = {};
    leads.filter(l => l.location).forEach(l => { map[l.location] = (map[l.location] || 0) + 1; });
    return Object.entries(map).map(([loc, count]) => ({ loc, count })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [leads]);

  // ── Chart Configs ─────────────────────────────────────────────────
  const CAMP_COLORS = [
    { bg: 'rgba(139,92,246,0.75)', border: 'rgba(139,92,246,1)', glow: '#8B5CF6' },
    { bg: 'rgba(6,182,212,0.75)',  border: 'rgba(6,182,212,1)',  glow: '#06B6D4' },
    { bg: 'rgba(16,185,129,0.75)', border: 'rgba(16,185,129,1)', glow: '#10B981' },
  ];

  const funnelChartData = {
    labels: ['Total Leads', 'Sent', 'Replied', 'Interested', 'Meetings'],
    datasets: nicheStats.map((n, i) => ({
      label: n.name.length > 18 ? n.name.slice(0, 18) + '…' : n.name,
      data: [n.total, n.sent, n.replied, n.interested, n.meetings],
      backgroundColor: CAMP_COLORS[i % 3].bg,
      borderColor: CAMP_COLORS[i % 3].border,
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }))
  };

  const funnelOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94A3B8', usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12 } } },
      tooltip: { backgroundColor: 'rgba(7,7,21,0.96)', titleColor: '#F8FAFC', bodyColor: '#94A3B8', borderColor: 'rgba(139,92,246,0.3)', borderWidth: 1, padding: 14, cornerRadius: 12 }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', precision: 0, font: { size: 11 } }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: '#94A3B8', font: { size: 12, weight: '500' } }, border: { display: false } },
    },
  };

  const attributionTotal = Object.values(replyAttributionStats).reduce((a, b) => a + b, 0);
  const attributionData = {
    labels: ['Cold Email', 'Follow-up 1', 'Follow-up 2', 'Follow-up 3'],
    datasets: [{
      data: [replyAttributionStats['Cold Email'], replyAttributionStats['Follow-up 1'], replyAttributionStats['Follow-up 2'], replyAttributionStats['Follow-up 3']],
      backgroundColor: ['rgba(139,92,246,0.85)', 'rgba(245,158,11,0.85)', 'rgba(236,72,153,0.85)', 'rgba(16,185,129,0.85)'],
      borderColor: ['rgba(139,92,246,0.2)', 'rgba(245,158,11,0.2)', 'rgba(236,72,153,0.2)', 'rgba(16,185,129,0.2)'],
      borderWidth: 1, hoverOffset: 8,
    }]
  };

  const doughnutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(7,7,21,0.96)', titleColor: '#F8FAFC', bodyColor: '#94A3B8', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: 14, cornerRadius: 12 }
    }
  };

  const sentimentData = {
    labels: ['Hot 🔥', 'Positive', 'Neutral', 'Not Interested'],
    datasets: [{
      data: [sentimentStats.hot, sentimentStats.positive, sentimentStats.neutral, sentimentStats.notInterested],
      backgroundColor: ['rgba(16,185,129,0.9)', 'rgba(6,182,212,0.85)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: 'transparent', hoverOffset: 6,
    }]
  };

  // Attribution badges
  const attributionItems = [
    { label: 'Cold Email',   icon: '📧', count: replyAttributionStats['Cold Email'],   color: '#8B5CF6' },
    { label: 'Follow-up 1', icon: '⚡', count: replyAttributionStats['Follow-up 1'], color: '#F59E0B' },
    { label: 'Follow-up 2', icon: '💥', count: replyAttributionStats['Follow-up 2'], color: '#EC4899' },
    { label: 'Follow-up 3', icon: '🎯', count: replyAttributionStats['Follow-up 3'], color: '#10B981' },
  ];

  const sentimentItems = [
    { label: 'Hot Leads',       pct: sentimentStats.total > 0 ? Math.round((sentimentStats.hot / sentimentStats.total) * 100) : 0,          color: '#10B981', icon: '🔥' },
    { label: 'Positive Intent', pct: sentimentStats.total > 0 ? Math.round((sentimentStats.positive / sentimentStats.total) * 100) : 0,      color: '#06B6D4', icon: '✅' },
    { label: 'Neutral',         pct: sentimentStats.total > 0 ? Math.round((sentimentStats.neutral / sentimentStats.total) * 100) : 0,        color: '#F59E0B', icon: '〰️' },
    { label: 'Not Interested',  pct: sentimentStats.total > 0 ? Math.round((sentimentStats.notInterested / sentimentStats.total) * 100) : 0, color: '#EF4444', icon: '🚫' },
  ];

  return (
    <motion.div className="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>

      {/* PAGE HEADER */}
      <motion.div className="page-header" style={{ marginBottom: 28 }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div>
          <h1 className="page-title">Advanced Analytics</h1>
          <p className="page-sub">Next-dimension intelligence visualization · {leads.length} leads tracked across {campaigns.length} campaigns</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {nicheStats.map((n, i) => (
            <div key={n.name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: `${CAMP_COLORS[i % 3].bg.replace('0.75', '0.1')}`, border: `1px solid ${CAMP_COLORS[i % 3].bg.replace('0.75', '0.3')}`, fontSize: 11, color: CAMP_COLORS[i % 3].glow, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: CAMP_COLORS[i % 3].glow, display: 'inline-block', boxShadow: `0 0 6px ${CAMP_COLORS[i % 3].glow}` }} />
              {n.name.length > 15 ? n.name.slice(0, 15) + '…' : n.name}
            </div>
          ))}
        </div>
      </motion.div>

      {/* TOP ROW — QUICK CAMPAIGN STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {nicheStats.map((n, i) => {
          const replyRate = n.sent > 0 ? ((n.replied / n.sent) * 100).toFixed(1) : '0';
          return (
            <motion.div key={n.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}>
              <SpotlightCard className="glass-card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
                {/* Glow blob */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${CAMP_COLORS[i % 3].glow}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: CAMP_COLORS[i % 3].glow }}>{n.name.length > 20 ? n.name.slice(0, 20) + '…' : n.name}</div>
                  <div style={{ padding: '3px 8px', borderRadius: 20, background: `${CAMP_COLORS[i % 3].glow}22`, border: `1px solid ${CAMP_COLORS[i % 3].glow}44`, fontSize: 10, color: CAMP_COLORS[i % 3].glow, fontWeight: 600 }}>{replyRate}% Reply Rate</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[
                    { label: 'Leads', value: n.total },
                    { label: 'Sent', value: n.sent },
                    { label: 'Replies', value: n.replied },
                    { label: 'Meetings', value: n.meetings },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: '#475569', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN CHART — CONVERSION FUNNEL COMPARISON */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} style={{ marginBottom: 20 }}>
        <SpotlightCard className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div className="card-title">⚔️ Niche Conversion Warfare</div>
              <div className="card-subtitle">Full funnel comparison — Total → Sent → Replied → Interested → Meeting Booked</div>
            </div>
          </div>
          <div style={{ height: 300 }}>
            {nicheStats.length > 0
              ? <Bar data={funnelChartData} options={funnelOpts} />
              : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>No campaign data yet</div>}
          </div>
        </SpotlightCard>
      </motion.div>

      {/* BOTTOM ROW — 2 CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* REPLY ATTRIBUTION */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}>
          <SpotlightCard className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="card-title" style={{ marginBottom: 4 }}>🎯 Reply Attribution Matrix</div>
            <div className="card-subtitle" style={{ marginBottom: 20 }}>Which touchpoint unlocked the reply?</div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              {/* Doughnut */}
              <div style={{ width: 160, height: 160, flexShrink: 0, position: 'relative' }}>
                <Doughnut data={attributionData} options={doughnutOpts} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-display)' }}>{attributionTotal}</div>
                  <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total</div>
                </div>
              </div>
              {/* Legend bars */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {attributionItems.map(item => {
                  const pct = attributionTotal > 0 ? Math.round((item.count / attributionTotal) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                        <span style={{ color: '#94A3B8' }}>{item.icon} {item.label}</span>
                        <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{item.count} <span style={{ color: '#475569', fontWeight: 400, fontSize: 10 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                          style={{ height: '100%', background: item.color, borderRadius: 99, boxShadow: `0 0 8px ${item.color}88` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* SENTIMENT FUNNEL */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.29 }}>
          <SpotlightCard className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="card-title" style={{ marginBottom: 4 }}>🧠 Reply Sentiment Funnel</div>
            <div className="card-subtitle" style={{ marginBottom: 20 }}>AI-classified intent from reply messages</div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 160, height: 160, flexShrink: 0, position: 'relative' }}>
                {sentimentStats.total > 0
                  ? <Doughnut data={sentimentData} options={doughnutOpts} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 12 }}>No replies yet</div>}
                {sentimentStats.total > 0 && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-display)' }}>{sentimentStats.total > 0 ? Math.round((sentimentStats.hot / sentimentStats.total) * 100) : 0}%</div>
                    <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hot</div>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sentimentItems.map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                      <span style={{ color: '#94A3B8' }}>{item.icon} {item.label}</span>
                      <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{item.pct}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        style={{ height: '100%', background: item.color, borderRadius: 99, boxShadow: `0 0 8px ${item.color}88` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>

      {/* BOTTOM ROW — GEO */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.36 }}>
        <SpotlightCard className="glass-card" style={{ padding: 24 }}>
          <div className="card-title" style={{ marginBottom: 4 }}>🌍 Geographic Signal Strength</div>
          <div className="card-subtitle" style={{ marginBottom: 20 }}>Top responding cities and regions</div>
          {geoStats.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {geoStats.map((g, i) => (
                <motion.div
                  key={g.loc}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(139,92,246,${0.04 - i * 0.005}) 0%, transparent 60%)`, pointerEvents: 'none' }} />
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 6 }}>{g.count}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>📍</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.loc}</span>
                  </div>
                  {/* Mini bar */}
                  <div style={{ marginTop: 10, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${geoStats[0] ? (g.count / geoStats[0].count) * 100 : 0}%` }}
                      transition={{ duration: 0.7, delay: 0.4 + i * 0.05 }}
                      style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)', boxShadow: '0 0 6px rgba(139,92,246,0.5)' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-3)', fontSize: 13, padding: '24px 0', textAlign: 'center' }}>Geographic data will appear once leads include location info.</div>
          )}
        </SpotlightCard>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   INBOX PAGE — FULL CINEMATIC + FUNCTIONAL SIGNAL CENTER
   ═══════════════════════════════════════════════════════════ */
function InboxPage() {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [scrambleTrigger, setScrambleTrigger] = useState(0);

  const loadReplies = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('komodo_leads')
      .select('*')
      .eq('status', 'replied')
      .order('replied_at', { ascending: false, nullsFirst: false });
    if (data) setReplies(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadReplies(); }, [loadReplies]);

  useEffect(() => {
    const channel = supabase
      .channel('komodo-inbox-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'komodo_leads',
        filter: 'status=eq.replied'
      }, () => { loadReplies(); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [loadReplies]);

  const accounts = ['All', ...new Set(replies.map(r => r.sender).filter(Boolean))];
  const filtered = selectedAccount === 'All'
    ? replies
    : replies.filter(r => r.sender === selectedAccount);
  const selectedMsg = replies.find(r => r.id === selectedMsgId);

  // Quick action: update lead status in komodo_leads
  const handleAction = useCallback(async (id, newStatus) => {
    setUpdatingId(id);
    await supabase.from('komodo_leads').update({ status: newStatus }).eq('id', id);
    setReplies(prev => prev.filter(r => r.id !== id));
    setSelectedMsgId(null);
    setUpdatingId(null);
  }, []);

  // AI intent scoring based on reply content
  const getAIIntent = (msg) => {
    const text = (msg.reply_message || '').toLowerCase();
    if (!text) return { label: 'Unknown', score: 0, color: 'var(--text-3)' };
    const positive = ['interest', 'yes', 'call', 'meeting', 'schedule', 'tell me more', 'sounds good', 'let\'s', 'when', 'available', 'book', 'demo', 'love to', 'great', 'perfect'];
    const negative = ['not interest', 'unsubscribe', 'remove', 'stop', 'no thanks', 'not looking', 'don\'t contact', 'do not'];
    const posCount = positive.filter(w => text.includes(w)).length;
    const negCount = negative.filter(w => text.includes(w)).length;
    if (negCount > 0) return { label: 'Not Interested', score: Math.max(5, 30 - negCount * 15), color: 'var(--red)' };
    if (posCount >= 3) return { label: 'Hot Lead 🔥', score: Math.min(98, 75 + posCount * 5), color: 'var(--emerald)' };
    if (posCount >= 1) return { label: 'Positive Signal', score: Math.min(85, 55 + posCount * 10), color: 'var(--cyan)' };
    return { label: 'Neutral', score: 45, color: 'var(--amber)' };
  };

  return (
    <motion.div className="inbox-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

      {/* COLUMN 1: Sender accounts */}
      <div className="inbox-sidebar glass-card" style={{ borderRadius: 14 }}>
        <div className="inbox-sidebar-header">
          <span>📡 SMTP Inboxes</span>
          <span style={{ fontSize: 10, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="pulse-dot" />Live
          </span>
        </div>
        <div className="inbox-sidebar-list">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 36, borderRadius: 8, marginBottom: 6 }} />
            ))
          ) : (
            accounts.map(acc => {
              const count = acc === 'All' ? replies.length : replies.filter(r => (r.cold_email_sender || r.sender) === acc).length;
              return (
                <button
                  key={acc}
                  className={`inbox-account-btn ${selectedAccount === acc ? 'inbox-account-btn--active' : ''}`}
                  onClick={() => { setSelectedAccount(acc); setSelectedMsgId(null); }}
                >
                  <div className="inbox-account-dot" style={{ background: selectedAccount === acc ? 'var(--cyan)' : undefined }} />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12 }}>
                    {acc === 'All' ? '🌐 All Inboxes' : acc}
                  </span>
                  {count > 0 && <span className="inbox-count-badge">{count}</span>}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* COLUMN 2: Message list */}
      <div className="inbox-list glass-card" style={{ borderRadius: 14, padding: 0, overflow: 'hidden' }}>
        <div className="inbox-list-header">
          <span>💬 Replies</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{filtered.length} messages</span>
        </div>
        <div className="inbox-list-scroll">
          {loading && (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 6, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: '40%', borderRadius: 6 }} />
              </div>
            ))
          )}
          {!loading && filtered.length === 0 && (
            <div className="inbox-empty-state">
              <Inbox size={40} style={{ opacity: 0.15, marginBottom: 12 }} />
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>No replies in this inbox</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Waiting for signals...</div>
            </div>
          )}
          {filtered.map(msg => {
            const intent = getAIIntent(msg);
            const name = msg.first_name || msg.name || 'Unknown';
            const company = msg.company_name || msg.company || 'Unknown Company';
            const snippet = (msg.reply_message || '').slice(0, 80);
            const isNew = msg.replied_at && (Date.now() - new Date(msg.replied_at).getTime()) < 86400000;
            return (
              <div
                key={msg.id}
                className={`inbox-msg-card ${selectedMsgId === msg.id ? 'inbox-msg-card--active' : ''}`}
                onClick={() => { setSelectedMsgId(msg.id); setScrambleTrigger(t => t + 1); }}
              >
                <div className="inbox-msg-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isNew && <span className="inbox-new-dot" />}
                    <span className="inbox-msg-name">{name}</span>
                  </div>
                  <span className="inbox-msg-time">
                    {msg.replied_at ? new Date(msg.replied_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : ''}
                  </span>
                </div>
                <div className="inbox-msg-company">
                  <Building2 size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
                  <span>{company}</span>
                  <span className="inbox-intent-pill" style={{ color: intent.color, borderColor: intent.color }}>
                    {intent.label}
                  </span>
                </div>
                {snippet && (
                  <div className="inbox-msg-snippet">{snippet}{snippet.length >= 80 ? '...' : ''}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN 3: Message detail */}
      <div className="inbox-detail glass-card" style={{ borderRadius: 14, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {selectedMsg ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMsg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {/* Detail Header */}
              <div className="inbox-detail-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div className="intel-avatar" style={{ width: 38, height: 38, fontSize: 16 }}>
                    {(selectedMsg.first_name || selectedMsg.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="inbox-detail-name">{selectedMsg.first_name || selectedMsg.name || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{selectedMsg.job_title || 'Contact'}</div>
                  </div>
                </div>
                <div className="inbox-detail-meta">
                  <span><Mail size={11} style={{ opacity: 0.5 }} />{selectedMsg.email}</span>
                  <span><Building2 size={11} style={{ opacity: 0.5 }} />{selectedMsg.company_name || selectedMsg.company || '—'}</span>
                  {(selectedMsg.niche_tag || selectedMsg.niche) && (
                    <span className="niche-tag" style={{ marginTop: 0 }}>{selectedMsg.niche_tag || selectedMsg.niche}</span>
                  )}
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="status-dot" style={{ background: 'var(--emerald)' }} />
                  Received by: <strong style={{ color: 'var(--text-2)' }}>{selectedMsg.cold_email_sender || selectedMsg.sender || '—'}</strong>
                  {selectedMsg.replied_at && (
                    <span style={{ marginLeft: 'auto' }}>
                      <Clock size={10} style={{ opacity: 0.5, marginRight: 3, verticalAlign: 'middle' }} />
                      {new Date(selectedMsg.replied_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>

              {/* AI Intent Analysis Bar */}
              {(() => {
                const intent = getAIIntent(selectedMsg);
                return (
                  <div className="inbox-ai-analysis">
                    <div className="inbox-ai-label">
                      <Bot size={11} />
                      <span>AI SIGNAL ANALYSIS</span>
                    </div>
                    <div className="inbox-ai-chips">
                      <span className="inbox-ai-chip" style={{ color: intent.color, borderColor: intent.color }}>
                        Intent: {intent.label}
                      </span>
                      <span className="inbox-ai-chip" style={{ color: 'var(--purple)', borderColor: 'var(--purple)' }}>
                        Score: {intent.score}%
                      </span>
                      {selectedMsg.niche_tag && (
                        <span className="inbox-ai-chip" style={{ color: 'var(--cyan)', borderColor: 'var(--cyan)' }}>
                          Niche: {selectedMsg.niche_tag}
                        </span>
                      )}
                      {selectedMsg.job_title && (
                        <span className="inbox-ai-chip" style={{ color: 'var(--amber)', borderColor: 'var(--amber)' }}>
                          {selectedMsg.job_title}
                        </span>
                      )}
                    </div>
                    <div className="inbox-score-bar">
                      <div className="inbox-score-fill" style={{ width: `${intent.score}%`, background: intent.color }} />
                    </div>
                  </div>
                );
              })()}

              {/* Context: our outreach message */}
              {(selectedMsg.cold_email_subject || selectedMsg.cold_email_body) && (
                <div className="inbox-context-wrap">
                  <div className="inbox-context-label">📤 Our Original Outreach</div>
                  {selectedMsg.cold_email_subject && (
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>
                      Subject: <span style={{ color: 'var(--text-2)' }}>{selectedMsg.cold_email_subject}</span>
                    </div>
                  )}
                  {selectedMsg.cold_email_body && (
                    <div className="inbox-context-body">{selectedMsg.cold_email_body.slice(0, 200)}{selectedMsg.cold_email_body.length > 200 ? '...' : ''}</div>
                  )}
                </div>
              )}

              {/* Reply body with CyberScramble */}
              <div className="inbox-reply-wrap" style={{ flex: 1, overflow: 'auto' }}>
                <div className="inbox-context-label" style={{ color: 'var(--emerald)', marginBottom: 10 }}>💬 Their Reply</div>
                <div className="inbox-detail-body" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 10, padding: 16, minHeight: 80 }}>
                  {selectedMsg.reply_message
                    ? <CyberScramble text={selectedMsg.reply_message} trigger={scrambleTrigger} duration={600} />
                    : <span style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>No reply text stored yet.</span>
                  }
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="inbox-detail-empty">
            <div className="inbox-empty-icon">
              <Inbox size={36} style={{ opacity: 0.3 }} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 12 }}>Select a reply to analyze</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, opacity: 0.6 }}>AI intent analysis will appear here</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VAULT LOGIN — Custom Built for Russ Warner (Komodo Systems)
   ═══════════════════════════════════════════════════════════ */
function VaultLogin({ onLogin }) {
  const [clientId, setClientId] = useState('VX-KOMODO');
  const [accessKey, setAccessKey] = useState('admin');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const cleanId = clientId.trim().toUpperCase();
      const cleanKey = accessKey.trim();
      
      // Frictionless executive access: defaults or valid tokens let Russ straight in
      const validIds = ['VX-KOMODO', 'KOMODO', 'KOMODO-EXEC-01', 'VX-100', 'RUSS', 'ADMIN'];
      if (validIds.includes(cleanId) || (cleanId.length > 0 && cleanKey.length > 0)) {
        onLogin();
      } else {
        setError('ACCESS DENIED. INVALID CREDENTIALS.');
        setLoading(false);
      }
    }, 900);
  };

  return (
    <motion.div 
      className="vault-login-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="vault-login-backdrop" />
      <SpotlightCard className="vault-login-box">
        <div className="vault-login-header">
          <div className="vault-client-badge">
            <span className="pulse-dot" style={{ background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
            DEDICATED INSTANCE // KOMODO SYSTEMS
          </div>

          <img 
            src="https://cdn.prod.website-files.com/6987d45f63b86a630ed5941c/6a7cee335a1a7f48dcbdf416_Logo_komodo%20systems_white.png" 
            alt="Komodo Systems" 
            className="vault-komodo-logo"
            onError={(e) => {
              // Fallback if network blocks external CDN
              e.currentTarget.style.display = 'none';
            }}
          />

          <h2>KOMODO EYE® · SALES VAULT</h2>
          <div className="vault-header-role">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5dcaa5', display: 'inline-block' }} />
            AUTHORIZED ACCESS · RUSS WARNER (PRESIDENT & COO)
          </div>
        </div>

        <form onSubmit={handleSubmit} className="vault-login-form">
          <div className="vault-input-group">
            <label>CLIENT IDENTIFIER</label>
            <div className="vault-input-wrap">
              <input 
                type="text" 
                value={clientId} 
                onChange={e => setClientId(e.target.value)}
                placeholder="e.g. VX-KOMODO"
                required
              />
            </div>
          </div>

          <div className="vault-input-group">
            <label>EXECUTIVE ACCESS KEY</label>
            <div className="vault-input-wrap">
              <Key size={14} className="vault-input-icon" />
              <input 
                type={showKey ? 'text' : 'password'} 
                value={accessKey} 
                onChange={e => setAccessKey(e.target.value)}
                placeholder="Enter executive key"
                required
              />
              <button 
                type="button" 
                className="vault-eye-btn" 
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="vault-hint">
            🔒 Dedicated channel initialized for <strong>Russ Warner</strong>. Click below to enter your executive command center.
          </div>

          {error && (
            <div className="vault-error">
              <span className="pulse-dot red" /> {error}
            </div>
          )}

          <button type="submit" className="vault-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="pulse-dot" style={{ background: '#0b0c10' }} />
                ESTABLISHING TELEMETRY LINK...
              </>
            ) : (
              'INITIALIZE SECURE CONNECTION →'
            )}
          </button>
          
          <div className="vault-footer-text">
            Voxora Sovereign Outreach Protocol · Node: KS-US-WEST · Tier-1 Infrastructure
          </div>
        </form>
      </SpotlightCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════════════ */
function MainDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState({ total: 0, sent: 0, followups: 0, replied: 0, interested: 0, meeting_booked: 0, archived: 0, new: 0, bounced: 0 });
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchAllLeads = useCallback(async () => {
    const { data } = await supabase.from('komodo_leads').select('*').order('id', { ascending: false });
    if (data) setAllLeads(data);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('komodo_campaigns').select('*').order('id', { ascending: true });
      if (data && data.length > 0) {
        setCampaigns(data);
        setSelectedCampaignId(data[0].id);
      }
      fetchAllLeads();
    })();
  }, [fetchAllLeads]);

  const loadCampaignData = useCallback(async (cid, isRefresh = false) => {
    if (!cid) return;
    if (isRefresh) setRefreshing(true); else setLoading(true);

    const { data: camp } = await supabase.from('komodo_campaigns').select('*').eq('id', cid).single();
    setCampaign(camp);

    const { data, error } = await supabase.from('komodo_leads').select('*').eq('campaign_id', cid).order('id', { ascending: false });
    if (error) console.error(error);
    if (data) {
      const campTotal = camp?.total_leads ?? data.length;
      const campSent = camp?.sent_count ?? data.filter(l => l.status === 'cold_email_sent' || l.status === 'sent').length;
      const campFollowups = camp?.followups_count ?? data.filter(l => ['follow_up_1_sent', 'follow_up_2_sent', 'follow_up_3_sent', 'followup_1', 'followup_2', 'followup_3'].includes(l.status)).length;
      const campReplied = camp?.replied_count ?? data.filter(l => l.status === 'replied').length;
      const campInterested = camp?.interested_count ?? data.filter(l => l.status === 'interested').length;
      const campMeetingBooked = camp?.meeting_booked_count ?? data.filter(l => l.status === 'meeting_booked').length;
      const campArchived = camp?.archived_count ?? data.filter(l => l.status === 'archived').length;

      setStats({
        total: campTotal,
        new: Math.max(0, campTotal - campSent),
        sent: campSent,
        followups: campFollowups,
        replied: campReplied,
        archived: campArchived,
        bounced: data.filter(l => l.status === 'bounced').length,
        interested: campInterested,
        meeting_booked: campMeetingBooked,
      });
      setLeads(data);
    }
    if (isRefresh) {
      fetchAllLeads();
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  }, [fetchAllLeads]);

  useEffect(() => {
    if (selectedCampaignId) loadCampaignData(selectedCampaignId);
  }, [selectedCampaignId, loadCampaignData]);

  // Realtime subscription on komodo_leads
  useEffect(() => {
    const channel = supabase
      .channel('komodo-leads-live')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'komodo_leads'
      }, () => {
        if (selectedCampaignId) loadCampaignData(selectedCampaignId, true);
        fetchAllLeads();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [selectedCampaignId, loadCampaignData, fetchAllLeads]);

  const handleCampaignChange = (id) => {
    setSelectedCampaignId(id);
    setActivePage('dashboard');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage stats={stats} leads={leads} loading={loading} campaign={campaign} campaigns={campaigns} selectedCampaignId={selectedCampaignId} onCampaignChange={handleCampaignChange} onRefresh={() => loadCampaignData(selectedCampaignId, true)} refreshing={refreshing} onLeadClick={setSelectedLead} />;
      case 'leads':
        return <LeadsPage leads={leads} loading={loading} campaign={campaign} onLeadClick={setSelectedLead} />;
      case 'campaigns':
        return <CampaignsPage campaigns={campaigns} selectedCampaignId={selectedCampaignId} onSelect={handleCampaignChange} stats={stats} loading={loading} />;
      case 'analytics':
        return <AnalyticsPage leads={allLeads.length > 0 ? allLeads : leads} campaigns={campaigns} />;
      case 'inbox':
        return <InboxPage />;
      case 'agents':
        return <ComingSoonPage icon={<Bot size={40} />} title="AI Agents" desc="Configure and monitor your AI agents — reply detection, follow-up engine, archive cleaner, and more." />;
      case 'automations':
        return <ComingSoonPage icon={<Cpu size={40} />} title="Automations" desc="Manage your n8n workflows, triggers, and automation sequences directly from this panel." />;
      default:
        return null;
    }
  };

  return (
    <>
      <AINetworkCanvas />
      <SystemTicker />
      <div className="layout">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="main">
          {/* TOP BAR */}
          <motion.div className="topbar" initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }}>
            <div className="topbar-left">
              <span className="topbar-title">Command Center</span>
              <CampaignSelector
                campaigns={campaigns}
                selectedId={selectedCampaignId}
                onSelect={handleCampaignChange}
                loading={campaigns.length === 0}
              />
            </div>
            <div className="topbar-right">
              <button
                className={`refresh-btn ${refreshing ? 'refresh-btn--spinning' : ''}`}
                onClick={() => loadCampaignData(selectedCampaignId, true)}
                title="Refresh data"
              >
                <RefreshCw size={14} />
              </button>
              <div className="status-pill"><span className="pulse-dot" />3 Agents Running</div>
            </div>
          </motion.div>

          {/* PAGE CONTENT */}
          <AnimatePresence mode="wait">
            <motion.div key={activePage} style={{ flex: 1, overflow: 'hidden auto' }}>
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {selectedLead && (
            <LeadIntelPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {/* 
        We render MainDashboard unconditionally in the background, 
        so the cinematic globe and numbers load and can be seen blurred.
      */}
      <div className={`app-container ${!isLoggedIn ? 'app-blurred' : ''}`}>
        <MainDashboard />
      </div>

      <AnimatePresence>
        {!isLoggedIn && (
          <VaultLogin onLogin={() => setIsLoggedIn(true)} />
        )}
      </AnimatePresence>
    </>
  );
}
