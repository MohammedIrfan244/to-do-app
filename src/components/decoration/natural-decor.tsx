"use client";
import React from "react";

function LeafSVG() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
      <path
        fill="oklch(0.65 0.07 140)"
        d="M2 12c4-5 10-8 18-9-2 6-6 10-12 14C6 19 3 16 2 12z"
      />
    </svg>
  );
}

export default function NaturalDecor({ leaves = 8 }: { leaves?: number }) {
  const items = Array.from({ length: leaves });

  return (
    <div className="sidebar-decorations" aria-hidden>
      {/* floating leaves */}
      {items.map((_, i) => {
        const left = 5 + Math.random() * 90;
        const top = -20 - Math.random() * 40;
        const size = 8 + Math.random() * 12;

        const duration = 12 + Math.random() * 10;
        const delay = Math.random() * -20;

        return (
          <div
            key={i}
            className="natural-leaf"
            style={{
              left: `${left}%`,
              top: `${top}vh`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity: 0.92,
            }}
          >
            <LeafSVG />
          </div>
        );
      })}
    </div>
  );
}
