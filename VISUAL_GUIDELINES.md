# 🎨 Crella Lens Visual Guidelines
## Component Specification & Design System

*Based on professional component specifications for pixel-perfect implementation*

---

## 🎯 **pAIt SCORING SYSTEM - OFFICIAL GUIDELINES**

### **Usage Guidelines & Transparency Statement**

The **pAIt™ score** is a multi-dimensional intelligence assessment powered by a coalition of leading public-facing LLMs, including **OpenAI**, **Anthropic**, and locally trained models within the **AiiQ ecosystem**.

**Each analysis reflects a consensus-driven interpretation based on:**
- Content type and presentation
- Technical feasibility and risk profiles  
- Public visibility, social traction, and source credibility
- Metadata, compression, and authorship signals

**⚠️ Important Legal Notes:**
- This is **not** financial, legal, or investment advice
- The scoring is dynamic and may evolve as models improve
- Ratings do not imply endorsement, accuracy, or guarantees
- pAIt™ is intended to highlight signal over speculation and assist users in making informed visual and strategic evaluations

**🎨 Official Design Requirements:**
- Use **only** circular, glass-style pAIt™ containers over dark backgrounds
- Maintain **red, yellow, green, and grey** color consistency for rating clarity
- Include proper **pAIt™ branding** for recognition and authenticity

---

## 📐 **LAYOUT SPECIFICATIONS**

### **Header & Branding**
- **Top Padding**: `16px` above header elements
- **Background Frame**: `16px` behind header content
- **Logo Position**: Left-aligned with consistent spacing
- **pAIt™ Rating Orb**: Centered prominently in header zone

### **Core Branding Element**
```css
✨ Crella Lens ✨
pAIt Intelligence Core • AiiQ Decoding/Encoding Technology  
Transparency • Proof of Work • Privacy
```

---

## 🪞 **CENTRAL INTELLIGENCE CORE**

### **pAIt Orb Specifications**
- **Position**: Centered in Mirror of Erised frame
- **Size**: `128px x 128px` (w-32 h-32)
- **Asset**: `/pAIt/pAIt_logoGrey.png`
- **Effects**: 
  - **Headline Shadow**: `10px` drop-shadow
  - **Glow Ring**: `647px` maximum glow radius
  - **Micro-drop Shadow**: `3px` base shadow

### **Mirror Activation States**
- **Idle**: Subtle grey glow (`15px` radius)
- **Processing**: Enhanced purple glow (`40px` + `80px` dual shadows)
- **Active**: Animated pulse with orbital rings

---

## 📊 **FLOATING BENTO CARDS**

### **Card Dimensions**
- **Standard Size**: `280px x 280px`
- **Upload Area**: `560px x 280px` (2:1 ratio)
- **Grid Spacing**: `12px` between cards
- **Corner Radius**: `24px` (rounded-3xl)

### **Card Structure**
- **Background**: Gradient blur with 8% opacity base
- **Border**: Color-matched at 40% opacity
- **Padding**: `24px` (p-6)
- **Shadow System**: 
  - Base: `0 20px 40px rgba(0,0,0,0.1)`
  - Accent: `0 8px 16px rgba(color,0.15)`

### **Typography Hierarchy**
- **Main Stat**: `text-3xl font-bold` with gradient text
- **Title**: `text-sm font-semibold`
- **Footer**: `text-xs` with status indicators

---

## 🌈 **COLOR-CODED CONFIDENCE SYSTEM**

### **Confidence Ranges & Colors**
```css
🟢 Green (90-100%): rgb(34, 197, 94)    /* Excellent */
🔵 Blue (80-89%):   rgb(59, 130, 246)   /* Good */
🟡 Yellow (60-79%): rgb(234, 179, 8)    /* Moderate */  
🔴 Red (<60%):      rgb(239, 68, 68)    /* Low */
```

### **Progress Bar Specifications**
- **Height**: `8px` (h-2)
- **Background**: `bg-gray-200/50` (50% opacity)
- **Fill**: Gradient from solid color to 60% opacity
- **Animation**: 1000ms ease transition with staggered delay

---

## 🎯 **CARD COLOR PALETTE**

### **10-Point Analysis Colors**
1. **Blue** (`#3B82F6`) - Content Type
2. **Purple** (`#9333EA`) - Platform Source  
3. **Green** (`#22C55E`) - Authenticity
4. **Orange** (`#F97316`) - Digital Footprint
5. **Teal** (`#14B8A6`) - Claims Detection
6. **Pink** (`#EC4899`) - Engagement Data
7. **Indigo** (`#6366F1`) - Privacy Scan
8. **Cyan** (`#06B6D4`) - Technical Quality
9. **Yellow** (`#EAB308`) - Context Analysis
10. **Red** (`#EF4444`) - Risk Factors

---

## ✨ **ANIMATION SPECIFICATIONS**

