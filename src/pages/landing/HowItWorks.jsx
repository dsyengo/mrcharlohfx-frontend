import { LogIn, Bot, BarChart } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    step: "01",
    title: "Login with Deriv",
    description: "Connect your Deriv account securely in seconds.",
  },
  {
    icon: Bot,
    step: "02",
    title: "Choose or Build Your Bot",
    description: "Select from free bots or create your own custom strategy.",
  },
  {
    icon: BarChart,
    step: "03",
    title: "Track Your Performance",
    description:
      "Monitor results on your personalized dashboard with live analytics.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative py-24 bg-gradient-to-b from-[#000814] via-[#001f3f] to-[#000] text-gray-100 overflow-hidden"
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.05),_transparent_70%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            How It{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_8px_#00ffff80]">
              Works
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Step Icon */}
              <div className="inline-flex w-24 h-24 rounded-full bg-cyan-400/10 items-center justify-center mb-6 group-hover:bg-cyan-400/20 transition-all duration-300 group-hover:scale-110 shadow-inner border border-cyan-400/20">
                <step.icon className="w-10 h-10 text-cyan-400 group-hover:text-cyan-300 transition" />
              </div>

              {/* Step Number */}
              <div className="absolute -top-8 right-10 text-7xl font-extrabold text-cyan-400/10 group-hover:text-cyan-400/20 transition-colors">
                {step.step}
              </div>

              {/* Step Title */}
              <h3 className="text-2xl font-semibold text-white mb-2">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-gray-400 max-w-xs mx-auto leading-relaxed">
                {step.description}
              </p>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-full w-full h-[1px] bg-cyan-400/10 group-hover:bg-cyan-400/30 transition-all"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
