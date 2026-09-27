# Deployment Update Notes

---

### 27 Sept 2026  
### Failure to deploy after package updates: next -> 16.3.6, tailwindcss -> 4.0.0, postcss -> 9.0.0

### Short version:   
The npm update broke the build on Hostinger due to Tailwind v4's PostCSS plugin split and Turbopack failing in the build environment.  
Fixed by installing @tailwindcss/postcss, updating postcss.config.js, changing Tailwind directives in globals.css, and forcing webpack for the build.

### Root Cause:  
The npm update bumped several major dependencies, most notably Tailwind CSS v3 → v4 and Next.js → v16.3.6. This caused two separate but related problems:  

1. Tailwind v4's PostCSS plugin split (fixed first — needed for dev/build to compile CSS at all)  
   - Tailwind v4 moved its PostCSS integration into a standalone package.  
   - Installed @tailwindcss/postcss (npm install @tailwindcss/postcss)
   - postcss.config.js — changed the plugin reference:  
   
     - // before //  
      plugins: { tailwindcss: {}, autoprefixer: {} }  
     - // after //  
      plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} }  
   - styles/globals.css — replaced the old v3 directives with v4 syntax:  
     - // before //  
      @tailwind base;  
      @tailwind components;  
      @tailwind utilities;  
     - // after //  
      @import "tailwindcss";  
      @config "../tailwind.config.js";  
     
The @config line lets Tailwind v4 keep the existing tailwind.config.js (theme extensions, custom animations, etc.) instead of requiring a full rewrite to CSS-based config.  

This is a temporary fix — the long-term plan is to migrate to the new CSS-based config, but that will require a full review of all Tailwind classes used in the app.  

2. Turbopack failing on Hostinger's build environment (the actual deploy blocker)  
   - Next.js 16 uses Turbopack by default for next build.  
   It compiled fine locally, but failed on Hostinger with node process exited before connection with exit status: 0 — a signature of the build worker being killed, most likely by a memory limit on Hostinger's build container that's stricter than the plan's advertised 4096MB (that limit applies to the overall hosting account, not necessarily to a single build process/cgroup).  
   - package.json — forced the build to use the older, more memory-stable webpack bundler instead of Turbopack:  
   // before //  
   "build": "next build"    
   // after //  
   "build": "next build --webpack"    
   
### Verification  

   - npm run dev — starts cleanly, homepage returns HTTP 200, no PostCSS/Tailwind errors.  
   - npm run build (with --webpack) — completes successfully locally, all 23 routes generated.  
   - Deployed to Hostinger — build now succeeds.  
   - No application/business logic was touched  

All changes were build-tooling configuration to keep pace with the major version upgrades.  
