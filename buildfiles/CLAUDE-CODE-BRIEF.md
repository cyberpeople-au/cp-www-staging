# BRIEF FOR CLAUDE CODE - Cyber People Website Mockup

**Project:** Build functional HTML/CSS/JS website mockup for Cyber People  
**Purpose:** Visual prototype to review before professional development  
**Timeline:** Build in stages, starting with homepage

---

## 🎯 PROJECT OVERVIEW

**Company:** Cyber People Pty Ltd  
**Business:** Cybersecurity consulting for Australian professional services (SMBs)  
**Services:** Cyber Security Assessment + SMB1001 Certification consulting  
**Target:** Financial advisory, accounting, legal, aged care, and other professional services firms (10-200 employees)

---

## 📋 WHAT TO BUILD

### Phase 1: Homepage (Start Here)
Build a complete, responsive homepage using the content and specifications provided.

### Phase 2: Additional Pages (After homepage approved)
- Services Overview
- Cyber Security Assessment (detailed)
- SMB1001 Certification (detailed)
- Why SMB1001?
- Contact
- About Us
- 5 Industry Landing Pages
- MSP Partners (passive page)

---

## 🎨 DESIGN SPECIFICATIONS

### Brand Colors:
```css
--primary: #17a2b8;        /* True Turquoise */
--secondary: #1a1a1a;      /* Off-Black */
--background: #fafafa;     /* Paper White */
--neutral: #7a7a7a;        /* Mid Grey */
--white: #ffffff;          /* Pure White for cards */
```

### Typography:
```css
font-family: 'Segoe UI', 'Calibri', 'Arial Rounded MT', sans-serif;

/* Headings */
h1: Segoe UI Bold, 48px desktop / 32px mobile
h2: Segoe UI Bold, 36px desktop / 24px mobile  
h3: Segoe UI Bold, 28px desktop / 20px mobile

/* Body */
p: Segoe UI Regular, 18px desktop / 16px mobile
footer: Segoe UI Regular, 14px
```

### Responsive Breakpoints:
```css
Desktop: 1200px+
Tablet: 768px - 1199px
Mobile: < 768px
```

---

## 📱 RESPONSIVE REQUIREMENTS

### Desktop (1200px+):
- Three-column value proposition
- Two-column service cards
- Five-column industry cards (1 row)
- Full navigation menu

### Tablet (768-1199px):
- Two-column value proposition
- Two-column service cards
- Three-column industry cards (2 rows: 3 + 2)
- Full navigation menu

### Mobile (<768px):
- Single column everything
- Stacked cards
- Hamburger menu
- Full-width CTA buttons
- Touch-friendly (min 44px touch targets)

---

## 🎯 HOMEPAGE STRUCTURE

Use the content from **homepage-copy-v4-FINAL.md** with this structure:

### 1. Navigation Bar (Sticky)
```
Logo [Cyber People] | Services ▼ | Industries ▼ | Why SMB1001? | About | Contact
```
- Sticky on scroll
- True Turquoise on hover
- Dropdown for Services and Industries
- Mobile: Hamburger menu

### 2. Hero Section
- Full-width background (Paper White with subtle pattern or solid)
- Headline: "Strengthen Your Defenses. Reduce Your Risk."
- Subheadline
- Two CTAs side-by-side: 
  - Primary (True Turquoise): "Book Your Assessment"
  - Secondary (Off-Black outline): "Learn About SMB1001"
- Hero image/graphic on right (use placeholder or shield icon)

### 3. Value Proposition Section
- Headline: "Real Protection Through Proven Fundamentals"
- Three cards side-by-side (desktop) / stacked (mobile)
- Each card:
  - Icon placeholder at top
  - Subheadline
  - 2-3 sentences body
  - Card background: White
  - Subtle shadow on hover

