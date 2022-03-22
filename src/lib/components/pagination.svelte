<script lang="ts">
import { createEventDispatcher } from "svelte";


    export let hasNextPage;
    export let hasPrevPage;
    export let currPage;

    const dispatch = createEventDispatcher();
    function nextPage() {
        dispatch('nextpage');
    }
    function prevPage() {
        dispatch('prevpage');
    }
    function gotoPage(event) {
        if (event.key !== "Enter") {
            return;
        }
        dispatch('gotopage', {
            page: currPage,
        });
    }
</script>

<div class="inline-flex justify-center space-x-1">
<button disabled={!hasPrevPage} on:click={prevPage} class="disabled:opacity-0 inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
</button>

<input type="number" on:keydown={gotoPage} class="w-12 p-0 text-xs font-medium text-center border border-gray-100 rounded no-spinners" min="1" bind:value={currPage} />

<button disabled={!hasNextPage} on:click={nextPage} class="disabled:opacity-0 inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
    </svg>
</button>
</div>

<style>
    .no-spinners {
      -moz-appearance: textfield;
    }
  
    .no-spinners::-webkit-outer-spin-button,
    .no-spinners::-webkit-inner-spin-button {
      margin: 0;
      -webkit-appearance: none;
    }
</style>