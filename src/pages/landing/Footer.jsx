import { Twitter, Send, MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-cyan-900 bg-gradient-to-b from-[#020617] via-[#030A1A] to-[#01040C] text-white overflow-hidden">
      {/* Cyan Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-48 bg-cyan-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold tracking-tight">
              MrChalohFx <span className="text-cyan-400">Traders</span>
            </h3>
            <p className="text-cyan-100/70 leading-relaxed">
              Automated trading simplified. Build bots, track performance, and
              grow your portfolio with AI precision.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-cyan-300">Quick Links</h4>
            <ul className="space-y-2 text-cyan-100/70">
              {[
                { label: "About", href: "#features" },
                { label: "Terms of Service", href: "#pricing" },
                { label: "Privacy Policy", href: "#pricing" },
                { label: "Contact", href: "#pricing" },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="hover:text-cyan-400 transition-all duration-300 hover:pl-1"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-cyan-300">
              Connect With Us
            </h4>
            <div className="flex gap-5">
              {[
                {
                  icon: Twitter,
                  href: "https://twitter.com/mrchalohfx",
                  label: "Twitter",
                },
                {
                  icon: Send,
                  href: "https://t.me/mrchalohfx",
                  label: "Telegram",
                },
                {
                  icon: MessageCircle,
                  href: "https://discord.gg/mrchalohfx",
                  label: "Discord",
                },
              ].map(({ icon: Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="relative group w-12 h-12 rounded-full bg-cyan-900/30 border border-cyan-800 flex items-center justify-center transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-400/60 hover:shadow-[0_0_15px_2px_rgba(0,255,255,0.3)]"
                >
                  <Icon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-cyan-800 pt-6 text-center text-cyan-100/60 text-sm tracking-wide space-y-2">
          <p>© {currentYear} MrChalohFx Traders. All rights reserved.</p>
          <p className="text-cyan-400 font-medium">
            Designed by{" "}
            <span className="text-white font-semibold">Master Chief Devs</span>{" "}
            —
            <a
              href="mailto:devs.masterchief@gmail.com"
              className="hover:text-cyan-300 transition-colors"
            >
              {" "}
              devs.masterchief@gmail.com
            </a>{" "}
            | <span className="text-cyan-200">0115014057</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
