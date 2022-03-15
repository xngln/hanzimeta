<script lang="ts">
    import { onMount } from "svelte";
    import { createClient, setClient, operationStore, query } from '@urql/svelte';

    const client = createClient({
        url: String(import.meta.env.VITE_GQL_API_URL),
    });

    setClient(client);

    let first = 10;
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
                    },
                    cursor
                }
            }
        }`, 
        { first }
    );

    query(hzPage)
</script>

<h1 class="text-2xl">
    hanzimeta
</h1>
<table class="table-auto">
    <thead>
        <tr>
            <th>hanzi</th>
            <th>pinyin</th>
            <th>traditional</th>
            <th>kanji</th>
            <th>general standard #</th>
            <th>frequency rank</th>
            <th>hsk level</th>
        </tr>
    </thead>
    <tbody>
        <!-- {#each data.data.hanziConnection.edges as edge}
            <tr>
                <td>{edge.node.simplified}</td>
                <td>{row.data().pinyin}</td>
                <td>{row.data().traditional}</td>
                <td>{row.data().kanji}</td>
                <td>{row.data().gs_num}</td>
                <td>{row.data().freq}</td>
                <td>{row.data().hsk_lvl}</td>
            </tr>
        {/each} -->
    </tbody>
</table>

<style>

</style>
