
	async function getResult() {
		const options = {
			bcid: "code128",
			text: userText,
		};

		const queryString = objectToQuerystring(options);
		console.log(queryString);
		const url = `https://api-bwipjs.metafloor.com/${queryString}`;
		codeUrl = url;
		console.log(url);
		let response = await fetch(url, {
			method: "GET",
			redirect: "follow",
		});

		console.log(response);
		let text = await response.body();
		let data = text;
		return data;
	}