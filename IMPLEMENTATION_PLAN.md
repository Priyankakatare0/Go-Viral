# Go Viral - Virality Analyzer | 72-Hour Implementation Plan

## 📋 Executive Summary

Build an AI-powered content virality analyzer that helps creators optimize their content (videos, images, captions) with:
- **Virality Score:** 0-100 breakdown with component analysis
- **Hook Analysis:** First 3 seconds/frame quality assessment
- **Caption Optimization:** AI suggestions for better engagement
- **Trending Recommendations:** Audio and hashtag suggestions
- **Competitor Comparison:** Compare against trending content

**Stack:** Next.js 14 + React 19 + Tailwind + Supabase (Auth + Postgres)
**Target:** Functional MVP with clean code and production considerations

---

## 🎯 Phase 1: Setup & Foundation (3 hours)

### 1.1 Local Environment Setup (45 min)
**Goals:** Get project running locally with all dependencies

- [ ] Install Node.js and pnpm (verify versions)
- [ ] `pnpm install` in template-webapp/
- [ ] Install Docker and verify it's running
- [ ] `supabase start` - spin up local Postgres + Auth
- [ ] Copy local keys to `.env.local`
- [ ] `supabase db reset` - run migrations
- [ ] `pnpm dev` - verify app runs on localhost:3000
- [ ] Document any setup issues in README

**Deliverable:** App loads without errors, Supabase Auth working

---

### 1.2 Code Structure Review & Setup (1.5 hours)
**Goals:** Understand existing structure and add missing pieces

**Review existing:**
- [ ] Auth flow (Supabase client/server setup in `lib/supabase/`)
- [ ] Auth context (`contexts/auth-context.tsx`)
- [ ] Subscription context (`contexts/subscription-context.tsx`)
- [ ] Existing routes and page structure

**Add missing structure:**
- [ ] Create `app/tools/virality-analyzer/` directory
- [ ] Create `app/dashboard/` directory (protected route)
- [ ] Create `components/tools/` for reusable tool components
- [ ] Create `lib/api/` for API utility functions
- [ ] Create `lib/types.ts` for TypeScript interfaces
- [ ] Create `hooks/useVirality.ts` custom hook

**Project structure to add:**
```
app/
  dashboard/
    page.tsx
  tools/
    virality-analyzer/
      page.tsx
components/
  tools/
    virality-analyzer.tsx
    score-breakdown.tsx
    hook-analysis.tsx
    caption-suggestions.tsx
    trending-recommendations.tsx
lib/
  api/
    virality-service.ts
  types.ts
  mocks/
    virality-data.ts
hooks/
  useVirality.ts
```

**Deliverable:** Clean file structure, TypeScript types defined, ready to build

---

### 1.3 Update Supabase Schema (45 min)
**Goals:** Add tables for virality analysis results

**Create migration:**
```sql
-- tables needed:
- virality_analyses (id, user_id, content_type, file_url, score, analysis_data, created_at)
- competitor_data (id, user_id, comparison_content, metrics, created_at)
```

- [ ] Create new migration file
- [ ] Add virality_analyses table
- [ ] Add competitor_data table
- [ ] Add subscription_limits table (if needed)
- [ ] Run `supabase db reset`

**Deliverable:** Database schema updated and ready

---

## 🎨 Phase 2: Core Features & MVP (24 hours)

### 2.1 Homepage & Navigation (2 hours)
**Goals:** Professional landing page and main navigation

**Homepage Components:**
- [ ] Hero section with CTA ("Analyze Your Content")
- [ ] Features overview (grid of 4-6 features)
- [ ] Example gallery (mock data showing virality scores)
- [ ] Navigation header (Home, Tools, Pricing, Auth buttons)
- [ ] Footer with links

**Navigation Component:**
- [ ] Conditional rendering (logged out vs logged in)
- [ ] Link to auth pages
- [ ] Link to dashboard/tools
- [ ] User menu (profile, logout) when authenticated

**Deliverable:** Professional homepage, working navigation, responsive layout

---

### 2.2 Authentication Flow (3 hours)
**Goals:** Complete Supabase Auth integration

