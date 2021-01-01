<script>
	import JSZip from "jszip";
	import { nanoid } from "nanoid";
	import { saveAs } from "file-saver";
	import dateFormat from "dateformat";

	import loremIpsum from './loremipsum'

	import {
		Alert,
		Container,
		Button,
		Col,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		UncontrolledDropdown,
		Input,
	} from "sveltestrap";

	import codeOptions from "./codeOptions";

	let userText = "";
	let selectedOption = null;
	let codeOptionIndex = null;
	let optionText = "";

	let codeUrls = [];

	let downloadFilename;

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

		if(userText.length > selectedOption.capacity){
			alert(`not enough capacity in code: ${userText.length} -> ${selectedOption.capacity}`)
		}

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
		codeUrls = queries;
	}

	const downloadFiles = async () => {
		const zip = new JSZip();
		
		await Promise.all(
			codeUrls.map(async (code, i) => {
				const resp = await fetch(code);
				const blob = await resp.blob();
				downloadFilename = `download-${i}.png`;
				zip.file(downloadFilename, blob);
			})
		);

		const now = new Date();
		const dateString = dateFormat(now, "yymmdd-hh-mm");
		const uuid = nanoid();
		const archiveName = `${dateString}-${uuid}.zip`;

		const projectDetails = {
			...selectedOption,
			userText,
			timestamp: Date.now(),
			archiveName,
		};

		zip.file("settings.json", JSON.stringify(projectDetails));
		const archive = await zip.generateAsync({ type: "blob" });
		saveAs(archive, archiveName);
	};
</script>

<style>
	.top-buffer {
		margin-top: 20px;
	}
	.bottom-buffer {
		margin-bottom: 20px;
	}
</style>

<Container>
	<div class="row bottom-buffer">
		<h1>code-generator</h1>
	</div>

	<div class="row">
		<Col xs="5">
			<div class="row">
				<Col>
					<UncontrolledDropdown bind:value={optionText}>
						<DropdownToggle caret style="width: 100%">
							{selectedOption ? selectedOption.text : 'select code'}
						</DropdownToggle>
						<DropdownMenu style={{ width: '100%' }}>
							{#each codeOptions as codeOption, i}
								<DropdownItem
									on:click={() => {
										codeOptionIndex = i;
										selectedOption = codeOption;
									}}>
									{codeOption.text}
								</DropdownItem>
							{/each}
						</DropdownMenu>
					</UncontrolledDropdown>
				</Col>
			</div>
			<div class="row  top-buffer">
				<Col>
					<Button
						block
						on:click={setCodeUrl}
						disabled={selectedOption === null || userText.length === 0}
						color="primary">
						encode
					</Button>
				</Col>
				<Col>
					<Button
						block
						on:click={downloadFiles}
						disabled={codeUrls.length === 0}
						color="success">
						download
					</Button>
				</Col>
			</div>

			<div class="row top-buffer">
				<Col>
					<div class="row">
						<Input
						type="textarea"
						style="height: 400px;resize: none"
						bind:value={userText}
						/>
					</div>

					

					<div class="row top-buffer">
						<Button
							block
							on:click={() => {userText = loremIpsum}}
							>
							fill with placeholder text
						</Button>
					</div>

					{#if selectedOption !== null}
					{#if selectedOption.capacity < userText.length}
					
					<div class="row top-buffer">
					<Alert color='primary'>
						<h4 class="alert-heading text-capitalize">exceeding code cacacity</h4>
						Code capacity too small. Text will be split across
						 multiple codes.
						Capacity: {selectedOption.capacity}
						Textlength: {userText.length}
					  </Alert>
					  
					</div>
					
								{/if}
								{/if}
			</Col>
			</div>
		</Col>
		<Col xs="7">
			{#each codeUrls as url, i}
				<div class={i === 0 ? 'row' : 'row top-buffer'}>
					<img src={url} alt={i} />
				</div>
			{/each}
		</Col>
	</div>
</Container>
