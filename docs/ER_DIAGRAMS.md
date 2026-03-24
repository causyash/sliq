# SLIQ Project - Detailed Database ER Diagrams

This document provides a comprehensive A-Z breakdown of the database architecture for the SLIQ project. The diagrams are generated using Mermaid and represent the MongoDB schema relationships across all entities.

---

## 1. Core Architecture Overview
This diagram focuses on the primary relationship between Users, Workspaces, Projects, and Tasks. These are the cornerstones of the SLIQ application hierarchy.

```mermaid
erDiagram
    USER ||--o{ WORKSPACE : "owns"
    USER ||--o{ WORKSPACE : "member_of"
    WORKSPACE ||--o{ PROJECT : "contains"
    PROJECT ||--o{ TASK : "has"
    USER ||--o{ TASK : "assigned_to"
    USER ||--o{ PROJECT : "member_of"
    USER ||--o{ PROJECT : "created_by"
    USER ||--o{ TASK : "created_by"

    USER {
        ObjectId _id PK
        string name
        string email
        string password
        string role "admin|project_manager|developer|viewer"
        string avatar
        ObjectId[] workspaceIds "Array of FK"
        Date createdAt
    }

    WORKSPACE {
        ObjectId _id PK
        string name
        ObjectId owner FK "Ref: User"
        ObjectId[] members FK "Ref: User"
        Date createdAt
    }

    PROJECT {
        ObjectId _id PK
        ObjectId workspaceId FK "Ref: Workspace"
        string name
        string description
        ObjectId[] members FK "Ref: User"
        ObjectId createdBy FK "Ref: User"
        Date createdAt
    }

    TASK {
        ObjectId _id PK
        ObjectId projectId FK "Ref: Project"
        string title
        string description
        string status "todo|in_progress|review|done"
        string priority "low|medium|high|urgent"
        ObjectId assignee FK "Ref: User"
        Date dueDate
        Object[] subtasks "title, isCompleted"
        string[] labels
        ObjectId createdBy FK "Ref: User"
        Date createdAt
    }
```

---

## 2. Full System Entity-Relationship Diagram (A-Z)
This diagram includes all system entities: Users, Workspaces, Projects, Tasks, Comments, Meetings, Notifications, and Activities.

```mermaid
erDiagram
    USER ||--o{ WORKSPACE : "owns/belongs"
    USER ||--o{ PROJECT : "participates/creates"
    USER ||--o{ TASK : "assigned/creates"
    USER ||--o{ COMMENT : "posts"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ MEETING : "organizes"
    USER ||--o{ ACTIVITY : "performs"

    WORKSPACE ||--o{ PROJECT : "hosts"
    WORKSPACE ||--o{ MEETING : "hosts"
    WORKSPACE ||--o{ ACTIVITY : "tracks"

    PROJECT ||--o{ TASK : "contains"
    PROJECT ||--o{ MEETING : "references"
    PROJECT ||--o{ ACTIVITY : "tracks"

    TASK ||--o{ COMMENT : "has"
    TASK ||--o{ ACTIVITY : "tracks"
    TASK ||--o{ NOTIFICATION : "triggers"

    MEETING ||--o{ NOTIFICATION : "triggers"

    COMMENT {
        ObjectId _id PK
        ObjectId taskId FK "Ref: Task"
        ObjectId userId FK "Ref: User"
        string message
        Date createdAt
    }

    MEETING {
        ObjectId _id PK
        string title
        string description
        Date date
        string time
        string roomId
        ObjectId organizer FK "Ref: User"
        ObjectId project FK "Ref: Project"
        ObjectId workspace FK "Ref: Workspace"
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId userId FK "Ref: User"
        string type "task_assigned|status_changed|comment_added|meeting_scheduled"
        string message
        ObjectId relatedTask FK "Ref: Task"
        ObjectId relatedMeeting FK "Ref: Meeting"
        boolean isRead
        Date createdAt
    }

    ACTIVITY {
        ObjectId _id PK
        ObjectId workspaceId FK "Ref: Workspace"
        ObjectId projectId FK "Ref: Project"
        ObjectId taskId FK "Ref: Task"
        ObjectId userId FK "Ref: User"
        string action
        string details
        Date createdAt
    }
```

---

## 3. Data Dictionary

### User Model
The central point of authentication and authorization.
- **_id**: Unique identifier.
- **role**: Defines access levels (Admin, PM, Developer, Viewer).
- **workspaceIds**: Junction field for quick access to associated workspaces.

### Workspace Model
The top-level organizational container.
- **owner**: Tracks who has primary control.
- **members**: Array of IDs for multi-user collaboration.

### Project Model
Specific initiatives within a Workspace.
- **workspaceId**: Links the project to its parent container.
- **members**: Project-specific access control.

### Task Model
The primary unit of work.
- **projectId**: Links task to its project.
- **assignee**: THE user responsible for the task.
- **status/priority**: Enums for kanban/list workflows.

### Comment Model
Facilitates communication.
- **taskId**: Links the comment to a specific work item.

### Meeting Model
Collaboration and scheduling.
- **roomId**: Unique identifier for virtual rooms.
- **project/workspace**: Contextual links for where the meeting belongs.

### Notification Model
User engagement and updates.
- **userId**: The recipient.
- **relatedTask/Meeting**: Contextual links to the source of the notification.

### Activity Model
The system's audit log.
- **action**: Describes what happened (e.g., 'task_moved').
- **workspace/project/task**: Full path of where the activity occurred.

---

## 4. Relationship Logic
- **Hierarchical**: Workspace > Project > Task > Comment.
- **Cross-Cutting**: User connects to every major entity.
- **Observational**: Activity and Notification track changes across the hierarchy.
