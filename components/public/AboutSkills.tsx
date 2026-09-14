import React from "react";
import { Code2, Compass, Layers, Sparkles } from "lucide-react";
import { Profile } from "@/lib/db";

export default function AboutSkills({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-botanical-600 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Philosophy & Background</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
            Craftsmanship behind the code
          </h2>
        </div>

        {/* 2-Column Editorial Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Bio Narrative */}
          <div className="lg:col-span-6 space-y-5 text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
            <p>
              I approach software engineering not merely as translating requirements into syntax, but as a deliberate discipline of craftsmanship. Over the past several years, I have worked across the full product spectrum—from architectural system design to pixel-perfect micro-interactions.
            </p>
            <p>
              My design and engineering philosophy is grounded in simplicity: eliminate unnecessary dependencies, keep interfaces intuitive and accessible, and optimize for long-term maintainability. I thrive in the intersection where technical performance meets joyful aesthetics.
            </p>
            
            {/* Quote callout */}
            <div className="pt-4 border-l-2 border-sun-500 pl-4 my-6">
              <p className="font-serif italic text-lg sm:text-xl text-ink">
                &ldquo;Good software feels light, quiet, and effortlessly respectful of the user&rsquo;s time.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: Skills Matrix */}
          <div className="lg:col-span-6 bg-canvas-card border border-canvas-border rounded-2xl p-6 sm:p-8 shadow-sunlit space-y-6">
            
            {/* Frontend Skills */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink mb-3">
                <Code2 className="w-4 h-4 text-sun-500" />
                <span>Frontend Architecture</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.frontend.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-sun-50 text-amber-900 border border-sun-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div className="pt-4 border-t border-canvas-border">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink mb-3">
                <Layers className="w-4 h-4 text-botanical-500" />
                <span>Backend & Distributed Systems</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.backend.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-botanical-50 text-emerald-900 border border-botanical-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & Design */}
            <div className="pt-4 border-t border-canvas-border">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink mb-3">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Tooling, Cloud & Design</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.tools_design.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-sky-50 text-sky-900 border border-sky-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
