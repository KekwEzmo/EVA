<script>
	import { db } from '$lib/server/database.db';
  
	let entries = [];
  
	async function fetchEntries() {
	  entries = await db.getAllEntries();
	}
  
	async function addEntry(newEntry) {
	  await db.addEntry(newEntry);
	  fetchEntries();
	}
  
	async function editEntry(id, updatedEntry) {
	  await db.updateEntry(id, updatedEntry);
	  fetchEntries();
	}
  
	async function deleteEntry(id) {
	  await db.deleteEntry(id);
	  fetchEntries();
	}
  </script>
  
  <h2>Database Widget</h2>
  
  <button on:click={fetchEntries}>Fetch Entries</button>
  
  <table>
	<thead>
	  <tr>
		<th>ID</th>
		<th>Title</th>
		<th>Description</th>
		<th>Actions</th>
	  </tr>
	</thead>

  </table>
  
  <dialog open={showEditEntryDialog}>
	<form on:submit|preventDefault={handleEditEntrySubmit}>
	  <label for="title">Title:</label>
	  <input id="title" type="text" bind:value={newEntry.title} />
  
	  <label for="description">Description:</label>
	  <textarea id="description" bind:value={newEntry.description} />
  
	  <button type="submit">Save</button>
	  <button on:click={() => closeEditEntryDialog()}>Cancel</button>
	</form>
  </dialog>
  
  <script>
	let showEditEntryDialog = false;
	let newEntry = {};
  
	function openEditEntryDialog(id) {
	  newEntry = await db.getEntryById(id);
	  showEditEntryDialog = true;
	}
  
	async function handleEditEntrySubmit() {
	  await editEntry(newEntry.id, newEntry);
	  closeEditEntryDialog();
	}
  
	function closeEditEntryDialog() {
	  showEditEntryDialog = false;
	}