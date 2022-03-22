<script lang="ts">
    import { createClient, setClient, operationStore, query } from '@urql/svelte';
    import Search from '$lib/icons/search.svelte'
    import X from '$lib/icons/x.svelte'
    import Pagination from '$lib/components/pagination.svelte';
    import { page } from '$app/stores';

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
        $hanzi.variables.searchValue = searchValue;
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

    let hidePinyin = false;
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
                    <button id="clear-btn" disabled={!showClearIcon} class="absolute right-0 opacity-50 disabled:opacity-0" on:click|preventDefault={clearSearch}>
                        <X/>
                    </button>
                </div>

                <div class="absolute right-0">
                    <label class="label cursor-pointer">
                        <span class="label-text">hide pinyin</span> 
                        <input type="checkbox" bind:checked={hidePinyin} class="ml-2 checkbox checkbox-sm">
                    </label>
                </div>
            </form>
            <div id="table-container" class="rounded-lg border-2 overflow-auto overscroll-contain">
                <table class="table mx-auto">
                    <thead class="sticky top-0">
                        <tr>
                            <!-- not sure why tailwind inserts '.table th:first-child { position: sticky } if I make thead sticky' -->
                            <!-- keep this inline style here until I figure that out -->
                            <th style="position: relative">hanzi</th>
                            <th >freq.</th>
                            <th >G.S. #</th>
                            <th >hsk lvl</th>
                            {#if !hidePinyin}
                                <th >pinyin</th>
                            {/if}
                            <th >trad.</th>
                            <th >kanji</th>
                        </tr>
                    </thead>
                    {#if $hzPage.fetching}
                        <p>Loading...</p>
                    {:else}
                        <tbody>
                            {#if datasource == "page"} 
                                {#each $hzPage.data.hanziConnection.edges as edge}
                                    <tr>
                                        <td class="simplified">{edge.node.simplified}</td>
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
                                        {#if !hidePinyin}
                                            <td>{edge.node.pinyin}</td>
                                        {/if}
                                        <td class="traditional">{edge.node.traditional}</td>
                                        <td class="japanese">{edge.node.japanese}</td>
                                    </tr>
                                {/each}
                            {:else}
                                {#each $hanzi.data.hanzi as hanzi}
                                    <tr>
                                        <td class="simplified">{hanzi.simplified}</td>
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
                                        {#if !hidePinyin}
                                            <td>{hanzi.pinyin}</td>
                                        {/if}
                                        <td class="traditional">{hanzi.traditional}</td>
                                        <td class="japanese">{hanzi.japanese}</td>
                                    </tr>
                                {/each} 
                            {/if}
                        </tbody>
                    {/if}
                </table>
            </div>
            <div class="relative flex justify-center mt-2">
                {#if datasource == "page" && !$hzPage.fetching}
                    <div class="absolute text-xs self-center left-2 opacity-40">
                        {(pageNum-1) * first + 1} to {pageNum * first} of {$hzPage.data.hanziConnection.totalCount}
                    </div>
                {/if}
                <div>
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
    .simplified {
        @apply font-simkai;
        @apply text-2xl;
    }
    .traditional {
        @apply font-cwtexqkai;
        font-size: 1.6rem;
        line-height: 2.1rem;
    }
    .japanese {
        @apply font-kyokasho;
        font-size: 1.45rem;
        line-height: 1.95rem;
    }
    #content-container {
        display: inline-flex;
    }
    #table-container {
        max-width: 80vw;
    }
</style>