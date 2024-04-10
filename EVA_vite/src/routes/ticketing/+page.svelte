<script>
	import { writable } from 'svelte/store';

	let tableData = writable([]);

	async function fetchData() {
		try {
			const response = await fetch('http://192.168.122.163:3000/api/data', {
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
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}
	th, td {
		border: 1px solid #dddddd;
		text-align: left;
		padding: 8px;
	}
	
	th {
	  background-color: #FFE65D;
	}
	</style>
	
