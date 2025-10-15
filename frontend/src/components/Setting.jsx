import { THEMES } from "../constants/index";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";
import HeroCard from "./HeroCard";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const Setting = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-white">Theme Settings</h2>
              <p className="text-lg text-white/70">Choose a theme for your chat interface</p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`
                    group flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 border-2
                    ${theme === t 
                      ? "bg-white/20 border-white/40 scale-105" 
                      : "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 hover:scale-102"
                    }
                  `}
                  onClick={() => setTheme(t)}
                >
                  <div className="relative h-12 w-full rounded-lg overflow-hidden" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-1 p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}
            </div>

            {/* Preview Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">Preview</h3>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <HeroCard/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Setting;