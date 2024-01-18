<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
  
	let tableData = [];
  
	onMount(async () => {
	  try {
		const response = await fetch('http://localhost:5252/getData');
		const { data } = await response.json();
		console.log('Fetched data:', data);
		tableData = data;
	  } catch (error) {
		console.error('Error fetching data:', error);
	  }
	});
  </script>
  
  <section>
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
		{#each tableData as row (row.id)}
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
	  background-color: #f2f2f2;
	}
  </style>
  