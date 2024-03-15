from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

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

# Define your CRUD operations
@app.post("/tickets/")
async def create_ticket(ticket: Ticket):
    query = "INSERT INTO tickets (user_id, title, request, selected_items) VALUES (?, ?, ?, ?)"
    execute_query(query, (ticket.user_id, ticket.title, ticket.request, ticket.selected_items))
    return {"message": "Ticket created successfully"}

@app.get("/tickets/{ticket_id}")
async def read_ticket(ticket_id: int):
    query = "SELECT user_id, title, request, selected_items FROM tickets WHERE id = ?"
    result = execute_query(query, (ticket_id,))
    if not result:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"user_id": result[0][0], "title": result[0][1], "request": result[0][2], "selected_items": result[0][3]}

@app.put("/tickets/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: Ticket):
    # Retrieve the existing ticket data from the database
    existing_ticket_query = "SELECT user_id FROM tickets WHERE id = ?"
    existing_user_id = execute_query(existing_ticket_query, (ticket_id,))
    
    # If the ticket with the given ID doesn't exist, raise an HTTPException
    if not existing_user_id:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Extract the existing user ID
    existing_user_id = existing_user_id[0][0]
    
    # If user_id is not provided in the request, use the existing user_id
    if not ticket.user_id:
        ticket.user_id = existing_user_id
    
    # Update the ticket in the database with the provided data
    query = "UPDATE tickets SET user_id = ?, title = ?, request = ?, selected_items = ? WHERE id = ?"
    execute_query(query, (ticket.user_id, ticket.title, ticket.request, ticket.selected_items, ticket_id))
    
    return {"message": "Ticket updated successfully"}

@app.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    query = "DELETE FROM tickets WHERE id = ?"
    execute_query(query, (ticket_id,))
    return {"message": "Ticket deleted successfully"}