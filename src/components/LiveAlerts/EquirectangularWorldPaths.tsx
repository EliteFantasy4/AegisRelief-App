import React from 'react';

/**
 * Mathematically calibrated Equirectangular (Plate Carrée) SVG landmass paths.
 * Coordinate bounds: West = -180, East = 180, North = 90, South = -90.
 * Formula: x = ((lng + 180) / 360) * 1000, y = ((90 - lat) / 180) * 500.
 */
export const EquirectangularWorldPaths: React.FC<{
  showTacticalBorders?: boolean;
}> = React.memo(({ showTacticalBorders = true }) => {
  return (
    <g id="equirectangular-landmasses" className="transition-opacity duration-300">
      {/* North America */}
      <path
        d="M 33 69 L 67 53 L 125 58 L 222 44 L 292 56 L 333 97 L 322 125 L 300 136 L 292 153 L 278 181 L 250 183 L 236 169 L 231 178 L 250 194 L 278 228 L 265 233 L 245 210 L 208 194 L 194 186 L 167 156 L 156 117 L 122 89 L 56 97 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Greenland */}
      <path
        d="M 378 83 L 433 53 L 403 19 L 347 39 L 356 72 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* South America */}
      <path
        d="M 286 228 L 319 222 L 347 236 L 367 253 L 403 272 L 394 292 L 381 314 L 364 328 L 339 347 L 319 375 L 314 403 L 294 383 L 303 342 L 286 283 L 278 256 L 286 239 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Europe & Scandinavia */}
      <path
        d="M 486 150 L 475 147 L 489 117 L 514 106 L 528 94 L 517 78 L 572 53 L 597 61 L 567 86 L 542 100 L 544 144 L 567 144 L 581 136 L 597 125 L 610 135 L 590 155 L 550 160 L 510 155 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* British Isles */}
      <path
        d="M 486 111 L 503 108 L 500 100 L 492 89 L 486 94 L 492 103 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />
      <path
        d="M 472 106 L 483 103 L 478 97 L 472 100 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />

      {/* Africa */}
      <path
        d="M 483 153 L 542 161 L 589 164 L 606 189 L 619 217 L 642 222 L 611 261 L 600 300 L 586 333 L 550 344 L 533 311 L 533 272 L 514 239 L 486 236 L 453 208 L 456 189 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Madagascar */}
      <path
        d="M 636 283 L 639 294 L 631 319 L 622 311 L 628 292 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />

      {/* Eurasia & Asia Mainland */}
      <path
        d="M 597 125 L 653 47 L 689 58 L 792 39 L 847 50 L 972 67 L 944 94 L 897 103 L 867 131 L 858 153 L 850 147 L 839 147 L 839 164 L 817 188 L 800 206 L 794 224 L 789 246 L 778 233 L 772 217 L 750 189 L 736 194 L 715 228 L 703 206 L 694 189 L 664 186 L 656 175 L 639 169 L 622 214 L 608 189 L 594 172 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Himalayan Arc Fault Line & Subduction Zone (Tactical Highlight) */}
      <path
        d="M 706 153 Q 720 162 736 172 Q 748 173 761 169"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="opacity-80 drop-shadow-[0_0_4px_rgba(56,189,248,0.5)]"
      />

      {/* Sri Lanka */}
      <circle cx="724" cy="231" r="3.5" fill="#1E293B" stroke="#334155" strokeWidth="0.7" />

      {/* Japan Arc */}
      <path
        d="M 863 161 L 871 157 L 888 151 L 892 142 L 897 131 L 902 135 L 892 147 L 872 163 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />

      {/* Taiwan */}
      <polygon points="834,182 838,183 836,189 832,187" fill="#1E293B" stroke="#334155" strokeWidth="0.7" />

      {/* Philippines Archipelago (Luzon, Visayas/Leyte, Mindanao) */}
      <path
        d="M 834 200 L 839 204 L 836 211 L 831 206 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.7"
      />
      <path
        d="M 845 216 L 850 219 L 846 224 L 842 220 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.7"
      />
      <path
        d="M 843 226 L 851 229 L 848 236 L 841 232 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.7"
      />

      {/* Maritime Southeast Asia (Sumatra, Java, Borneo, Sulawesi) */}
      {/* Sumatra */}
      <path
        d="M 767 236 L 778 245 L 792 264 L 784 267 L 771 251 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />
      {/* Java */}
      <path
        d="M 794 267 L 817 272 L 815 276 L 793 271 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />
      {/* Borneo */}
      <path
        d="M 806 247 L 828 250 L 826 261 L 808 258 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />
      {/* Sulawesi */}
      <path
        d="M 833 247 L 840 252 L 836 264 L 830 258 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />
      {/* New Guinea */}
      <path
        d="M 864 253 L 911 275 L 906 283 L 860 263 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />

      {/* Australia & Tasmania */}
      <path
        d="M 864 283 L 894 281 L 925 325 L 919 344 L 903 356 L 883 347 L 856 339 L 822 339 L 817 311 L 839 300 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <circle cx="908" cy="367" r="3.5" fill="#1E293B" stroke="#334155" strokeWidth="0.7" />

      {/* New Zealand */}
      <path
        d="M 986 356 L 992 362 L 984 366 L 980 358 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.7"
      />
      <path
        d="M 972 372 L 980 376 L 974 386 L 966 380 Z"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.7"
      />

      {/* Antarctica Perimeter Strip (South Pole Region) */}
      <path
        d="M 0 470 L 1000 470 L 1000 500 L 0 500 Z"
        fill="#162032"
        stroke="#1E293B"
        strokeWidth="0.8"
      />

      {/* Regional Highlight Labels */}
      {showTacticalBorders && (
        <g className="text-[8px] font-mono fill-slate-500/70 select-none pointer-events-none">
          <text x="720" y="146">HIMALAYAS / NEPAL</text>
          <text x="210" y="140">NORTH AMERICA</text>
          <text x="320" y="310">SOUTH AMERICA</text>
          <text x="500" y="270">AFRICA</text>
          <text x="510" y="125">EUROPE</text>
          <text x="740" y="110">ASIA</text>
          <text x="850" y="320">AUSTRALIA</text>
        </g>
      )}
    </g>
  );
});
