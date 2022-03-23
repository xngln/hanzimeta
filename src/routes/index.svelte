<script lang="ts">
	import { createClient, setClient, operationStore, query } from '@urql/svelte';
	import SearchIcon from '$lib/icons/search.svelte';
	import XIcon from '$lib/icons/x.svelte';
	import SettingsIcon from '$lib/icons/settings.svelte';
	import Pagination from '$lib/components/pagination.svelte';
	import Settings from '$lib/components/settings.svelte';
	import { page } from '$app/stores';
	import { clickOutside } from "$lib/functions/clickOutside";
    import { theme, charStyle, columns } from '$lib/store';

    theme.init();
    charStyle.init();
    columns.init();

	const client = createClient({
		url: String(import.meta.env.VITE_GQL_API_URL),
	});

	setClient(client);

	// TODO: make this typed (either page or search results, something like that)
	let datasource = "page";

	let pageNum = $page.url.searchParams.has('page') ? parseInt($page.url.searchParams.get('page')) : 1;

	let first = 30;
	let cursor = btoa("page " + pageNum);
	let hzPage = operationStore(`
		query HanziConnection($first: Int, $cursor: String) {
			hanziConnection(first: $first, after: $cursor) {
				totalCount, 
				pageInfo {
					endCursor,
					hasNextPage,
					hasPrevPage
				},
				edges {
					node {
						id,
						simplified,
						pinyin,
						traditional,
						japanese,
						gsNum,
						jundaFreq,
						hskLvl
					},
					cursor
				}
			}
		}`, 
		{ first, cursor }
	);
	query(hzPage)

	let searchValue = "";
	let hanzi = operationStore(`
		query Hanzi($searchValue: String!) {
			hanzi(character: $searchValue) {
				id,
				simplified,
				pinyin,
				traditional,
				japanese,
				gsNum,
				jundaFreq,
				hskLvl
			}
		}`,
		{ searchValue }
	)
	query(hanzi);

	$: hasNextPage = $hzPage.data?.hanziConnection.pageInfo.hasNextPage;
	$: hasPrevPage = $hzPage.data?.hanziConnection.pageInfo.hasPrevPage;
	
	function nextPage() {
		let nextCursor = $hzPage.data.hanziConnection.pageInfo.endCursor;
		$hzPage.variables.cursor = nextCursor;
		$hzPage.reexecute();
		pageNum += 1;
	}

	// TODO: implement this without offset cursor (less efficient)
	function prevPage() {
		let nextCursor = btoa("page " + (pageNum - 1))
		$hzPage.variables.cursor = nextCursor;
		$hzPage.reexecute();
		pageNum -= 1;
	}
	
	function toPage(event) {
		let nextCursor = btoa("page " + event.detail.page);
		$hzPage.variables.cursor = nextCursor;
		$hzPage.reexecute();
		pageNum = parseInt(event.detail.page);
	}

	$: pageNumBeforeSearch = pageNum;

	function searchHanzi() {
		$hanzi.variables.searchValue = searchValue.trim();
		$hanzi.reexecute();
		datasource = "search";
		$hanzi.data.hanzi = $hanzi.data.hanzi;
		pageNum = 1;
	}

	function clearSearch() {
		datasource = "page";
		searchValue = "";
		pageNum = pageNumBeforeSearch;
	}

	let hoverClearIcon = false;
	let focusClearIcon = false;
	function searchMouseOver() {
		hoverClearIcon = true;
	}
	
	function searchMouseOut() {
		hoverClearIcon = false;
	}

	function focusSearch() {
		focusClearIcon = true;
		console.log("doody")
	}

	function blurSearch() {
		focusClearIcon = false;
	}
	$: showClearIcon = hoverClearIcon || focusClearIcon;

	let showSettings = false;

	function toggleSettings() {
		showSettings = !showSettings;
	}

    function getFontClass(style, lang) {
        switch(style) {
            case "kai": {
                switch(lang) {
                    case "sc": {
                        return "font-simkai kai";
                    }
                    case "tc": {
                        return "font-cwtexqkai kai";
                    }
                    case "jp": {
                        return "font-kyokasho kai";
                    }
                }
            }
            case "sans": {
                switch(lang) {
                    case "sc": {
                        return "font-notosanssc";
                    }
                    case "tc": {
                        return "font-notosanstc";
                    }
                    case "jp": {
                        return "font-notosansjp";
                    }
                }
            }
            case "serif": {
                switch(lang) {
                    case "sc": {
                        return "font-notoserifsc";
                    }
                    case "tc": {
                        return "font-notoseriftc";
                    }
                    case "jp": {
                        return "font-notoserifjp";
                    }
                }
            }
        }
    }
</script>

