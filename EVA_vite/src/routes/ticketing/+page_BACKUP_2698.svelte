<script>
	import { writable } from 'svelte/store';
<<<<<<< HEAD
	
	let tableData = writable([]);
	let searchTerm = '';
	
	async function fetchData() {
	  try {
		const response = await fetch('http://192.168.0.215:5252/getData', {
		  credentials: 'include',
		});
		const { data } = await response.json();
		tableData.set(data);
	  } catch (error) {
		console.error('Error fetching data:', error);
	  }
	}
	
	async function filterData() {
	  try {
		const response = await fetch('http://192.168.0.215:5252/search', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ searchTerm }),
		});
		const { data } = await response.json();
		tableData.set(data);
	  } catch (error) {
		console.error('Error filtering data:', error);
	  }
	}
	
	</script>
	
	<section>
	  <button on:click="{fetchData}">Fetch Data</button>
	  <input type="text" bind:value={searchTerm} />
	  <button on:click="{filterData}">Search</button>
	
	  <table>
		<thead>
		  <tr>
			<th>ID</th>
			<th>User ID</th>
			<th>Title</th>
			<th>Request</th>
			<th>Selected Items</th>
		  </tr>
		</thead>
		<tbody>
		  {#each $tableData as row (row.id)}
			<tr>
			  <td>{row.id}</td>
			  <td>{row.user_id}</td>
			  <td>{row.title}</td>
			  <td>{row.request}</td>
			  <td>{row.selected_items}</td>
			</tr>
		  {/each}
		</tbody>
	  </table>
	</section>
	
	<style>
=======

	let tableData = writable([]);

	async function fetchData() {
		try {
			const response = await fetch('http://192.168.0.215:5252/getData', {
				credentials: 'include',
			});
			const { data } = await response.json();
			console.log('Fetched data:', data);
			
			tableData.set(data.reverse());
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}
</script>

<section>
	<button on:click="{fetchData}">Fetch Data</button>

	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>User ID</th>
				<th>Title</th>
				<th>Request</th>
				<th>Selected Items</th>
			</tr>
		</thead>
		<tbody>
			{#each $tableData as row (row.id)}
				<tr>
					<td>{row.id}</td>
					<td>{row.user_id}</td>
					<td>{row.title}</td>
					<td>{row.request}</td>
					<td>{row.selected_items}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style>
>>>>>>> 3a930f007ccf4569b3b62312db3bcd5a1959d27e
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}
<<<<<<< HEAD
	
=======

>>>>>>> 3a930f007ccf4569b3b62312db3bcd5a1959d27e
	th, td {
		border: 1px solid #dddddd;
		text-align: left;
		padding: 8px;
	}
<<<<<<< HEAD
	
	th {
	  background-color: #FFE65D;
	}
	</style>
	
=======

	th {
		background-color: #f2f2f2;
	}
</style>
>>>>>>> 3a930f007ccf4569b3b62312db3bcd5a1959d27e
