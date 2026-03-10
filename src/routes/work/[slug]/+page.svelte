<script>
    import { page } from '$app/stores';
    import Lightbox from '$lib/Lightbox.svelte';

    let { data } = $props();
    let lightboxIndex = $state(null);

    let allImages = $derived(
        (data.project.photografs || []).map((p) => ({ src: p.image, alt: p.alt ?? '' }))
    );
    let current_url = $page.url.pathname;
    let urlParts = current_url.split('/').filter(Boolean);

    let urlPaths = []
    let accumulatedPath = ""
    urlParts.forEach(element => {
      accumulatedPath = accumulatedPath + "/" + element
      urlPaths.push(accumulatedPath)
    });


    let breadcrumbs = [];
    urlParts.forEach((p, index) => {
      breadcrumbs.push(
        {
          label: p,
          url: urlPaths[index]
        }
      )
    });

</script>



<main class="max-w-6xl mx-auto px-4 py-8">

  <p class="mb-5"> 
  {#each breadcrumbs as bc, i}
  /  
  {#if i < breadcrumbs.length - 1}
      <a href={bc.url} class="mr-2">{bc.label}</a> 
    {:else}
     {bc.label}
    {/if}
  {/each}
  </p>


  <div class="project-heade flex max-h-32 rounded-lg mt-12 mb-8">
    <img class="object-cover object-center grow rounded-lg" src="../{data.project.image}" alt={data.project.description}>
  </div>

    <h1 class="text-5xl font-bold">{data.project.title}</h1>
    <p class="text-lg text-gray-600 mt-4">{data.project.description} <a href={data.project.url} target="_blank" rel="noopener noreferrer" class="">View Project ↗</a></p>
    {#if data.project.tags?.length}
      <div class="flex flex-wrap gap-2 mt-4">
        {#each data.project.tags as tag}
          <span class="px-2 py-1 bg-blue text-sm rounded">{tag}</span>
        {/each}
      </div>
    {/if}

    
    <h2 class="text-2xl font-bold mt-8 space-y-3">About the project</h2>
    <p>{data.project.about}</p>

    
    {#if data.project.photografs?.length}
    <div id="project-story" class="mt-12">
      {#each data.project.photografs as photograf, i (photograf) }
      {#if i % 2 === 0}
          <div class="flex flex-wrap photograf items-center">

            <div class="project-story-caption pt-12 flex-1 min-w-sm">
              <p class="text-gray-600">{photograf.graf}</p>
            </div>
            <button type="button" class="project-story-photo flex-1 min-w-sm cursor-pointer p-0 border-none bg-transparent text-left" onclick={() => lightboxIndex = i}>
              <img src={photograf.image} alt={photograf.alt}>
            </button>
          </div>
          
          {:else}
          <div class="flex flex-wrap-reverse my-30 photograf">  
            <button type="button" class="project-story-photo flex-1 min-w-sm cursor-pointer p-0 border-none bg-transparent text-left" onclick={() => lightboxIndex = i}>
              <img src={photograf.image} alt={photograf.alt}>
            </button>
            <div class="project-story-caption flex-1 pt-12 min-w-sm">
              <p class="text-right text-gray-600">{photograf.graf}</p>
            </div>
          </div>
        {/if}

      {/each}
    </div>
    {/if}

    <Lightbox images={allImages} bind:openIndex={lightboxIndex} />
</main>



<style>

.photograf {
  gap: 2rem;
}

.project-story-photo img{
  border-radius: 6px;
}

</style>