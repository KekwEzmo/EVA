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
    edit_date: str
    status: str = "open"
    solver_id: str

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


from datetime import datetime

@app.put("/tickets/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: Ticket):
    # Get the existing ticket data from the database
    existing_ticket_query = "SELECT * FROM tickets WHERE id = ?"
    existing_ticket = execute_query(existing_ticket_query, (ticket_id,))
    
    # If the ticket with the given ID doesn't exist, raise an HTTPException
    if not existing_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Extract the existing ticket data
    existing_ticket_data = existing_ticket[0]

    # Extract existing values or use provided values
    user_id = ticket.user_id if ticket.user_id else existing_ticket_data[1]
    title = ticket.title if ticket.title else existing_ticket_data[2]
    request = ticket.request if ticket.request else existing_ticket_data[3]
    selected_items = ticket.selected_items if ticket.selected_items else existing_ticket_data[4]
    edit_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Current timestamp
    status = ticket.status if ticket.status else existing_ticket_data[7]
    solver_id = ticket.solver_id if ticket.solver_id else existing_ticket_data[8]
    
    # Update the ticket in the database with the provided or existing data
    query = "UPDATE tickets SET user_id = ?, title = ?, request = ?, selected_items = ?, edit_date = ?, status = ?, solver_id = ? WHERE id = ?"
    execute_query(query, (user_id, title, request, selected_items, edit_date, status, solver_id, ticket_id))
    
    return {"message": "Ticket updated successfully"}




@app.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    query = "DELETE FROM tickets WHERE id = ?"
    execute_query(query, (ticket_id,))
    return {"message": "Ticket deleted successfully"}
