<script lang="ts">
    import { createClient, setClient, operationStore, query } from '@urql/svelte';
    import Search from '$lib/icons/search.svelte'
    import X from '$lib/icons/x.svelte'
    import Pagination from '$lib/components/pagination.svelte';
    import { onMount } from 'svelte';
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
</script>

<div class="h-screen">
    <div class="my-5 static w-full">
        <h1 class="text-center text-2xl">
            hanzimeta
        </h1>
    </div>

    <div class="relative flex flex-col mb-10 h-4/5 w-full">
        <form class="relative input input-bordered place-self-center mb-3 h-8 max-w-xs w-32 focus-within:ring-1" on:submit|preventDefault={searchHanzi}>
            <input bind:value={searchValue} type="text" placeholder="search" class="w-24 h-6 border-none focus:ring-0">
            <button id="search-btn" class="absolute top-0 opacity-60" type="submit"><Search/></button>
            <button id="clear-btn" class="absolute right-0 opacity-50" on:click|preventDefault={clearSearch}><X/></button>
        </form>
        <div class="overflow-auto overscroll-contain place-self-center w-4/5">
            <table class="table mx-auto">
                <thead class="sticky top-0">
                    <tr>
                        <!-- not sure why tailwind inserts '.table th:first-child { position: sticky } if I make thead sticky' -->
                        <!-- keep this inline style here until I figure that out -->
                        <th style="position: relative">hanzi</th>
                        <th >freq.</th>
                        <th >G.S. #</th>
                        <th >hsk lvl</th>
                        <th >pinyin</th>
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
                                    <td>{edge.node.simplified}</td>
                                    <td>{edge.node.jundaFreq}</td>
                                    <td>{edge.node.gsNum}</td>
                                    <td>{edge.node.hskLvl}</td>
                                    <td>{edge.node.pinyin}</td>
                                    <td>{edge.node.traditional}</td>
                                    <td>{edge.node.japanese}</td>
                                </tr>
                            {/each}
                        {:else}
                            {#each $hanzi.data.hanzi as hanzi}
                                <tr>
                                    <td>{hanzi.simplified}</td>
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
                                    <td>{hanzi.pinyin}</td>
                                    <td>{hanzi.traditional}</td>
                                    <td>{hanzi.japanese}</td>
                                </tr>
                            {/each} 
                        {/if}
                    </tbody>
                {/if}
            </table>
        </div>
        <div class="place-self-center mt-3">
            <Pagination on:nextpage={nextPage} on:prevpage={prevPage} on:gotopage={toPage} hasPrevPage={hasPrevPage} hasNextPage={hasNextPage} currPage={pageNum}/>
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
</style>