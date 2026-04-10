export function Crops() {
  const crops = [
    { icon: "🍎", label: "Apple" },
    { icon: "🫐", label: "Blueberry" },
    { icon: "🍒", label: "Cherry" },
    { icon: "🌽", label: "Corn (Maize)" },
    { icon: "🍇", label: "Grape" },
    { icon: "🍊", label: "Orange" },
    { icon: "🍑", label: "Peach" },
    { icon: "🫑", label: "Pepper" },
    { icon: "🥔", label: "Potato" },
    { icon: "🍓", label: "Raspberry" },
    { icon: "🌱", label: "Soybean" },
    { icon: "🎃", label: "Squash" },
    { icon: "🍓", label: "Strawberry" },
    { icon: "🍅", label: "Tomato" },
  ];

  return (
    <div className="bg-[var(--card)] py-16 px-8 border-y border-[var(--border)]">
      <div className="text-center mb-9">
        <div className="text-[12px] font-semibold text-[var(--leaf)] uppercase tracking-wider mb-2.5">
          Supported Crops
        </div>
        <h2 className="font-[var(--font-serif)] text-[clamp(28px,4vw,40px)] font-bold text-[var(--ink)] tracking-tight mb-3">
          Covers Major Food Crops
        </h2>
        <p className="text-[var(--ink2)] text-[16px] font-light max-w-[460px] mx-auto leading-relaxed">
          Detecting diseases across the crops that matter most to smallholder
          and commercial farmers.
        </p>
      </div>

      <div className="flex justify-center gap-5 flex-wrap max-w-[900px] mx-auto">
        {crops.map((crop, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 bg-[var(--bg)] border-[1.5px] border-[var(--border)] rounded-full px-5 py-2.5 text-[14px] font-medium text-[var(--ink)] transition-all duration-200 cursor-pointer hover:bg-[var(--leaf-light)] hover:border-[var(--leaf)] hover:text-[var(--leaf)]"
          >
            <span className="text-[22px] leading-none">{crop.icon}</span>
            {crop.label}
          </div>
        ))}
      </div>
    </div>
  );
}