<div class="h-screen">
	<div class="my-5 static w-full">
		<h1 class="text-center text-2xl">
			hanzimeta
		</h1>
	</div>

	<div class="relative h-screen flex">
		<div id="content-container" class="mx-auto relative flex flex-col h-5/6">
			<form class="w-full flex flex-row relative mb-3" on:submit|preventDefault={searchHanzi}>
				<div class="left-0 relative w-32 h-8 input input-bordered focus-within:ring-1" on:mouseover={searchMouseOver} on:mouseout={searchMouseOut}>
					<input bind:value={searchValue} type="text" placeholder="search" class="w-24 h-6 border-none focus:ring-0"
					on:focus={focusSearch} on:blur={blurSearch}>
					<button id="search-btn" class="absolute top-0 opacity-60" type="submit"><SearchIcon/></button>
					<button id="clear-btn" disabled={!showClearIcon} class="absolute right-0 opacity-50 disabled:opacity-0" on:click|preventDefault={clearSearch}>
						<XIcon/>
					</button>
				</div>
				<div use:clickOutside on:outclick={() => (showSettings = false)}>
					<button class="opacity-70 absolute right-0 bottom-0" on:click|preventDefault={toggleSettings}><SettingsIcon/></button>
					<!-- <label class="label cursor-pointer">
						<span class="label-text">hide pinyin</span> 
						<input type="checkbox" bind:checked={hidePinyin} class="ml-2 checkbox checkbox-sm">
					</label> -->
					{#if showSettings}
						<div class="z-10 absolute right-7">
							<Settings></Settings>
						</div>
					{/if}
				</div>
			</form>
			<div id="table-container" class="rounded-lg border-2 overflow-auto overscroll-contain">
				<table class="table mx-auto">
					<thead class="sticky top-0">
						<tr>
							<!-- not sure why tailwind inserts '.table th:first-child { position: sticky } if I make thead sticky' -->
							<!-- keep this inline style here until I figure that out -->
                            {#if $columns.showSC}
                                <th style="position: relative">hanzi</th>
                            {/if}
							<th >freq.</th>
							<th >G.S. #</th>
							<th >hsk lvl</th>
							{#if $columns.showPinyin}
								<th >pinyin</th>
							{/if}
                            {#if $columns.showTC}
                                <th >trad.</th>
                            {/if}
                            {#if $columns.showJP}
                                <th >kanji</th>
                            {/if}
						</tr>
					</thead>
					{#if $hzPage.fetching}
						<p>Loading...</p>
					{:else}
						<tbody>
							{#if datasource == "page"} 
								{#each $hzPage.data.hanziConnection.edges as edge}
									<tr>
                                        {#if $columns.showSC}
                                            <td class="simplified text-xl {getFontClass($charStyle, 'sc')}">{edge.node.simplified}</td>
                                        {/if}
										{#if edge.node.jundaFreq == null}
											<td>n/a</td>
										{:else}
											<td>{edge.node.jundaFreq}</td>
										{/if}
										{#if edge.node.gsNum == null}
											<td>n/a</td>
										{:else}
											<td>{edge.node.gsNum}</td>
										{/if}
										{#if edge.node.hskLvl == null}
											<td>n/a</td>
										{:else}
											<td>{edge.node.hskLvl}</td>
										{/if}
										{#if $columns.showPinyin}
											<td>{edge.node.pinyin}</td>
										{/if}
                                        {#if $columns.showTC}
                                            <td class="traditional text-xl {getFontClass($charStyle, 'tc')}">{edge.node.traditional}</td>
                                        {/if}
                                        {#if $columns.showJP}
                                            <td class="japanese text-xl {getFontClass($charStyle, 'jp')}">{edge.node.japanese}</td>
                                        {/if}
									</tr>
								{/each}
							{:else}
								{#each $hanzi.data.hanzi as hanzi}
									<tr>
                                        {#if $columns.showSC}
                                            <td class="simplified text-xl {getFontClass($charStyle, 'sc')}">{hanzi.simplified}</td>
                                        {/if}
										{#if hanzi.jundaFreq == null}
											<td>n/a</td>
										{:else}
											<td>{hanzi.jundaFreq}</td>
										{/if}
										{#if hanzi.gsNum == null}
											<td>n/a</td>
										{:else}
											<td>{hanzi.gsNum}</td>
										{/if}
										{#if hanzi.hskLvl == null}
											<td>n/a</td>
										{:else}
											<td>{hanzi.hskLvl}</td>
										{/if}
										{#if $columns.showPinyin}
											<td>{hanzi.pinyin}</td>
										{/if}
                                        {#if $columns.showTC}
                                            <td class="traditional text-xl {getFontClass($charStyle, 'tc')}">{hanzi.traditional}</td>
                                        {/if}
                                        {#if $columns.showJP}
                                            <td class="japanese text-xl {getFontClass($charStyle, 'jp')}">{hanzi.japanese}</td>
                                        {/if}
									</tr>
								{/each} 
							{/if}
						</tbody>
					{/if}
				</table>
			</div>
			<div class="relative flex justify-center mt-2">
				{#if datasource == "page" && !$hzPage.fetching}
					<div class="absolute text-xs left-2 top-1 opacity-60">
						{(pageNum-1) * first + 1} to {pageNum * first} of {$hzPage.data.hanziConnection.totalCount}
					</div>
				{/if}
				<div class="absolute right-2">
					<Pagination on:nextpage={nextPage} on:prevpage={prevPage} on:gotopage={toPage} hasPrevPage={hasPrevPage} hasNextPage={hasNextPage} currPage={pageNum}/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	#search-btn {
		top: 5px;
		left: 6px;
	}
	#clear-btn {
		top: 5px;
		right: 5px;
	}
	#content-container {
		display: inline-flex;
	}
	#table-container {
		max-width: 80vw;
	}

	.simplified.kai {
		@apply text-2xl;
	}
	.traditional.kai {
		font-size: 1.6rem;
		line-height: 2.1rem;
	}
	.japanese.kai{
		font-size: 1.45rem;
		line-height: 1.95rem;
	}
    .simplified, .traditional, .japanese {
        @apply font-light;
    }

</style>