### 4. Threat Context Section  
- Background: Light grey (#fafafa)
- Headline: "Australian SMBs Face Persistent Cyber Threats"
- Bullet points with ASD statistics
- Body copy from v4 homepage
- Pull quote style for key stat: "$56,571 average loss"

### 5. Services Overview Section
- Headline: "From Assessment to Implementation"
- Two cards side-by-side (desktop) / stacked (mobile)
- Each card:
  - Icon/graphic placeholder
  - Service name
  - Description
  - "What You Get" bullet list
  - CTA button
  - Card styling with hover effect

### 6. Framework Explanation Section
- Background: White
- Headline: "A Progressive Mastery System"
- Three tiers in visual progression:
  - Bronze (Foundation) - Use bronze/brown accent
  - Silver (Intermediate) - Use silver/grey accent
  - Gold (Advanced) - Use gold/yellow accent
- Each tier: description of areas covered
- Visual progression indicator (arrows or steps)

### 7. Industry Expertise Section
- Background: Paper White
- Headline: "Specialized Expertise for Australian Professional Services"
- Five cards in grid:
  - 5 across on large desktop
  - 3 + 2 on tablet
  - Stacked on mobile
- Each card:
  - Icon placeholder
  - Industry name
  - Brief description
  - "Learn More →" link
  - Hover effect (lift + shadow)

### 8. Conceptual Security Section
- White background
- Headline: "Security Fundamentals That Work"
- List of security concepts with brief descriptions
- Two-column layout on desktop
- Icon for each concept

### 9. Trust Indicators
- 4 badges/icons in row
- Simple icon + text
- Centered
- Equal spacing

### 10. Client Outcomes Section (Optional)
- Background: Light grey
- Grid of outcome cards
- Keep concise

### 11. Final CTA Section
- Background: True Turquoise (#17a2b8)
- White text
- Headline + Subheadline + Body
- Large CTA button (white with turquoise text)
- Contact details below
- Alternative download link

### 12. Footer
- Background: Off-Black (#1a1a1a)
- White text
- Four columns (desktop) / stacked (mobile)
- Navigation links
- Contact info
- Legal links (Privacy, Terms)
- Disclaimer text (smaller, 14px)
- Copyright

---

## 🎨 DESIGN STYLE GUIDANCE

### Overall Feel:
- Clean and professional
- Not too corporate/stuffy
- Modern but not trendy
- Trustworthy and capable
- Whitespace is your friend

### Card Styling:
```css
background: white;
border-radius: 8px;
padding: 32px;
box-shadow: 0 2px 8px rgba(0,0,0,0.08);

/* Hover effect */
transition: transform 0.2s, box-shadow 0.2s;
:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
```

### Button Styling:
```css
/* Primary CTA */
background: #17a2b8;
color: white;
padding: 16px 32px;
border-radius: 6px;
font-weight: 600;
transition: background 0.2s;

:hover {
  background: #138d9f; /* Darker turquoise */
}

/* Secondary CTA */
background: transparent;
border: 2px solid #1a1a1a;
color: #1a1a1a;
padding: 14px 30px; /* Slightly less for border */
border-radius: 6px;
font-weight: 600;

:hover {
  background: #1a1a1a;
  color: white;
}
```

### Spacing:
- Section padding: 80px top/bottom (desktop), 40px (mobile)
- Container max-width: 1200px
- Consistent gaps: 24px between elements
- Card grids: 32px gap

---

## 📄 CONTENT SOURCE

**Use:** homepage-copy-v4-FINAL.md for all homepage content

**Key points:**
- Copy the exact headlines and body text
- Maintain the messaging tone (confident but qualified)
- Keep all legal disclaimers
- Preserve footer disclaimer verbatim

---

## 🎯 ICON/IMAGE PLACEHOLDERS

For the mockup, use:
- **Font Awesome icons** (free) or similar icon library
- **Placeholder images** where hero images would go
- **Simple SVG shapes** for industry icons (can be basic)

### Suggested Icons:
- Value Prop 1: Target/crosshair (fa-bullseye)
- Value Prop 2: Shield with layers (fa-shield-alt)
- Value Prop 3: Certificate/badge (fa-certificate)
- Assessment Service: Magnifying glass (fa-search)
- Certification Service: Shield check (fa-shield-check)
- Financial: Dollar/chart (fa-chart-line)
- Accounting: Calculator (fa-calculator)
- Legal: Gavel (fa-gavel)
- Aged Care: Heart-shield (fa-heart)
- Other Services: Building (fa-building)

---

## 🔧 TECHNICAL REQUIREMENTS

### Build As:
- Single HTML file with embedded CSS and minimal JS
- OR separate HTML/CSS/JS files
- Vanilla JavaScript (no frameworks needed for mockup)
- Mobile-first responsive design
- Fast loading (<2 seconds)

### Must Include:
- Smooth scroll behavior
- Responsive navigation (hamburger on mobile)
- Form placeholder (doesn't need to submit)
- All CTAs linked to appropriate sections or # placeholders
- Hover states on interactive elements
- Basic accessibility (semantic HTML, ARIA labels)

### Optional Nice-to-Haves:
- Subtle animations on scroll (fade-in)
- Smooth section transitions
- Sticky navigation on scroll
- Back-to-top button

---

## ✅ SUCCESS CRITERIA

A good mockup will:
- [ ] Look professional and trustworthy
- [ ] Use brand colors correctly
- [ ] Be fully responsive (test on phone/tablet/desktop)
- [ ] Have all homepage content from v4
- [ ] Show clear visual hierarchy
- [ ] Have clickable CTAs (even if they go to #)
- [ ] Load fast and perform well
- [ ] Match the tone: confident but not aggressive

---

## 🚀 BUILD SEQUENCE

### Step 1: Structure
Build the HTML structure with all sections

### Step 2: Styling  
Apply CSS with brand colors and typography

### Step 3: Responsive
Make it work on mobile/tablet/desktop

### Step 4: Polish
Add hover effects, spacing refinements, icons

### Step 5: Review
Show to stakeholders for feedback

---

## 📋 WHAT NOT TO WORRY ABOUT (Yet)

For the mockup, you DON'T need:
- Real logo (use "CYBER PEOPLE" text with shield icon)
- Professional photography (placeholders fine)
- Contact form backend (just the form UI)
- Analytics integration
- SEO optimization (that's for production)
- Cross-browser testing (modern browsers only for now)

---

## 💬 QUESTIONS TO ASK DURING BUILD

If you need clarification:
- Refer back to homepage-copy-v4-FINAL.md for content
- Refer to brand guidelines for colors/fonts
- Ask about layout preferences for specific sections
- Show work-in-progress for feedback

---

## 🎯 DELIVERABLE

**Final output:**
- Fully functional homepage mockup
- Viewable in browser
- Responsive across devices
- All content populated from v4 homepage copy
- Professional appearance
- Ready to show stakeholders

**Format:**
- HTML/CSS/JS files
- Can be zipped or in GitHub repo
- Include brief README on how to view

---

## 📞 AFTER MOCKUP IS BUILT

Once approved:
1. Use as reference for professional web developer
2. Can build additional pages in same style
3. Can refine based on feedback
4. Serve as proof-of-concept for full site

---

**This mockup validates the design before investing in professional development. Build it iteratively and get feedback at each stage!**

Good luck! 🚀