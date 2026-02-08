## 2026-02-08 - Improving Authentication UX and Accessibility
**Learning:** In highly interactive components like authentication forms, micro-interactions like password visibility toggles significantly improve usability. However, they must be implemented with full accessibility in mind, including dynamic ARIA labels and visible focus states for keyboard users. Additionally, asynchronous feedback (messages) should use ARIA live regions to be inclusive.
**Action:** Always include a focus ring when using `focus:outline-none` on interactive elements, and use `role="alert"` for form feedback.
