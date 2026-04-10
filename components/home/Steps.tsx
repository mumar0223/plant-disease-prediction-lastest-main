export function Steps() {
  const steps = [
    {
      num: "01",
      title: "Upload a Leaf Photo",
      desc: "Take a clear, well-lit photo of the affected leaf. Our system works with standard smartphone cameras — no lab equipment needed."
    },
    {
      num: "02",
      title: "AI Analyzes Instantly",
      desc: "Our CNN model trained on 35,000+ labeled images scans for visual disease patterns, lesions, discolorations, and structural changes."
    },
    {
      num: "03",
      title: "Get Treatment Advice",
      desc: "Receive a diagnosis with confidence score, severity level, and actionable treatment steps — chemical, organic, and preventative options."
    }
  ];

  return (
    <div className="py-[72px] px-8 max-w-[1100px] mx-auto">
      <div className="text-center mb-12">
        <div className="text-[12px] font-semibold text-[var(--leaf)] uppercase tracking-wider mb-2.5">
          How It Works
        </div>
        <h2 className="font-[var(--font-serif)] text-[clamp(28px,4vw,40px)] font-bold text-[var(--ink)] tracking-tight mb-3">
          Three Steps to Healthy Crops
        </h2>
        <p className="text-[var(--ink2)] text-[16px] font-light max-w-[460px] mx-auto leading-relaxed">
          From photo to diagnosis in seconds — no expertise required.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-8 relative transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
            <div className="w-10 h-10 bg-[var(--leaf-light)] rounded-[10px] flex items-center justify-center font-[var(--font-serif)] text-[18px] font-bold text-[var(--leaf)] mb-5">
              {step.num}
            </div>
            <h3 className="text-[17px] font-semibold text-[var(--ink)] mb-2">
              {step.title}
            </h3>
            <p className="text-[14px] text-[var(--ink2)] leading-relaxed font-light">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
