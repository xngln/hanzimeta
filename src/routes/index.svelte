<script>
    import hzjson from "../../static/data/hzdata.json"
</script>

<h1>hanzimeta</h1>
<table>
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
        {#each hzjson.hanzi as row}
            <tr>
                <td>{row.simplified}</td>
                <td>{row.pinyin}</td>
                <td>{row.traditional}</td>
                <td>{row.kanji}</td>
                <td>{row.gsNum}</td>
                <td>{row.freq}</td>
                <td>{row.hskLvl}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>

</style>
