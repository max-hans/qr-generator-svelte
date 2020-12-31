<script>
	import JSZip from "jszip";
	import { nanoid } from "nanoid";
	import { saveAs } from "file-saver";
	import dateFormat from "dateformat";

	import {
		Container,
		Button,
		Row,
		Col,
		ListGroup,
		ListGroupItem,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		UncontrolledDropdown,
		InputGroupText,
		InputGroup,
		InputGroupAddon,
		Input,
	} from "sveltestrap";

	import codeOptions from "./codeOptions";
	import { now } from "svelte/internal";

	let name = "world";
	let userText = "";
	let selectedOption = null;
	let codeOptionIndex = null;
	let codeUrl = null;

	let optionText = "";
	let dropDownIsOpen = false;

	let codeUrls = [];

	let linkElement;

	let downloadUrl, downloadFilename;

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
		codeUrls = queries;
	}

	const downloadFiles = async () => {
		const zip = new JSZip();
		const blobs = await Promise.all(
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
					<Input
						type="textarea"
						style="height: 400px;resize: none"
						bind:value={userText} />
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
