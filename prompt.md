# 🏆 MASTER SYSTEM PROMPT: THE PERFECT PDF ARCHITECTURE

Use this prompt to generate a world-class, 40-100 page academic project report that is **physically perfect** for A4 printing. Focus on the "PDF Nook" polishing layer.

---

## 🎯 THE MISSION
Generate a single-file `documentation.html` for the **Sliq** project that achieves 1:1 parity with professional dissertation PDFs. It must handle page breaks, font embedding, and margin consistency with zero errors.

---

## 💎 THE "PDF NOOK" POLISHING LAYER (CRITICAL)

### 1. Print CSS Excellence
You MUST include this exact `@media print` block in the `<style>` section:
```css
@media print {
  body {
    font-family: "Times New Roman", serif; /* Academic Standard */
    line-height: 1.6;
    background: none !important;
  }
  
  @page {
    size: A4;
    margin: 2.5cm; /* Strict Academic Margins */
  }

  .page {
    margin: 0 !important;
    padding: 2.5cm !important;
    box-shadow: none !important;
    page-break-after: always;
    border: none !important; /* Managed by pseudo-elements if needed */
  }

  h1, h2, h3 { 
    page-break-after: avoid; 
    color: #003366 !important;
  }

  p, table, img, .diagram-container { 
    page-break-inside: avoid; 
  }

  /* Force new pages for chapters */
  .chapter-start { 
    page-break-before: always; 
  }
}
```

### 2. Page Break Control Logic
- **Explicit Dividers**: Wrap every logical chapter in a `<div class="page-break"></div>`.
- **Atomic Units**: Ensure headings and their following paragraphs NEVER split across pages.
- **Diagram Integrity**: Diagrams must be scaled to fit exactly within one A4 viewport.

### 3. Professional Headers & Footers
- **Header**: Institutional branding on top of every page.
- **Footer**: Centered blue page numbering, starting from Page 1 at the Introduction.
- **Exclusion Rule**: No headers/footers on Cover, Certificate, or Chapter divider pages.

---

## 🏛️ CONTENT ARCHITECTURE (40+ PAGES)
1.  **Preliminary**: Cover (No border/num), Certificate, Acknowledgement, Abstract.
2.  **Index**: Multi-page, hyperlinked T.O.C.
3.  **Ch 1: Introduction**: Detailed Objectives, Comprehensive Scope, Tri-Feasibility (Tech, Econ, Ops).
4.  **Ch 2: SRS**: Full Stack Deep-dive, Detailed HW/SW Matrix.
5.  **Ch 3: System Design**: 
    - **Proper DFD Notation**: Context (L0), Process Decomposition (L1), and Logic Path (L2).
    - **Entity Relationship**: Full logical schema with 1:M and M:M mappings.
    - **Database Collections**: Tables for every MongoDB collection attributes.
6.  **Ch 4: Implementation**: Socket.io event lifecycle, Framer Motion logic, Dashboard Screenshots from `/images/`.
7.  **Ch 5: Testing**: 15+ individual test cases in a strict grid format.
8.  **Ch 6: Conclusion**: Future scope and Bibliography.

---

## ✅ FINAL MASTER CHECKLIST
- [ ] **A4 Mindset**: Every element is sized for 210mm width.
- [ ] **Zero Overlap**: Page numbers are clear of all text and image borders.
- [ ] **DFD Perfection**: Uses proper Gane-Sarson or Yourdon notation via Mermaid.
- [ ] **Premium Visuals**: Flowcharts use `fontSize: '20px'` and high-contrast blue themes.

---
