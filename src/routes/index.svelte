<script lang="ts">
    import { onMount } from 'svelte';
    import { createClient, setClient, operationStore, query } from '@urql/svelte';

    const client = createClient({
        url: String(import.meta.env.VITE_GQL_API_URL),
    });

    setClient(client);

    // TODO: make this typed (either page or search results, something like that)
    let datasource = "page";

    let first = 30;
    let hzPage = operationStore(`
        query HanziConnection($first: Int) {
            hanziConnection(first: $first) {
                totalCount, 
                pageInfo {
                    endCursor,
                    hasNextPage
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
        { first }
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
    query(hanzi)

    $: hasNextPage = $hzPage.data?.hanziConnection.pageInfo.hasNextPage;
    $: hasPrevPage = $hzPage.data?.hanziConnection.pageInfo.hasPrevPage;

    
    function nextPage() {
        let nextCursor = $hzPage.data.hanziConnection.pageInfo.endCursor;
        console.log(nextCursor);

    }

    function prevPage() {
        console.log("prev");
    }

    function searchHanzi() {
        $hanzi.variables.searchValue = searchValue;
        $hanzi.reexecute();
        datasource = "search";
        $hanzi.data.hanzi = $hanzi.data.hanzi;
    }

    function clearSearch() {
        datasource = "page"
        searchValue = ""
    }
</script>
<div class="h-screen">
    <div class="my-5 static w-full">
        <h1 class="text-center text-2xl">
            hanzimeta
        </h1>
    </div>

    {#if $hzPage.fetching}
    <p>Loading...</p>
    {:else}
    <div class="relative flex flex-col mb-10 h-4/5 w-full">
        <form on:submit|preventDefault={searchHanzi}>
            <input bind:value={searchValue} type="text" placeholder="search" class="input input-bordered w-1/6 h-8 max-w-xs">
            <button type="submit">search</button>
        </form>
        <button on:click={clearSearch}>clear</button>
        <div class="overflow-auto overscroll-contain place-self-center w-4/5">
            <table class="table">
                <thead class="sticky top-0">
                    <tr>
                        <!-- not sure why tailwind inserts '.table th:first-child { position: sticky } if I make thead sticky' -->
                        <!-- keep this inline style here until I figure that out -->
                        <th style="position: relative">hanzi</th>
                        <th >pinyin</th>
                        <th >traditional</th>
                        <th >kanji</th>
                        <th >general standard #</th>
                        <th >frequency rank</th>
                        <th >hsk level</th>
                    </tr>
                </thead>
                <tbody>
                    {#if datasource == "page"} 
                        {#each $hzPage.data.hanziConnection.edges as edge}
                            <tr>
                                <td>{edge.node.simplified}</td>
                                <td>{edge.node.pinyin}</td>
                                <td>{edge.node.traditional}</td>
                                <td>{edge.node.japanese}</td>
                                <td>{edge.node.gsNum}</td>
                                <td>{edge.node.jundaFreq}</td>
                                <td>{edge.node.hskLvl}</td>
                            </tr>
                        {/each}
                    {:else}
                        {#each $hanzi.data.hanzi as hanzi}
                            <tr>
                                <td>{hanzi.simplified}</td>
                                <td>{hanzi.pinyin}</td>
                                <td>{hanzi.traditional}</td>
                                <td>{hanzi.japanese}</td>
                                <td>{hanzi.gsNum}</td>
                                <td>{hanzi.jundaFreq}</td>
                                <td>{hanzi.hskLvl}</td>
                            </tr>
                        {/each} 
                    {/if}
                </tbody>
            </table>
        </div>
        <div class="place-self-end mr-24">
            {#if hasPrevPage}
                <button on:click={prevPage}>prev</button>
            {/if}
            {#if hasNextPage}
                <button on:click={nextPage}>next</button>
            {/if}
        </div>
    </div>
    {/if}
</div>

<style>

</style>
