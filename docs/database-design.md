# Database design

## Collections and relationships

```text
User (1) -------- (many) Ticket
User (1) -------- (many) Comment
Ticket (1) ------ (many) Comment
User (1) -------- (many) ActivityLog
Ticket (1) ------ (many) ActivityLog
```

### User
- `_id`: MongoDB ObjectId
- `name`: string
- `email`: unique, lowercase string
- `password`: bcrypt hash (excluded from normal queries)
- `role`: `user` or `admin`

### Ticket
- `_id`: MongoDB ObjectId
- `title`, `description`
- `category`: Technical, Account, Billing, General or Other
- `priority`: Low, Medium, High or Urgent
- `status`: Open, In Progress, Resolved or Closed
- `createdBy`: reference to User
- `resolvedAt`: date or null

### Comment
- `_id`
- `ticket`: reference to Ticket
- `user`: reference to User
- `message`

### ActivityLog
- `_id`
- `ticket`: reference to Ticket
- `user`: reference to User
- `action`
- `details`

## Access rules

A normal user query includes their own `createdBy` ID. An admin query can access tickets across all users. Admin role is created only through the server-side seed script, never through public registration.