### **Mirror Activation Effects**
```css
/* Mirror pulse during processing */
@keyframes mirrorActivation {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.05); filter: brightness(1.3); }
}

/* Shimmer reflection effect */  
@keyframes shimmer {
  0% { transform: translateX(-100%) rotate(-45deg); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(200%) rotate(-45deg); opacity: 0; }
}
```

### **Card Emergence Animation**
```css
@keyframes emergeFromMirror {
  0% { opacity: 0; transform: translateY(50px) scale(0.8); filter: blur(8px); }
  50% { opacity: 0.7; filter: blur(2px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
```

### **Timing Specifications**
- **Card Reveal**: `300ms` interval for initial 3 cards
- **Extended Reveal**: `200ms` interval for remaining 7 cards  
- **Light Trail**: `2s` duration with staggered `0.3s` delays
- **Hover Effects**: `300ms` all transitions

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Background Specifications**
- **Mirror of Erised**: `url('/crella-lens_erised.svg')`
- **Size**: `100vw 100vh` (full viewport coverage)
- **Position**: `bg-center bg-no-repeat bg-fixed`

### **Blur & Translucency**
- **Primary Containers**: `bg-gray-900/20` with `backdrop-blur-md`
- **Card Backgrounds**: `backdrop-blur-xl` with gradient overlays
- **Border Opacity**: `30%` for subtle definition
- **Text Contrast**: Ensure readability over blurred backgrounds

### **Responsive Breakpoints**
- **Mobile**: 1 column grid
- **Small**: 2 column grid (`sm:grid-cols-2`)
- **Large**: 3 column grid (`lg:grid-cols-3`)
- **Extra Large**: 4 column grid (`xl:grid-cols-4`)

---

## 🛡️ **SECURITY & TRUST INDICATORS**

### **Upload Zone Security**
```css
🔒 End-to-End Encrypted (Green pulse indicator)
🛡️ Zero Data Storage (Blue pulse indicator)
```

### **Status Indicators**
- **Active Dot**: `w-2 h-2` with `animate-pulse`
- **Live Status**: Color-matched to card theme
- **Confidence Badge**: Font weight `semibold` with color coding

---

## 📱 **PROGRESSIVE DISCLOSURE**

### **Initial Reveal**: Top 3 Cards
1. **Authenticity** (Green) - Most critical for trust
2. **Content Type** (Blue) - Primary classification  
3. **Risk Factors** (Red) - Important safety info

### **"Reveal More Insights" Button**
- **Style**: Purple-blue gradient with hover effects
- **Label**: "+7 Points" indicator for remaining insights
- **Animation**: `hover:scale-105` with purple glow shadow

---

## 🤖 **CLAIRE'S SUGGESTIONS PANEL**

### **Design Elements**
- **Avatar**: `w-12 h-12` rounded with purple border
- **Background**: Purple-blue gradient at 15% opacity
- **CTA Buttons**: 
  - Primary: `$2.99` pAIt Analysis (Purple gradient)
  - Secondary: `Free` Dataset Comparison (Green gradient)

### **Messaging Framework**
- **Contextual**: References specific image analysis results
- **Educational**: Explains pAIt scoring benefits  
- **Action-Oriented**: Clear next steps with pricing

---

## 🎨 **DESIGN PRINCIPLES**

### **Visual Hierarchy**
1. **Mirror/pAIt Core** - Primary focus point
2. **Top 3 Cards** - Essential insights  
3. **Reveal Button** - Progressive disclosure
4. **Additional Cards** - Extended analysis
5. **Claire's Panel** - Conversion opportunity

### **Accessibility**
- **Color Contrast**: Ensure WCAG AA compliance
- **Focus States**: Visible keyboard navigation
- **Screen Readers**: Proper ARIA labels
- **Motion**: Respect `prefers-reduced-motion`

### **Performance**
- **Staggered Animations**: Prevent overwhelming effects
- **GPU Acceleration**: Use `transform` and `opacity`
- **Blur Optimization**: Limit backdrop-blur usage
- **Image Optimization**: Compressed assets for fast loading

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Component Requirements**
- [ ] pAIt orb with dual shadow system
- [ ] 10-color bento card system  
- [ ] Progressive 3→7 card reveal
- [ ] Color-coded confidence bars
- [ ] Security trust indicators
- [ ] Claire's suggestion panel
- [ ] Mirror activation animations
- [ ] Mobile-responsive grid

### **Quality Standards**
- [ ] Pixel-perfect measurements
- [ ] Smooth 60fps animations  
- [ ] Cross-browser compatibility
- [ ] Accessibility compliance
- [ ] Performance optimization
- [ ] Visual consistency check

---

*This specification ensures pixel-perfect implementation of the Crella Lens visual intelligence platform with professional-grade attention to detail.*

**Version**: 1.0 | **Last Updated**: Market Testing Phase | **Status**: Production Ready ✨
