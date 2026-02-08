## 2026-02-08 - Improving Authentication UX and Accessibility
**Learning:** In highly interactive components like authentication forms, micro-interactions like password visibility toggles significantly improve usability. However, they must be implemented with full accessibility in mind, including dynamic ARIA labels and visible focus states for keyboard users. Additionally, asynchronous feedback (messages) should use ARIA live regions to be inclusive.
**Action:** Always include a focus ring when using `focus:outline-none` on interactive elements, and use `role="alert"` for form feedback.

## 2026-02-08 - Accessible Dropdown Menus in Fixed Navigation
**Learning:** When implementing interactive menus (dropdowns) within a fixed or sticky navigation bar, careful consideration of `z-index` stacking contexts is crucial. A "click outside" backdrop (`fixed inset-0`) is a reliable pattern for closing menus without complex directives, but DOM order matters for keyboard accessibility. Placing the menu content *after* the trigger button ensures a logical tab flow.
**Action:** For simple dropdowns, use a transparent fixed backdrop for closure and ensure menu markup follows the trigger button in the DOM.
