# TODO: Extend Dark Blue Bubble Theme

## Steps to Complete:

1. **Update Theme Colors**  
   - Edit `src/theme/designSystem.js`: Change `functional.success` from '#10b981' to '#0ea5e9' (primary blue).

2. **Update Dashboard.jsx**  
   - Edit `src/pages/Dashboard.jsx`:  
     - Change recharge bar `fill="#10b981"` to `fill="#0ea5e9"`.  
     - Update recharge trend icon class from `text-emerald-300` to `text-cyan-300`.

3. **Update Users.jsx**  
   - Edit `src/pages/Users.jsx`: Replace emerald status badge classes (`bg-emerald-500/20`, `text-emerald-300`, `border-emerald-400/30`) with cyan equivalents (`bg-cyan-500/20`, `text-cyan-300`, `border-cyan-400/30`).

4. **Update Readings.jsx**  
   - Edit `src/pages/Readings.jsx`: Replace emerald tag badge classes (`bg-emerald-500/20`, `text-emerald-300`, `border-emerald-400/30`) with cyan equivalents.

5. **Update Alerts.jsx**  
   - Edit `src/pages/Alerts.jsx`: Replace emerald success icon classes (`bg-emerald-500/20`, `text-emerald-300`) with cyan equivalents (`bg-cyan-500/20`, `text-cyan-300`).

6. **Build and Test**  
   - Run `npm run build` to verify no errors.  
   - Run `npm run dev` and navigate through pages (Dashboard, Users, Readings, Alerts) to confirm blue theme consistency and bubble background visibility.

7. **Commit and Deploy**  
   - Commit changes: `git add . && git commit -m "Extend dark blue bubble theme: Replace green accents with blue for consistency"`.  
   - Push: `git push origin main` to trigger Netlify redeploy.  
   - Monitor Netlify build and verify deployment.

## Progress:
- [x] Step 1
- [x] Step 2
- [x] Step 3
- [x] Step 4
- [x] Step 5
- [x] Step 6
- [ ] Step 7
