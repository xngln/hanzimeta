<script lang="ts">
    import ThemeToggler from "$lib/components/themeToggler.svelte";
    import { charStyle } from "$lib/store"
</script>

<form
  class="relative w-auto  ml-auto mr-0 bg-white divide-y divide-gray-100 rounded-lg shadow-2xl"
  role="dialog"
  aria-label="Settings"
>
  <header class="p-3 text-center">
    <p class="font-medium">Settings</p>
  </header>

  <main class="flow-root px-4 py-3 md:px-6 h-auto">
    <div class="divide-y divide-gray-100">
      <div class="pb-3 pt-0">
        <ThemeToggler/>
      </div>

      <div class="py-3">
        <fieldset>
          <legend class="text-sm font-medium">Show/Hide Columns</legend>

          <ul class="grid gap-3 mt-3 grid-cols-2">
            <li>
              <label class="flex items-center text-sm">
                <input type="checkbox" class="w-4 h-4 border border-gray-200 rounded-md" />
                <span class="ml-3 text-xs">Pinyin</span>
              </label>
            </li>

            <li>
              <label class="flex items-center text-sm">
                <input type="checkbox" class="w-4 h-4 border border-gray-200 rounded-md" />
                <span class="ml-3 text-xs">Traditional</span>
              </label>
            </li>

            <li>
              <label class="flex items-center text-sm">
                <input type="checkbox" class="w-4 h-4 border border-gray-200 rounded-md" />
                <span class="ml-3 text-xs">Japanese</span>
              </label>
            </li>

            <li>
              <label class="flex items-center text-sm">
                <input type="checkbox" class="w-4 h-4 border border-gray-200 rounded-md" />
                <span class="ml-3 text-xs">Simplified</span>
              </label>
            </li>
          </ul>
        </fieldset>
      </div>

      <div class="pt-3 pb-1 md:pb-2">
        <fieldset>
          <legend class="text-sm font-medium">Character Style</legend>

          <div class="grid grid-cols-3 gap-3 pt-3">
            <div class="relative">
              <input class="hidden group peer" type="radio" bind:group={$charStyle} name="charStyle" value="kai" id="kai" />
              <label class="block p-3 text-xl transition-colors border border-gray-100 rounded-lg shadow-sm cursor-pointer peer-checked:border-blue-500 hover:bg-gray-50 peer-checked:ring-1 peer-checked:ring-blue-500" for="kai">
                <span class="font-simkai">字体</span>
              </label>
              <svg class="absolute w-3 h-3 text-blue-600 opacity-0 top-1 right-1 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          
            <div class="relative">
              <input class="hidden group peer" type="radio" bind:group={$charStyle} name="charStyle" value="serif" id="serif" />
              <label class="block p-3 text-lg transition-colors border border-gray-100 rounded-lg shadow-sm cursor-pointer peer-checked:border-blue-500 hover:bg-gray-50 peer-checked:ring-1 peer-checked:ring-blue-500" for="serif">
                <span class="font-notoserifsc">字体</span>
              </label>
              <svg class="absolute w-3 h-3 text-blue-600 opacity-0 top-1 right-1 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>

            <div class="relative">
              <input class="hidden group peer" type="radio" bind:group={$charStyle} name="charStyle" value="sans" id="sans" />
              <label class="block p-3 text-lg transition-colors border border-gray-100 rounded-lg shadow-sm cursor-pointer peer-checked:border-blue-500 hover:bg-gray-50 peer-checked:ring-1 peer-checked:ring-blue-500" for="sans">
                <span class="font-notosanssc font-light">字体</span>
              </label>
              <svg class="absolute w-3 h-3 text-blue-600 opacity-0 top-1 right-1 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div> 
        </fieldset>
      </div>
    </div>
  </main>
</form>