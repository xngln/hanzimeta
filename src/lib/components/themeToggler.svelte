<script lang="ts">
    import { theme } from "$lib/store";

    function setTheme(newTheme) {
        theme.set(newTheme);
    }
</script>

<div class="mode-toggle noselect flex flex-row justify-center">
	<button class="label-dark text-sm pr-3 self-center" on:click|preventDefault={() => setTheme('dark')}>Dark</button>
	<div class="toggle-switch relative">
        <!-- <div class="absolute toggle rounded-full h-[18px] w-[18px] top-[2px] left-[3px]"></div> -->
        <div class="absolute toggle rounded-full h-[18px] w-[18px] top-[2px] left-[3px]"></div>
    </div>
	<button class="label-light text-sm pl-3 self-center" on:click|preventDefault={() => setTheme('light')}>Light</button>
</div>

<style>
   .toggle-switch {
        width:40px;
        height:22px;
        border:none;
        outline:none;
        overflow:hidden;
        position:relative;
        border-radius:14px;
        display:inline-block;
        background:gray;
    }
</style>