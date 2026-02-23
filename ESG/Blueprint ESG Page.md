Project Context:
I am building a "God-Tier" ESG Maturity Assessment & Scoring module as a new page/sub-system within an existing Next.js (App Router) Environmental Monitoring System. The module must function as an interactive questionnaire based strictly on the GRI 11: Oil and Gas Sector 2021 standard.

UI/UX & Design System:

Theme: "Ocean Calm" (modern minimalist with teal-to-cyan gradients, e.g., from-teal-500 to-cyan-400).

Components: Use shadcn/ui (Radix primitives) for forms, accordions, progress bars, and modals.

Layout: A master-detail layout where the left sidebar lists the 21 GRI Topics, and the right main area displays the specific disclosures and questionnaires for the selected topic. Include a sticky header with a real-time ESG Maturity Score.

Database Schema (Prisma) Requirements:
Create relations for EsgTopic, EsgDisclosure, EsgQuestion, and EsgAnswer.

EsgAnswer must include: maturityScore (Int: 0-3), evidenceUrl (String, nullable, for attachment), and remarks (String).

Scoring Engine:
Implement a utility function to calculate scores on a 0-3 scale for each question:

0: Not Reported

1: Partially Reported (Policy exists)

2: Fully Reported (Data provided, no evidence)

3: Verified (Data + valid evidenceUrl)
Ensure the final score is normalized to a 0-100 percentage scale for the dashboard.

Data Seed Mapping (Strict GRI 11 Compliance):
Initialize the database or state with the following 21 topics and their precise disclosures. Each disclosure must map to a form field requiring a 0-3 score input, a URL attachment field, and a remarks textarea:

1.  11.1 Climate change: GRI 3-3, GRI 102 (1-10), GRI 103 (1-4), CapEx investment allocation, Flaring and venting.
2.  11.3 Air emissions: GRI 3-3, GRI 305-7 (NOx, SOx, and other significant air emissions), GRI 416-1.
3.  11.4 Biodiversity: GRI 3-3, GRI 101 (1-8 covering policies, impacts, locations, drivers of loss, ecosystem services).
4.  11.5 Waste: GRI 3-3, GRI 306 (1-5 covering waste generation, diverted, and directed to disposal) including drilling waste, scale/sludges, and tailings.
5.  11.6 Water and effluents: GRI 3-3, GRI 303 (1-5 covering interactions, withdrawal, discharge, consumption).
6.  11.7 Closure and rehabilitation: GRI 3-3, GRI 402-1, GRI 404-2, Closure and rehabilitation of sites, Decommissioned structures in place, Financial provisions.
7.  11.8 Asset integrity and critical incident management: GRI 3-3, GRI 306-3 (Significant spills), Process safety events (Tier 1 & 2), Tailings facilities.
8.  11.9 Occupational health and safety: GRI 3-3, GRI 403 (1-10 covering OHS management system, hazard identification, worker participation, training, injury rates).
9.  11.10 Employment practices: GRI 3-3, GRI 401 (1-3), GRI 402-1, GRI 404 (1-2), GRI 414 (1-2).
10. 11.11 Non-discrimination and equal opportunity: GRI 3-3, GRI 202-2, GRI 401-3, GRI 404-1, GRI 405 (1-2 covering diversity and pay parity), GRI 406-1.
11. 11.12 Forced labor and modern slavery: GRI 3-3, GRI 409-1, GRI 414-1.
12. 11.13 Freedom of association and collective bargaining: GRI 3-3, GRI 407-1.
13. 11.14 Economic impacts: GRI 3-3, GRI 201-1 (Direct economic value generated and distributed), GRI 202-2, GRI 203 (1-2 covering infrastructure investments), GRI 204-1.
14. 11.15 Local communities: GRI 3-3, GRI 413 (1-2 covering engagement and impact assessments), Grievances from local communities.
15. 11.16 Land and resource rights: GRI 3-3, Involuntary resettlement.
16. 11.17 Rights of Indigenous Peoples: GRI 3-3, GRI 411-1, Operations where Indigenous Peoples may be affected, Free, prior, and informed consent (FPIC).
17. 11.18 Conflict and security: GRI 3-3, GRI 410-1 (Security personnel trained in human rights).
18. 11.19 Anti-competitive behavior: GRI 3-3, GRI 206-1 (Legal actions for anti-competitive behavior).
19. 11.20 Anti-corruption: GRI 3-3, GRI 205 (1-3 covering risk assessments, training, confirmed incidents), Contract transparency, Beneficial ownership.
20. 11.21 Payments to governments: GRI 3-3, GRI 201 (1, 4), GRI 207 (1-4 covering approach to tax and country-by-country reporting), State oil and gas purchases.
21. 11.22 Public policy: GRI 3-3, GRI 415-1 (Political contributions).
+4

Output Request:

Provide the complete schema.prisma for this ESG module.

Generate the React component (Next.js Client Component) for the Assessment Form, complete with the shadcn/ui form mapping for a specific topic (e.g., 11.1 Climate change) to demonstrate the input fields (Maturity radio buttons 0-3, evidenceUrl text input, remarks text area).

Include the TypeScript logic for the scoring engine calculation.