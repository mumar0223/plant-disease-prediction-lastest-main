export function Stats() {
  const stats = [
    { num: "87,000+", label: "Training Images" },
    { num: "38", label: "Disease Classes" },
    { num: "14", label: "Crop Types" },
    { num: "95%+", label: "Accuracy" },
  ];

  return (
    <div className="bg-[#3A6B1E] text-white py-5 px-8 flex justify-center gap-8 md:gap-[60px] flex-wrap">
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <span className="font-serif text-[30px] font-bold block leading-none mb-1">
            {stat.num}
          </span>
          <span className="text-[12px] opacity-70 uppercase tracking-[0.5px] font-normal block mt-1">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
