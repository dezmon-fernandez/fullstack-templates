---
description: Create a Product Requirements Document for this React 19 SPA + Supabase project
argument-hint: [output-path]
---

# Create PRD: Generate Product Requirements Document

## Overview

Generate a comprehensive Product Requirements Document (PRD) based on the current conversation context and requirements discussed. Use the structure and sections defined below to create a thorough, professional PRD.

## Output File

Write the PRD to: `$ARGUMENTS` (default: `.agents/PRD.md`)

If the user does not supply a path, always write to `.agents/PRD.md` so the PRD lives inside the self-contained AI workspace alongside plans and reference material.

## PRD Structure

Create a well-structured PRD with the following sections. Adapt depth and detail based on available information.

### Required Sections

**1. Executive Summary**
- Concise product overview (2-3 paragraphs)
- Core value proposition
- MVP goal statement

**2. Mission**
- Product mission statement
- Core principles (3-5 key principles)

**3. Target Users**
- Primary user personas
- Technical comfort level
- Key user needs and pain points

**4. MVP Scope**
- **In Scope:** Core functionality for MVP (use ✅ checkboxes)
- **Out of Scope:** Features deferred to future phases (use ❌ checkboxes)
- Group by categories (Core Functionality, Technical, Integration, Deployment)

**5. User Stories**
- Primary user stories (5-8 stories) in format: "As a [user], I want to [action], so that [benefit]"
- Include concrete examples for each story
- Add technical user stories if relevant

**6. Core Architecture & Patterns**
- High-level architecture approach
- Reference the existing vertical-slice layout (`src/features/*`, `src/shared/*`, `src/routes/*`)
- Key design patterns: file-based TanStack Router, TanStack Query for data fetching/caching, feature slices with public API via `index.ts`
- Data flow: route loader → feature hook → TanStack Query → Supabase

**7. Tools/Features**
- Detailed feature specifications
- Identify feature-slice boundaries under `src/features/`
- Call out route files (`src/routes/*`) and any `beforeLoad` / `loader` / `pendingComponent` conventions
- Note query key factories and invalidation boundaries

**8. Technology Stack**
- This project is fixed to: React 19, Vite, TypeScript strict, TanStack Router + Query, Supabase, shadcn/ui, Tailwind v4, Biome, Vitest + Testing Library
- Enumerate any *additional* dependencies this PRD introduces (and justify each)
- Call out optional dependencies separately

**9. Security & Configuration**
- Authentication via Supabase Auth (email/password, magic link, OAuth as applicable)
- Client-side only — no SSR, no server secrets; all env must be public (`VITE_` prefix)
- Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Row Level Security (RLS) policies — in scope per feature (primary security boundary since auth is client-side)
- Security scope (in-scope and out-of-scope)

**10. API Specification** (if applicable)
- Feature hooks: signatures, return shape (query vs mutation), query keys
- External HTTP endpoints (if any): path, method, auth, shapes
- Example payloads

**11. Success Criteria**
- MVP success definition
- Functional requirements (use ✅ checkboxes)
- Quality indicators (type check clean, Biome clean, Vitest green)
- User experience goals (bundle size, TTI, accessibility)

**12. Implementation Phases**
- Break down into 3-4 phases
- Each phase: Goal, Deliverables (✅ checkboxes), Validation criteria
- Realistic timeline estimates
- Phases should be sized so each produces one or more plans under `.agents/plans/`

**13. Future Considerations**
- Post-MVP enhancements
- Integration opportunities
- Advanced features for later phases

**14. Risks & Mitigations**
- 3-5 key risks with specific mitigation strategies
- Include SPA-specific risks (no SSR = SEO limitations, client-only auth = RLS is the only backstop, bundle size, cache-invalidation bugs) where relevant

**15. Appendix** (if applicable)
- Related documents (link to `.agents/plans/INITIAL.md`, `.agents/reference/*`)
- Key dependencies with links
- Repository/project structure reference

## Instructions

### 1. Extract Requirements
- Review the entire conversation history
- Read `.agents/plans/INITIAL.md` and `.agents/plans/FEATURE.md` if they contain relevant context
- Identify explicit requirements and implicit needs
- Note technical constraints and preferences
- Capture user goals and success criteria

### 2. Synthesize Information
- Organize requirements into appropriate sections
- Fill in reasonable assumptions where details are missing
- Maintain consistency across sections
- Ensure technical feasibility against the fixed stack

### 3. Write the PRD
- Use clear, professional language
- Include concrete examples and specifics
- Use markdown formatting (headings, lists, code blocks, checkboxes)
- Add code snippets for technical sections where helpful
- Keep Executive Summary concise but comprehensive

### 4. Quality Checks
- ✅ All required sections present
- ✅ User stories have clear benefits
- ✅ MVP scope is realistic and well-defined
- ✅ Stack additions (beyond the fixed baseline) are justified
- ✅ Implementation phases are actionable and map to `.agents/plans/` deliverables
- ✅ Success criteria are measurable
- ✅ Consistent terminology throughout

## Style Guidelines

- **Tone:** Professional, clear, action-oriented
- **Format:** Use markdown extensively (headings, lists, code blocks, tables)
- **Checkboxes:** Use ✅ for in-scope items, ❌ for out-of-scope
- **Specificity:** Prefer concrete examples over abstract descriptions
- **Length:** Comprehensive but scannable

## Output Confirmation

After creating the PRD:
1. Confirm the file path where it was written (default: `.agents/PRD.md`)
2. Provide a brief summary of the PRD contents
3. Highlight any assumptions made due to missing information
4. Suggest next steps: usually `/generate-plan .agents/plans/INITIAL.md` to turn MVP scope into an implementation plan

## Notes

- If critical information is missing, ask clarifying questions before generating
- Adapt section depth based on available details
- This command contains the complete PRD template structure — no external references needed
- Do NOT overwrite an existing `.agents/PRD.md` without confirming with the user
