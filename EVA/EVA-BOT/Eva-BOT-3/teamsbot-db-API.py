from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from datetime import datetime

app = FastAPI()

# Define your SQLite database connection
DATABASE_PATH = 'tickets.db'

def execute_query(query, params=None):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    if params:
        cursor.execute(query, params)
    else:
        cursor.execute(query)
    conn.commit()
    result = cursor.fetchall()
    conn.close()
    return result

# Define your data models
class Ticket(BaseModel):
    user_id: str
    title: str
    request: str
    selected_items: str
    creation_date: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    edit_date: str = None
    status: str = "open"
    solver_id: str = None

# Define your CRUD operations
@app.post("/tickets/")
async def create_ticket(ticket: Ticket):
    query = "INSERT INTO tickets (user_id, title, request, selected_items, creation_date, status) VALUES (?, ?, ?, ?, ?, ?)"
    execute_query(query, (ticket.user_id, ticket.title, ticket.request, ticket.selected_items, ticket.creation_date, ticket.status))
    return {"message": "Ticket created successfully"}

@app.get("/tickets/")
async def read_tickets():
    query = "SELECT * FROM tickets"
    result = execute_query(query)
    if not result:
        raise HTTPException(status_code=404, detail="No tickets found")
    tickets = []
    for row in result:
        ticket = {"id": row[0], "user_id": row[1], "title": row[2], "request": row[3], "selected_items": row[4], "creation_date": row[5], "edit_date": row[6], "status": row[7], "solver_id": row[8]}
        tickets.append(ticket)
    return tickets

@app.get("/tickets/{ticket_id}")
async def read_ticket(ticket_id: int):
    query = "SELECT * FROM tickets WHERE id = ?"
    result = execute_query(query, (ticket_id,))
    if not result:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket = {"id": result[0][0], "user_id": result[0][1], "title": result[0][2], "request": result[0][3], "selected_items": result[0][4], "creation_date": result[0][5], "edit_date": result[0][6], "status": result[0][7], "solver_id": result[0][8]}
    return ticket

@app.put("/tickets/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: Ticket):
    # Get the current timestamp
    current_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Update the ticket in the database with the provided data and current timestamp
    query = "UPDATE tickets SET user_id = ?, title = ?, request = ?, selected_items = ?, edit_date = ?, status = ?, solver_id = ? WHERE id = ?"
    execute_query(query, (ticket.user_id, ticket.title, ticket.request, ticket.selected_items, current_timestamp, ticket.status, ticket.solver_id, ticket_id))
    return {"message": "Ticket updated successfully"}

@app.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    query = "DELETE FROM tickets WHERE id = ?"
    execute_query(query, (ticket_id,))
    return {"message": "Ticket deleted successfully"}
