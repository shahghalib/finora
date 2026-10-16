// Crisp vector mockup of the Finora dashboard, used in place of a raster
// screenshot on the landing page hero (screenshots compress/blur at small
// sizes — an SVG stays sharp at any resolution).
export function DashboardMockup() {
  return (
    <svg
      viewBox="0 0 480 300"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* window chrome */}
      <rect x="0" y="0" width="480" height="300" rx="10" fill="var(--card)" />
      <rect
        x="0"
        y="0"
        width="480"
        height="34"
        rx="10"
        fill="var(--secondary)"
      />
      <rect x="0" y="24" width="480" height="10" fill="var(--secondary)" />
      <circle cx="18" cy="17" r="4" fill="var(--destructive)" opacity="0.6" />
      <circle cx="32" cy="17" r="4" fill="var(--muted-foreground)" opacity="0.4" />
      <circle cx="46" cy="17" r="4" fill="var(--muted-foreground)" opacity="0.4" />
      <text
        x="240"
        y="21"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="var(--primary)"
      >
        FINORA
      </text>

      {/* sidebar */}
      <rect x="0" y="34" width="88" height="266" fill="var(--sidebar)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x="16"
          y={58 + i * 36}
          width={i === 0 ? 56 : 40}
          height="8"
          rx="4"
          fill={i === 0 ? "var(--primary)" : "var(--muted-foreground)"}
          opacity={i === 0 ? 1 : 0.35}
        />
      ))}

      {/* headline metric */}
      <rect x="112" y="56" width="150" height="12" rx="4" fill="var(--foreground)" opacity="0.85" />
      <rect x="112" y="76" width="90" height="22" rx="4" fill="var(--primary)" opacity="0.9" />

      {/* bar chart card */}
      <rect
        x="112"
        y="112"
        width="168"
        height="150"
        rx="8"
        fill="var(--secondary)"
      />
      {[36, 58, 44, 70, 52, 80, 64].map((h, i) => (
        <rect
          key={i}
          x={128 + i * 20}
          y={252 - h}
          width="12"
          rx="3"
          height={h}
          fill="var(--primary)"
          opacity={0.55 + i * 0.06}
        />
      ))}

      {/* line chart card */}
      <rect
        x="296"
        y="56"
        width="168"
        height="94"
        rx="8"
        fill="var(--secondary)"
      />
      <polyline
        points="308,120 332,108 356,128 380,96 404,110 428,84 452,100"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* stat chips */}
      <rect x="296" y="164" width="80" height="98" rx="8" fill="var(--secondary)" />
      <rect x="310" y="178" width="52" height="8" rx="4" fill="var(--muted-foreground)" opacity="0.5" />
      <rect x="310" y="196" width="36" height="14" rx="4" fill="var(--primary)" />

      <rect x="384" y="164" width="80" height="98" rx="8" fill="var(--secondary)" />
      <rect x="398" y="178" width="52" height="8" rx="4" fill="var(--muted-foreground)" opacity="0.5" />
      <rect x="398" y="196" width="36" height="14" rx="4" fill="var(--primary)" />
    </svg>
  );
}