**Sign Up Page:**
- [ ] Email + password form with validation
- [ ] Error handling for duplicate emails
- [ ] Success redirect to dashboard
- [ ] Loading states

**Sign In Page:**
- [ ] Email + password form
- [ ] Error handling for wrong credentials
- [ ] "Forgot password" link (mock for now)
- [ ] Redirect to dashboard on success
- [ ] Link to sign up page

**Sign Out:**
- [ ] Button in user menu
- [ ] Clear session and redirect to home

**Protected Routes:**
- [ ] Middleware that checks auth status
- [ ] Redirect unauthenticated users to sign in
- [ ] Dashboard route protected
- [ ] Tools routes protected

**Session Management:**
- [ ] Auth context persists across page reloads
- [ ] Handle session expiry gracefully
- [ ] Loading state while checking auth

**Deliverable:** Full auth flow working, protected routes enforced

---

### 2.3 Virality Analyzer Tool - Core (5 hours)
**Goals:** Build the main virality analysis interface

**Virality Analyzer Page Layout:**
- [ ] Upload section (video/image - drag & drop + file input)
- [ ] Caption input field
- [ ] Form controls (aspect ratio toggle, etc.)
- [ ] Submit button
- [ ] Results section (hidden until analysis complete)

**Upload Handling:**
- [ ] Accept video formats (mp4, mov, webm) - max 100MB
- [ ] Accept image formats (jpg, png, webp) - max 50MB
- [ ] Drag & drop zone
- [ ] File validation (size, type)
- [ ] Preview of uploaded file
- [ ] Clear button to reset

**Virality Score Breakdown:**
- [ ] Score display (0-100 with color coding: red/orange/yellow/green)
- [ ] Component breakdown:
  - Hook Strength: 0-25 points
  - Pacing & Engagement: 0-25 points
  - Thumbnail/First Frame Quality: 0-25 points
  - Caption Optimization: 0-25 points
- [ ] Each component shows score + brief explanation

**Deliverable:** Upload interface + mock analysis results

---

### 2.4 Analysis Results & Breakdown (4 hours)
**Goals:** Display detailed analysis with actionable insights

**Hook Analysis Component:**
- [ ] Display: "Hook Strength: 18/25"
- [ ] Feedback: "Your first 3 seconds show good visual hook but could benefit from stronger text overlay"
- [ ] Suggestions: 
  - "Add text hook in first 1 second"
  - "Increase visual contrast"
  - "Test with trending sound"

**Caption Optimization:**
- [ ] Current caption display
- [ ] Score: 16/25
- [ ] Issues found:
  - "Missing relevant hashtags"
  - "Emoji usage is below average"
  - "CTA could be stronger"
- [ ] Optimized suggestion:
  ```
  "Your caption here 🎬 #FYP #trending #content 
  👉 Try this version: [suggested caption]"
  ```

**Trending Recommendations:**
- [ ] Top 5 trending audio suggestions
- [ ] Top 10 trending hashtags for category
- [ ] "Your content aligns with X% of trending videos in your niche"

**Competitor Comparison:**
- [ ] Show similar trending content (mock data)
- [ ] Comparison metrics table
- [ ] Suggestions based on competitors

**Deliverable:** Detailed results display with mock data

---

### 2.5 Subscription Tiers & Gating (4 hours)
**Goals:** Implement Free vs Pro tier system

**Pricing Page:**
- [ ] Free tier card
  - 3 analyses per day
  - Basic hook analysis
  - No competitor comparison
- [ ] Pro tier card
  - Unlimited analyses
  - Advanced hook + pacing analysis
  - Competitor comparison
  - Export results
- [ ] "Upgrade" buttons
- [ ] Features comparison table

