<script lang="ts">

</script>

<div class="mode-toggle noselect flex flex-row justify-center">
	<h6 class="label-light text-sm pr-3 self-center">Light</h6>
	<div class="toggle-switch"></div>
	<h6 class="label-dark text-sm pl-3 self-center">Dark</h6>
</div>

<style>
   .toggle-switch {
        width:48px;
        height:24px;
        border:none;
        outline:none;
        overflow:hidden;
        position:relative;
        border-radius:14px;
        display:inline-block;
        background:gray;
    }

    .toggle-switch:before {
        top:4px;
        left:24px;
        content:"";
        width:20px;
        height:20px;
        display:block;
        position:absolute;
        border-radius:12px;
        background:white;
    }
    .toggle-switch:before {
        left:4px;
        background:var(--gray-35);
    }
    .toggle-switch:after {
        content:"";
        top:14px;
        right:2px;
        width:1px;
        height:1px;
        display:block;
        position:absolute;
        border-radius:0.5px;
        background:white;
    }
    .toggle-switch:after {
        top:-2px;
        right:2px;
        width:32px;
        height:32px;
        border-radius:16px;
        background:white;
    }
    .toggle-switch:hover,
    .toggle-switch:hover:after {
        background:var(--gray-35);
    }
    .toggle-switch:focus,
    .toggle-switch:active,
    .toggle-switch:active:after {
        background:var(--gray-25);
    }
    .toggle-switch:hover,
    .toggle-switch:hover:after {
        background:var(--gray-95);
    }
    .toggle-switch:focus,
    .toggle-switch:active,
    .toggle-switch:active:after {
        background:var(--gray-65);
    }
    .noselect {
        user-select:none;
        -ms-user-select:none;
        -moz-user-select:none;
        -webkit-user-select:none;
    }
</style>