# Sliq Project: Role-Based Access Control (RBAC) Analysis

This document outlines the current state of permissions and the changes implemented to distinguish between **Admin**, **Project Manager**, and **Developer** roles.

---

## 1. Role Definitions & Permissions

### 👑 Admin
The **Admin** is the platform overseer with unrestricted access to all data across all workspaces and projects.

- **Workspace Management**: Create, view, and manage any workspace.
- **Project Management**: Create, view, modify, and delete any project.
- **Task Management**: Full control over tasks, including the unique ability to **approve/move tasks to the "Done" column**.
- **Admin Console**: Exclusive access to the `Admin Management Console` and platform-wide analytics.
- **Member Management**: Can invite users to any workspace.

### 💼 Project Manager (PM)
The **Project Manager** is responsible for coordinating work within their assigned workspaces.

- **Workspace Management**: View workspaces they belong to. (Note: Currently can create workspaces in backend, but often restricted in UI flow).
- **Project Management**: **Authorized** to create and delete projects within their workspaces.
- **Task Management**: Create, edit, and move tasks. Like Admins, they have the **authority to move tasks to "Done" (Approve)**.
- **Member Management**: Can invite new team members to their workspaces.

### 💻 Developer
The **Developer** is an individual contributor focused on execution. **This role was recently updated to restrict management-level actions.**

- **Workspace Management**: View workspaces they are members of. **CANNOT** create new workspaces.
- **Project Management**: View projects they are members of. **CANNOT** create or delete projects.
- **Task Management**:
    - **CANNOT** create new tasks.
    - **CANNOT** move tasks to the "Done" column (requires PM/Admin approval).
    - Can update existing tasks (except status to "Done") and add comments.
- **Member Management**: **CANNOT** invite members to a workspace.

---

## 2. Summary of Recent UI Implementations

The following UI elements are now **conditionally hidden** for users with the `developer` role to prevent unauthorized actions:

| Page / Component | Element Hidden for Developers | Rationale |
| :--- | :--- | :--- |
| **Dashboard** | `Create Workspace` Button | Developers should not be able to create top-level organization units. |
| **Workspace Page** | `New Project` Button | Project structure management is restricted to PMs and Admins. |
| **Workspace Page** | Empty State `Create Project →` Link | Prevents developers from initiating project creation when no projects exist. |
| **Project Page** | `Add Task` Button (Header) | Task creation is now limited to management roles to maintain board integrity. |
| **Kanban Board** | Column `Plus (+)` Icons | Visual shortcut to add tasks is removed to enforce creation restrictions. |

---

## 3. Enforcement Logic (Technical Detail)

### Frontend Protection
In `WorkspacePage.jsx`, `Dashboard.jsx`, and `TaskColumn.jsx`, I implemented role checks:
```javascript
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
const isDeveloper = userInfo.role === 'developer';

// Conditional Rendering
{!isDeveloper && <button>Create Action</button>}
```

### Backend Protection
In `server/routes/projectRoutes.js`, management actions are protected by the `authorize` middleware:
```javascript
router.post('/', authorize('admin', 'project_manager'), createProject);
router.delete('/:id', authorize('admin', 'project_manager'), deleteProject);
```

### Kanban Status Protection
In `KanbanBoard.jsx`, moving a task to "Done" invokes a role check to prevent unauthorized approvals:
```javascript
if (overStatus === 'done' && !isPM) {
    alert("Only Project Managers can approve and mark tasks as done.");
    return;
}
```

---

## 4. Recommended Future Enhancements

To further solidify the security and UX of the platform, consider:
1.  **Backend Task Protection**: Update `taskRoutes.js` to also use `authorize('admin', 'project_manager')` for the `POST` and `DELETE` routes to match the UI restrictions.
2.  **Invite Restriction**: Hide the invite form in `WorkspacePage.jsx` for developers.
3.  **Role Selection in Admin Console**: Allow Admins to promote/demote users between Developer and Project Manager roles directly from the UI.