**Subscription Flow:**
- [ ] Upgrade button on pricing page
- [ ] Fake checkout UI (don't need real Stripe)
- [ ] On success: Update `subscription_tier` in Supabase
- [ ] Redirect to dashboard
- [ ] Show success message

**Feature Gating:**
- [ ] Free tier: Show "Upgrade to unlock" for Pro features
- [ ] Pro tier: Show all features
- [ ] Track daily usage for free tier
- [ ] Implement usage counter

**Deliverable:** Pricing page, fake checkout, feature gating working

---

### 2.6 Dashboard & History (3 hours)
**Goals:** Show user their analysis history

**Dashboard Page:**
- [ ] List of recent analyses (latest 10)
- [ ] Table with columns:
  - Date
  - Content type
  - Virality score
  - Actions (view, delete, export)
- [ ] Empty state when no analyses
- [ ] Loading skeleton

**View Analysis:**
- [ ] Click to view previous analysis details
- [ ] Same results layout as new analysis
- [ ] Option to re-analyze

**Delete Analysis:**
- [ ] Delete button with confirmation
- [ ] Remove from database and UI

**Deliverable:** Dashboard showing user's history

---

### 2.7 State Management & Hooks (3 hours)
**Goals:** Clean state handling throughout app

**Create useVirality Hook:**
- [ ] Handle upload state (loading, error, success)
- [ ] Handle analysis state (fetching results)
- [ ] Handle form inputs (caption, file, etc.)
- [ ] Error handling with user-friendly messages
- [ ] Reset/clear state

**Update Auth Context:**
- [ ] Include subscription_tier
- [ ] Include daily_usage_count
- [ ] Include usage_limit

**API Utility Functions:**
- [ ] `analyzeContent()` - mock API call (2-3 second delay)
- [ ] `getTrendingData()` - mock trending data
- [ ] `getCompetitorData()` - mock competitor data

**Deliverable:** Reusable hooks and utility functions

---

## 🎨 Phase 3: UI/UX Polish & Refinement (18 hours)

### 3.1 Styling & Design System (4 hours)
**Goals:** Professional, cohesive visual design

- [ ] Update Tailwind config with color scheme
- [ ] Create reusable component library in `components/ui/`
- [ ] Dark mode support
- [ ] Loading spinners and skeletons
- [ ] Toast notifications for feedback
- [ ] Modal dialogs for confirmations
- [ ] Error states with helpful messages

**Color Scheme:**
- Primary: Vibrant (teal/purple)
- Success: Green
- Warning: Orange
- Error: Red
- Neutral: Gray scale

**Deliverable:** Consistent, professional styling throughout app

---

### 3.2 Responsive Design (3 hours)
**Goals:** Works on desktop, tablet, mobile

- [ ] Update layout components for mobile
- [ ] Stack forms vertically on small screens
- [ ] Adjust typography for readability
- [ ] Test breakpoints (mobile/tablet/desktop)
- [ ] Ensure touch-friendly buttons on mobile
- [ ] Responsive navigation (hamburger menu on mobile)

**Deliverable:** Fully responsive design

---

### 3.3 Loading States & Skeleton Screens (3 hours)
**Goals:** Clear UX during async operations

- [ ] Skeleton loader for upload before preview
- [ ] Skeleton loader for analysis results
- [ ] Loading spinner during API calls
- [ ] Disabled buttons while loading
- [ ] Estimated time for analysis
- [ ] Progress indicator

**Deliverable:** Clear loading feedback throughout

---

### 3.4 Error Handling & Edge Cases (4 hours)
**Goals:** Graceful failures and edge case handling

**Error Scenarios:**
- [ ] File upload fails (show error message, retry option)
- [ ] API fails (show error, retry button)
- [ ] Auth fails (redirect to login)
- [ ] Network timeout (show error message)
- [ ] Invalid file type (show clear error)
- [ ] File too large (show size limit message)

**Edge Cases:**
- [ ] Empty caption (handle gracefully)
- [ ] Rapid re-submissions (debounce)
- [ ] Session expires during upload (handle gracefully)
- [ ] User deletes account while session active
- [ ] Database connection error
- [ ] Invalid data from API

**User Feedback:**
- [ ] Toast notifications for errors
- [ ] Error messages below form fields
- [ ] Loading states prevent double-clicks
- [ ] Clear "retry" options

**Deliverable:** Robust error handling throughout

---

### 3.5 Performance Optimization (2 hours)
**Goals:** Fast, smooth user experience

- [ ] Code splitting for routes
- [ ] Image optimization
- [ ] Remove unused dependencies
- [ ] Optimize re-renders (React.memo where needed)
- [ ] Lazy load components
- [ ] Cache API responses where appropriate

**Deliverable:** Performant app

---

### 3.6 Accessibility & UX Details (2 hours)
**Goals:** Accessible to all users

- [ ] Proper heading hierarchy (h1, h2, etc.)
- [ ] Alt text on images
- [ ] Color contrast meeting WCAG standards
- [ ] Keyboard navigation support
- [ ] Focus indicators on interactive elements
- [ ] Form labels properly associated
- [ ] Clear button text (not just icons)

**Deliverable:** Accessible, inclusive UX

---

## ⚙️ Phase 4: Production Readiness (12 hours)

### 4.1 Environment Configuration (1 hour)
**Goals:** Secure, maintainable environment setup

- [ ] Create `.env.example` with all required variables
- [ ] Add `.env.local` to `.gitignore`
- [ ] Environment-specific configuration
- [ ] No secrets in code
- [ ] Validate environment on startup

**Deliverable:** Proper environment management

---

### 4.2 Error Boundaries & Logging (2 hours)
**Goals:** Catch and handle errors gracefully

- [ ] Error boundary component
- [ ] Global error handler
- [ ] Meaningful error messages
- [ ] Log errors for debugging (not in production logs)
- [ ] Handle 404s properly
- [ ] Handle 500s with fallback UI

**Deliverable:** Robust error handling

---

### 4.3 Testing & QA (4 hours)
**Goals:** Verify everything works as intended

**Manual Testing:**
- [ ] Auth flow: sign up, sign in, sign out
- [ ] File upload: valid files, invalid files, edge cases
- [ ] Analysis: correct score calculation, results display
- [ ] Subscription: free to pro flow, feature gating
- [ ] Mobile: responsive design, touch interaction
- [ ] Error scenarios: network failure, auth failure, etc.
- [ ] Browser compatibility: Chrome, Firefox, Safari, Edge

**Test Cases Checklist:**
- [ ] New user signup flow end-to-end
- [ ] Existing user login
- [ ] Upload video and image
- [ ] Trigger analysis and get results
- [ ] Verify score calculation is correct
- [ ] Upgrade to pro and unlock features
- [ ] Try features as free user (should show upgrade message)
- [ ] Delete analysis from history
- [ ] Logout and verify session cleared
- [ ] Return to app, should be logged out

**Deliverable:** All features verified working

---

### 4.4 Code Review & Cleanup (3 hours)
**Goals:** Production-quality code

**Code Quality:**
- [ ] Remove all `console.log()` statements
- [ ] Remove commented-out code
- [ ] Remove dead code
- [ ] Consistent naming conventions
- [ ] Proper TypeScript types (no `any`)
- [ ] Comments only for complex logic
- [ ] Proper error messages (not generic)

**Components:**
- [ ] Prop types defined
- [ ] Proper component composition
- [ ] No prop drilling (use context)
- [ ] Reusable components
- [ ] Proper key props on lists

**Performance:**
- [ ] No unnecessary re-renders
- [ ] No memory leaks
- [ ] Proper cleanup in useEffect
- [ ] Debounced/throttled events where needed

**Deliverable:** Production-ready code

---

### 4.5 Documentation (2 hours)
**Goals:** Clear documentation for future maintenance

**README Updates:**
- [ ] Project overview and purpose
- [ ] Setup instructions (Supabase, dev environment)
- [ ] How to run locally
- [ ] Architecture overview
- [ ] Key design decisions
- [ ] Known issues and limitations
- [ ] "What I'd improve with more time" section
- [ ] Loom video walkthrough link

**Code Comments:**
- [ ] Complex logic explained
- [ ] API integrations documented
- [ ] Environment variables documented
- [ ] Component prop documentation

**Deliverable:** Clear documentation

---

## ✅ Phase 5: Testing & Walkthrough (15 hours)

### 5.1 Pre-Submission Testing (5 hours)
**Goals:** Ensure everything works for submission

- [ ] Fresh clone of repo
- [ ] Run `pnpm install`
- [ ] Run `supabase start`
- [ ] Run `pnpm db reset`
- [ ] Run `pnpm dev`
- [ ] Test every feature end-to-end
- [ ] No errors in console
- [ ] All loading states working
- [ ] All error states tested

**Deliverable:** Confidence that submission will work

---

### 5.2 Loom Video Recording (5 hours)
**Goals:** Clear 5-minute walkthrough

**Script (5 minutes max):**
1. **Intro (30 sec):** "This is Go Viral, an AI-powered virality analyzer for content creators"
2. **Homepage (30 sec):** Show hero, features, example gallery
3. **Sign Up Flow (1 min):** Create account, show success
4. **Virality Analyzer Tool (2 min):**
   - Upload a sample video/image
   - Show analysis results
   - Highlight: hook analysis, caption suggestions, trending recommendations
   - Show virality score breakdown
5. **Subscription Flow (45 sec):**
   - Show free vs pro differences
   - Click upgrade
   - Show fake checkout
   - Verify pro features unlocked
6. **Code Walkthrough (30 sec):**
   - One piece of code I'm proud of (e.g., custom hook for analysis)
   - Explain design decision
7. **What I'd Do Differently (30 sec):**
   - One thing I'd change if starting over
   - Lessons learned

**Recording Tips:**
- Clear audio
- Zoom in on text if needed
- Highlight important features
- Smooth mouse movements
- Talk through each action

**Deliverable:** Loom link in README

---

### 5.3 GitHub Submission (3 hours)
**Goals:** Clean repo ready for review

- [ ] Fork starter repo (if not already done)
- [ ] All code committed with clear messages
- [ ] No debug files or node_modules
- [ ] `.env.local` in `.gitignore`
- [ ] Updated README with all sections
- [ ] Loom link in README
- [ ] Clean commit history (meaningful messages)
- [ ] All features merged to main branch
- [ ] No broken links in README

**Deliverable:** Production-ready repo

---

### 5.4 Final Review (2 hours)
**Goals:** Last-minute checks before submission

**Checklist:**
- [ ] Does the app load without errors?
- [ ] Can I sign up and login?
- [ ] Can I upload content?
- [ ] Do I get results?
- [ ] Can I upgrade to pro?
- [ ] Do pro features work?
- [ ] Is the UI clean and professional?
- [ ] Are error messages helpful?
- [ ] Is the code clean?
- [ ] Is the README complete?
- [ ] Is the Loom video clear and comprehensive?

**Deliverable:** Submission ready!

---

## 📊 Progress Tracking

### Time Allocation Summary
| Phase | Duration | Tasks | Status |
|-------|----------|-------|--------|
| 1: Setup | 3h | Environment, structure, DB schema | ⏳ Not Started |
| 2: Core | 24h | Auth, virality tool, subscription | ⏳ Not Started |
| 3: Polish | 18h | Styling, responsive, errors | ⏳ Not Started |
| 4: Production | 12h | Env, logging, testing, cleanup | ⏳ Not Started |
| 5: Walkthrough | 15h | Testing, video, submission | ⏳ Not Started |
| **TOTAL** | **72h** | - | **Ready to Start** |

---

## 🎯 Success Criteria

✅ **Must Have (MVP):**
- App runs locally without errors
- Sign up/login/logout working
- Upload content and get virality score
- Free vs Pro tiers with feature gating
- Professional UI
- Deployed to Vercel (or similar)

✅ **Nice to Have:**
- Detailed hook analysis
- Caption optimization suggestions
- Trending recommendations
- Competitor comparison
- Analysis history/dashboard
- Dark mode

✅ **Production Quality:**
- No console errors/warnings
- Proper error handling
- Loading states clear
- Mobile responsive
- Code is clean and maintainable
- README is comprehensive
- Loom walkthrough is clear

---

## 🚀 Ready to Build!

This plan breaks down the 72-hour project into manageable phases. We'll start with Phase 1 (Setup & Foundation) and move through each systematically.

**Next Step:** Execute Phase 1.1 to get the local environment running.

