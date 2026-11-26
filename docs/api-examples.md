# API examples

Base URL: `http://localhost:5000/api`

All authenticated calls must send cookies. When using Postman, enable cookie handling for the API host.

## Register

`POST /auth/register`

```json
{
  "name": "Test User",
  "email": "user@example.com",
  "password": "Password123"
}
```

## Login

`POST /auth/login`

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

## Create ticket

`POST /tickets`

```json
{
  "title": "Unable to access my account",
  "description": "I receive an error when I try to sign in to my account.",
  "category": "Account",
  "priority": "High"
}
```

## Add comment

`POST /tickets/TICKET_ID/comments`

```json
{
  "message": "I have attached the additional details requested."
}
```

## Admin update

`PATCH /admin/tickets/TICKET_ID`

```json
{
  "status": "In Progress",
  "priority": "Urgent"
}
```
