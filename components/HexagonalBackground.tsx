"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface HexagonalBackgroundProps {
  className?: string;
  opacity?: number;
}

export default function HexagonalBackground({
  className = "",
  opacity = 1,
}: HexagonalBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hexagonsRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!hexagonsRef.current || !particlesRef.current) return;

    const hexagons = hexagonsRef.current.querySelectorAll('.hexagon');
    const lines = hexagonsRef.current.querySelectorAll('.hex-line');
    const nodes = hexagonsRef.current.querySelectorAll('.hex-node');
    const particles = particlesRef.current.querySelectorAll('.particle');

    // Master timeline for entrance
    const masterTL = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Epic entrance: Hexagons burst from center
    masterTL.from(hexagons, {
      scale: 0,
      opacity: 0,
      rotation: 360,
      transformOrigin: "center",
      duration: 1.5,
      stagger: {
        amount: 1.2,
        from: "center",
        grid: "auto",
      },
      ease: "back.out(1.7)",
    });

    // Lines draw in with electric effect
    masterTL.from(lines, {
      strokeDashoffset: 200,
      opacity: 0,
      duration: 1.2,
      stagger: {
        amount: 0.8,
        from: "edges",
      },
      ease: "power2.inOut",
    }, "-=1");

    // Nodes pop in with bounce
    masterTL.from(nodes, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: {
        amount: 0.5,
        from: "random",
      },
      ease: "elastic.out(1, 0.5)",
    }, "-=0.8");

    // Particles fade in
    masterTL.from(particles, {
      opacity: 0,
      scale: 0,
      duration: 0.8,
      stagger: 0.02,
    }, "-=0.5");

    // CONTINUOUS ANIMATIONS

    // 1. Hexagons: Complex floating with rotation
    hexagons.forEach((hex, i) => {
      const angle = (i / hexagons.length) * Math.PI * 2;
      
      gsap.to(hex, {
        y: `${Math.sin(angle) * 20}`,
        x: `${Math.cos(angle) * 15}`,
        rotation: `${Math.sin(i) * 5}`,
        duration: 4 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });

      // Scale pulse
      gsap.to(hex, {
        scale: 1.05,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random(),
      });
    });

    // 2. Lines: Flowing energy effect
    lines.forEach((line) => {
      gsap.to(line, {
        strokeDashoffset: -200,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        ease: "none",
      });

      // Opacity pulse
      gsap.to(line, {
        strokeOpacity: 0.8,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // 3. Nodes: Multi-layered pulsing with color shift
    nodes.forEach((node) => {
      // Scale pulse
      gsap.to(node, {
        scale: 1.5,
        duration: 1.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });

      // Glow intensity
      gsap.to(node, {
        attr: { r: 8 },
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random(),
      });
    });

    // 4. Particles: Floating and fading
    particles.forEach((particle) => {
      const startY = parseFloat(particle.getAttribute('cy') || '540');
      
      gsap.to(particle, {
        attr: { cy: startY - 100 },
        opacity: 0,
        duration: 8 + Math.random() * 4,
        repeat: -1,
        ease: "none",
        onRepeat: function() {
          gsap.set(particle, { attr: { cy: 1080 }, opacity: 0.3 });
        }
      });

      const startX = parseFloat(particle.getAttribute('cx') || '960');
      gsap.to(particle, {
        attr: { cx: startX + (Math.random() * 40 - 20) },
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // 5. Global rotation with perspective
    gsap.to(hexagonsRef.current, {
      rotation: 3,
      duration: 30,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 6. Breathing effect for entire svg
    gsap.to(hexagonsRef.current, {
      scale: 1.02,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "center center",
    });

    // 7. Advanced mouse parallax with magnetic effect
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let rafId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const animateParallax = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      if (hexagonsRef.current) {
        gsap.to(hexagonsRef.current, {
          x: currentX * 50,
          y: currentY * 50,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      // Individual hexagon magnetic effect
      hexagons.forEach((hex, i) => {
        const strength = (i % 3 + 1) * 0.3;
        gsap.to(hex, {
          x: `+=${currentX * 10 * strength}`,
          y: `+=${currentY * 10 * strength}`,
          duration: 0.8,
          ease: "power2.out",
        });
      });

      rafId = requestAnimationFrame(animateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animateParallax();

    // 8. Random hexagon highlight effect
    let highlightTimeout: NodeJS.Timeout;
    const highlightRandom = () => {
      const randomHex = hexagons[Math.floor(Math.random() * hexagons.length)];
      
      gsap.to(randomHex, {
        strokeWidth: 4,
        strokeOpacity: 1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });

      highlightTimeout = setTimeout(highlightRandom, 2000 + Math.random() * 3000);
    };
    highlightRandom();

    // 9. Connection pulse effect
    let pulseTimeout: NodeJS.Timeout;
    const pulseConnections = () => {
      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      
      gsap.timeline()
        .to(randomLine, {
          strokeWidth: 4,
          strokeOpacity: 1,
          duration: 0.4,
          ease: "power2.out",
        })
        .to(randomLine, {
          strokeWidth: 2,
          strokeOpacity: 0.4,
          duration: 0.6,
          ease: "power2.in",
        });

      pulseTimeout = setTimeout(pulseConnections, 1500 + Math.random() * 2000);
    };
    pulseConnections();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      clearTimeout(highlightTimeout);
      clearTimeout(pulseTimeout);
      masterTL.kill();
      gsap.killTweensOf([hexagons, lines, nodes, particles, hexagonsRef.current]);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ zIndex: 0, opacity }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4">
              <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3">
              <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2">
              <animate attributeName="stop-opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g ref={hexagonsRef} className="hexagons-group">
          {/* Hexagons with varied sizes */}
          {[
            { x: 350, y: 150, size: 90 },
            { x: 550, y: 120, size: 65 },
            { x: 750, y: 200, size: 110 },
            { x: 950, y: 160, size: 75 },
            { x: 1150, y: 140, size: 85 },
            { x: 1350, y: 220, size: 95 },
            { x: 1550, y: 180, size: 70 },
            { x: 400, y: 380, size: 80 },
            { x: 650, y: 420, size: 90 },
            { x: 850, y: 350, size: 70 },
            { x: 1050, y: 400, size: 100 },
            { x: 1250, y: 360, size: 75 },
            { x: 1450, y: 420, size: 85 },
            { x: 500, y: 620, size: 75 },
            { x: 750, y: 680, size: 95 },
            { x: 1000, y: 600, size: 80 },
            { x: 1200, y: 660, size: 90 },
            { x: 1400, y: 620, size: 70 },
            { x: 600, y: 850, size: 85 },
            { x: 900, y: 880, size: 75 },
            { x: 1150, y: 840, size: 80 },
          ].map((hex, i) => (
            <g key={i} className="hexagon" transform={`translate(${hex.x}, ${hex.y})`}>
              <polygon
                points={`
                  0,${-hex.size} 
                  ${hex.size * 0.866},${-hex.size * 0.5} 
                  ${hex.size * 0.866},${hex.size * 0.5} 
                  0,${hex.size} 
                  ${-hex.size * 0.866},${hex.size * 0.5} 
                  ${-hex.size * 0.866},${-hex.size * 0.5}
                `}
                fill="none"
                stroke="url(#hexGradient)"
                strokeWidth="2"
                filter="url(#glow)"
              />
            </g>
          ))}

          {/* Connecting Lines */}
          {[
            { x1: 440, y1: 150, x2: 550, y2: 120 },
            { x1: 615, y1: 120, x2: 750, y2: 200 },
            { x1: 835, y1: 200, x2: 950, y2: 160 },
            { x1: 1025, y1: 160, x2: 1150, y2: 140 },
            { x1: 1235, y1: 140, x2: 1350, y2: 220 },
            { x1: 1445, y1: 220, x2: 1550, y2: 180 },
            { x1: 400, y1: 240, x2: 400, y2: 380 },
            { x1: 480, y1: 380, x2: 650, y2: 420 },
            { x1: 735, y1: 420, x2: 850, y2: 350 },
            { x1: 920, y1: 350, x2: 1050, y2: 400 },
            { x1: 1135, y1: 400, x2: 1250, y2: 360 },
            { x1: 1325, y1: 360, x2: 1450, y2: 420 },
            { x1: 650, y1: 510, x2: 500, y2: 620 },
            { x1: 575, y1: 620, x2: 750, y2: 680 },
            { x1: 845, y1: 680, x2: 1000, y2: 600 },
            { x1: 1080, y1: 600, x2: 1200, y2: 660 },
            { x1: 1290, y1: 660, x2: 1400, y2: 620 },
            { x1: 750, y1: 770, x2: 600, y2: 850 },
            { x1: 685, y1: 850, x2: 900, y2: 880 },
            { x1: 1000, y1: 880, x2: 1150, y2: 840 },
          ].map((line, i) => (
            <line
              key={i}
              className="hex-line"
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#6366f1"
              strokeWidth="2"
              strokeOpacity="0.4"
              strokeDasharray="8,4"
              filter="url(#glow)"
            />
          ))}

          {/* Connection Nodes */}
          {[
            { x: 550, y: 120 },
            { x: 750, y: 200 },
            { x: 950, y: 160 },
            { x: 1150, y: 140 },
            { x: 1350, y: 220 },
            { x: 1550, y: 180 },
            { x: 400, y: 380 },
            { x: 650, y: 420 },
            { x: 850, y: 350 },
            { x: 1050, y: 400 },
            { x: 1250, y: 360 },
            { x: 1450, y: 420 },
            { x: 500, y: 620 },
            { x: 750, y: 680 },
            { x: 1000, y: 600 },
            { x: 1200, y: 660 },
            { x: 1400, y: 620 },
            { x: 600, y: 850 },
            { x: 900, y: 880 },
            { x: 1150, y: 840 },
          ].map((node, i) => (
            <circle
              key={i}
              className="hex-node"
              cx={node.x}
              cy={node.y}
              r="6"
              fill="url(#nodeGradient)"
              filter="url(#strongGlow)"
            />
          ))}
        </g>

        {/* Floating Particles */}
        {/* Floating Particles */}
        <g ref={particlesRef} className="particles-group">
          {Array.from({ length: 50 }).map((_, i) => {
            // Pre-calculate positions outside of JSX attributes
            const cx = (i * 137.5) % 1920; // Pseudo-random distribution
            const cy = (i * 197.3) % 1080;
            const r = (i % 3) + 1;
            
            return (
              <circle
                key={i}
                className="particle"
                cx={cx}
                cy={cy}
                r={r}
                fill="#8b5cf6"
                opacity="0.3"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}