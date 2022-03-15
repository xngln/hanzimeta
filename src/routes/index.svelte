<script lang="ts">
    import { createClient, setClient, operationStore, query } from '@urql/svelte';

    const client = createClient({
        url: String(import.meta.env.VITE_GQL_API_URL),
    });

    setClient(client);

    let first = 30;
    let hzQuery = operationStore(`
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

    query(hzQuery)
</script>
<div>
    <div class="my-5">
        <h1 class="text-center text-2xl">
            hanzimeta
        </h1>
    </div>

    {#if $hzQuery.fetching}
    <p>Loading...</p>
    {:else}
    <div class="flex place-content-evenly mb-10">
        <table class="table-auto border-collapse border">
            <thead>
                <tr>
                    <th class="border">hanzi</th>
                    <th class="border">pinyin</th>
                    <th class="border">traditional</th>
                    <th class="border">kanji</th>
                    <th class="border">general standard #</th>
                    <th class="border">frequency rank</th>
                    <th class="border">hsk level</th>
                </tr>
            </thead>
            <tbody class="overflow-auto">
                {#each $hzQuery.data.hanziConnection.edges as edge}
                    <tr>
                        <td class="border">{edge.node.simplified}</td>
                        <td class="border">{edge.node.pinyin}</td>
                        <td class="border">{edge.node.traditional}</td>
                        <td class="border">{edge.node.japanese}</td>
                        <td class="border">{edge.node.gsNum}</td>
                        <td class="border">{edge.node.jundaFreq}</td>
                        <td class="border">{edge.node.hskLvl}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    {/if}
</div>

<style>

</style>
