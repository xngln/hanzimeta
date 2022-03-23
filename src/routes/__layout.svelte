<script>
    import "../app.css";
</script>

<svelte:head>
    {#if String(import.meta.env.VITE_ENV) === "PRODUCTION"}
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8F4P17TTJK"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8F4P17TTJK');
        </script>
    {/if}
</svelte:head>
  
<slot />