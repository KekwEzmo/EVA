<script>
	import mysql from 'mysql2/promise';
	import { onDestroy } from 'svelte';
  
	const dbConfig = {
	  host: '192.168.122.163',
	  user: 'tester',
	  password: 'test',
	  database: 'testing',
	};
  
	/**
	 * @type {mysql.Connection}
	 */
	let connection;
  
	async function connectToDatabase() {
	  connection = await mysql.createConnection(dbConfig);
	}
  
	let entries = [];
	let showEditEntryDialog = false;
	let newEntry = {};
  
	async function fetchEntries() {
	  const [rows] = await connection.execute('SELECT * FROM entries');
	  entries = rows;
	}
  
	/**
	 * @param {{ title: any; description: any; }} newEntry
	 */
	async function addEntry(newEntry) {
	  await connection.execute('INSERT INTO entries (title, description) VALUES (?, ?)', [
		newEntry.title,
		newEntry.description,
	  ]);
	  await fetchEntries();
	}
  
	/**
	 * @param {any} id
	 * @param {{ title?: any; description?: any; }} updatedEntry
	 */
	async function editEntry(id, updatedEntry) {
	  await connection.execute('UPDATE entries SET title=?, description=? WHERE id=?', [
		updatedEntry.title,
		updatedEntry.description,
		id,
	  ]);
	  await fetchEntries();
	}
  
	/**
	 * @param {any} id
	 */
	async function deleteEntry(id) {
	  await connection.execute('DELETE FROM entries WHERE id=?', [id]);
	  await fetchEntries();
	}
  
	/**
	 * @param {any} id
	 */
	async function openEditEntryDialog(id) {
	  newEntry = await fetchEntryById(id);
	  showEditEntryDialog = true;
	}
  
	/**
	 * @param {any} id
	 */
	async function fetchEntryById(id) {
	  const [rows] = await connection.execute('SELECT * FROM entries WHERE id=?', [id]);
	  return rows[0];
	}
  
	async function handleEditEntrySubmit() {
	  await editEntry(newEntry.id, newEntry);
	  closeEditEntryDialog();
	}
  
	function closeEditEntryDialog() {
	  showEditEntryDialog = false;
	}
  
	// Add this function to close the connection when the component is destroyed
	onDestroy(() => {
	  connection.end();
	});
  </script>
  
  <!-- Rest of your HTML code remains unchanged -->
  