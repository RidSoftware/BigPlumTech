document.getElementById('testButton').addEventListener('click', async () => {
	try {
		const response = await fetch('http://localhost:8080/api/test', {
			method: 'GET',
		});
		const data = await response.json();
		document.getElementById('response').textContent = JSON.stringify(data, null, 2);
	} catch (error) {
		console.error('Error:', error);
	}

});
