"use client";
import React from "react";

export default function DarkDecor({ stars = 40 }: { stars?: number }) {
  const items = Array.from({ length: stars });

  return (
    <div className="sidebar-decorations" aria-hidden>
      
      {/* drifting moon */}
      <div className="dark-moon" />

      {/* MANY tiny drifting stars */}
      {items.map((_, i) => {
        const left = Math.random() * 100;
        const top = 6 + Math.random() * 90;  // avoid top edge where moon is
        const delay = Math.random() * -10;   // random negative delays
        const duration = 5 + Math.random() * 6;

        return (
          <div
            key={i}
            className="dark-star"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
