# Sliq: Technical Live-Demo Script

This script is structured for a 4-person technical demonstration. The team is divided into two units: **The Project Management Unit** and **The Developer Unit**. 

**Deployment Strategy:**
- **Unit A (Management):** PM 1 (Narrator) + PM 2 (Demonstrator)
- **Unit B (Developer):** Dev 1 (Narrator) + Dev 2 (Demonstrator)

---

## **I. Introduction (Full Team)**

**Speaker 1 (PM 1):** "Good [morning/afternoon]. Today we are presenting **Sliq**, a high-performance project management ecosystem. Our presentation is split into two perspectives: the functional management flow and the underlying technical implementation that powers it."

**Speaker 3 (Dev 1):** "Architecturally, Sliq is built to solve the 'stale-data' problem in collaborative environments. We will demonstrate how our full-stack implementation ensures that management-level decisions are propagated through the system with sub-100ms latency."

---

## **II. The Management Perspective (PM Unit)**

**PM 1 [Narrating]:** "We begin with the administrative layer. From a management perspective, the system must maintain a single source of truth for task distribution. PM 2 is now initializing a new sprint cycle."

**PM 2 [Performing]:** 
- *Navigates to the Dashboard.*
- *Creates a New Project named 'Academic Review'.*
- *Populates the 'To Do' column with 3 technical tasks.*

**PM 1 [Narrating]:** "Observe the **Kanban Engine**. Rather than a static list, we utilize a multi-column state machine. When PM 2 moves a task from 'To Do' to 'In Progress', the system doesn't just change a CSS class; it recomputes the project's overall progress metrics in the background."

**PM 2 [Performing]:** 
- *Drags a task across columns using the smooth @dnd-kit interface.*
- *Opens the 'Analytics' tab to show the progress chart automatically updating.*
- *Adds a priority label ('High') and a deadline.*

**PM 1 [Narrating]:** "The system leverages **Conditional Rendering** to differentiate between different ticket priorities and statuses at a glance. We’ve implemented a granular activity log for every ticket, ensuring full auditability of the project lifecycle—crucial for managing large-scale engineering teams."

---

## **III. The Developer Perspective (Dev Unit)**

**Dev 1 [Narrating]:** "Now, let’s look 'under the hood'. While the PMs interact with the UI, the **Developer Unit** manages the data integrity and real-time synchronization layer. Dev 2 will demonstrate the reactive nature of our backend."

**Dev 2 [Performing]:** 
- *Opens a second browser window (authenticated as a different user).*
- *Arranges windows side-by-side to show real-time sync.*
- *Edits a task's description in Window A.*

**Dev 1 [Narrating]:** "Notice the instant update in Window B. This is handled by our **Socket.io Service Layer**. We avoid expensive polling by maintaining a persistent WebSocket connection. The backend uses an event-bus architecture to broadcast state changes only to users within the specific 'Project Room'."

**Dev 2 [Performing]:** 
- *Shows the 'Task Modal' and adds a complex subtask.*
- *Triggers a validation error (e.g., trying to save an empty task) to show the Middleware in action.*

**Dev 1 [Narrating]:** "Our data model utilizes **MongoDB Mongoose sub-documents** for subtasks. This allows us to fetch an entire task tree in a single query, significantly reducing database I/O compared to relational table-joining. For security, every interaction is shielded by a **JWT-based RBAC (Role-Based Access Control)** middleware, ensuring developers only access the repositories they are assigned to."

---

## **IV. Conclusion (Full Team)**

**PM 1:** "In summary, Sliq bridges the gap between high-level project oversight and low-level data consistency."

**Dev 1:** "By combining React 19’s concurrent features with a scalable Node.js event-driven backend, we have built a tool that is both functionally robust and technically sound."

**PM 2 & Dev 2 [Performing]:**
- *Perform one final simultaneous task move and window sync.*
- *Navigate to the 'Project Complete' view.*

**PM 1:** "Thank you for your time. We are now ready for technical questions regarding our implementation choices."
