import { expect, test } from '@playwright/test';

test('about page has expected h1', async ({ page }) => {
	await page.goto('/about');
	await expect(page.getByRole('heading', { name: 'About this app' })).toBeVisible();
});


test('Database connection and CORS test', async ({ page }) => {
	// Set the API endpoint URL
	const apiEndpoint = 'http://192.168.122.163:3000/api/data';
  
	// Navigate to your Svelte app
	await page.goto('http://localhost:5173/');
  
	// Click the "Fetch Data" button
	await page.click('button');
  
	// Wait for the data to be fetched and displayed
	await page.waitForSelector('tbody tr');
  
	// Get the data from the Svelte app
	const tableData = await page.$$eval('tbody tr', rows => {
	  return rows.map(row => {
		const columns = row.querySelectorAll('td');
		return {
		  id: columns[0].innerText,
		  user_id: columns[1].innerText,
		  title: columns[2].innerText,
		  request: columns[3].innerText,
		  selected_items: columns[4].innerText,
		};
	  });
	});
  
	// Perform your assertions
	expect(tableData.length).toBeGreaterThan(0);
	// Add more specific assertions based on your expected data
  
	// Test the API endpoint for CORS support
	const apiResponse = await page.evaluate(async apiEndpoint => {
	  try {
		const response = await fetch(apiEndpoint);
		return response.json();
	  } catch (error) {
	  }
	}, apiEndpoint);
  
	// Assert that the API response contains the expected data
	expect(apiResponse.data).toBeDefined();
	// Add more specific assertions based on your expected API response
  
	// You can also print the fetched data and API response for debugging
	console.log('Fetched data:', tableData);
	console.log('API Response:', apiResponse);
  });