<script>
	import { element } from "svelte/internal";

	import streamToBlob from "stream-to-blob";

	let name = "world";
	let userText = "";
	let selectedOption;
	let codeUrl = null;

	let codeUrls = [];

	let codeOptions = [
		{
			id: 2,
			multiples: 1,
			text: `datamatrix small`,
			options: {
				bcid: "datamatrix",
				version: "48x48",
				format: "square",
			},
		},
		{
			id: 1,
			multiples: 1,
			text: `datamatrix medium`,
			options: {
				bcid: "datamatrix",
				version: "96x96",
				format: "square",
			},
		},
		{
			id: 2,
			multiples: 1,
			text: `datamatrix large square`,
			options: {
				bcid: "datamatrix",
				format: "square",
				version: "144x144",
			},
		},
		{
			id: 2,
			multiples: 1,
			text: `datamatrix large rect`,
			options: {
				bcid: "datamatrixrectangularextension",
				rotate: "R",
				version: "8x120",
				/* format: "rectangle",
				columns: 144,
				rows: 96, */
			},
		},
		{
			id: 2,
			multiples: 8,
			text: `datamatrix large multiple`,
			options: {
				bcid: "datamatrixrectangularextension",

				version: "8x120",
				/* format: "rectangle",
				columns: 144,
				rows: 96, */
			},
		},
		{
			id: 3,
			multiples: 1,
			text: `codablock large`,
			options: {
				bcid: "codablockf",
				version: "192x192",
				columns: 20,
				rows: 28,
				rowheight: 6,
				sepheight: 1,
				rotate: "R",
			},
		},
		{
			id: 5,
			multiples: 1,
			text: `Code One small`,
			options: {
				bcid: "codeone",
				version: "C",
			},
		},
		{
			id: 6,
			multiples: 1,
			text: `Code One large`,
			options: {
				bcid: "codeone",
				version: "H",
			},
		},
	];

	const splitArray = (inArray, chunkCount) => {
		const slots = new Array();
		for (let i = 0; i < chunkCount; i++) {
			slots.push([]);
		}
		console.log("chunks", slots);

		inArray.forEach((elem, i) => {
			console.log(i, i % chunkCount);
			slots[i % chunkCount].push(elem);
		});
		return slots;
	};

	const objectToQuerystring = (obj) => {
		return Object.keys(obj).reduce(function (str, key, i) {
			var delimiter, val;
			delimiter = i === 0 ? "?" : "&";
			key = encodeURIComponent(key);
			val = encodeURIComponent(obj[key]);
			return [str, delimiter, key, "=", val].join("");
		}, "");
	};

	function setCodeUrl() {
		const queryParams = { ...selectedOption.options };

		const textSplit = userText.split("");
		console.log(textSplit);

		const arrayChunked = splitArray(textSplit, selectedOption.multiples);
		console.log(arrayChunked);

		const queries = arrayChunked.map((chunk) => {
			queryParams.text = chunk.join("");
			const queryString = objectToQuerystring(queryParams);
			const url = `https://api-bwipjs.metafloor.com/${queryString}`;
			return url;
		});

		console.log(queries);

		codeUrls = queries;
	}

	function submitHandler(e) {
		result = getResult();
	}

	const downloadFiles = async () => {
		const resp = await fetch(codeUrls[0]);
		console.log(resp);

		const imageBlob = await streamToBlob(resp.body);
		console.log(imageBlob);
	};
</script>

<h1>Hello {name}!</h1>
<form on:submit|preventDefault={setCodeUrl}>
	<select bind:value={selectedOption}>
		{#each codeOptions as codeOption}
			<option value={codeOption}>{codeOption.text}</option>
		{/each}
	</select>

	<input bind:value={userText} />

	<button type="submit"> create code </button>
</form>
<p>{userText}</p>
<button on:click={downloadFiles}>download</button>
<div>
	{#if codeUrl}<img src={codeUrl} alt="d" />{/if}
</div>

<div>
	{#each codeUrls as url, i}<img src={url} alt={i} />{/each}
</div>
