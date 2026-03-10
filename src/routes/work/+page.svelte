<!-- src/routes/projects/+page.svelte -->
<script>
    import { projects as allProjects } from './projects.js';
    import { stories as allStories } from './stories.js';

    const projects = allProjects.filter((p) => p.is_displayed);
</script>

<main class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-5xl font-bold">Work</h1>
    <p class="text-lg text-gray-600 mt-4">
        A selection of published work, often involving some combination of tech, data, and journalism.
    </p>

    <h2 class="text-2xl font-bold mt-8 space-y-3">Data projects</h2>
    <p class="text-lg text-gray-600">Interactives, visualization, and data engineering</p>
    <!-- <ul class="mt-8 space-y-3">
        <li><a href="/projects/dataviz-demo">Dataviz demo</a> — Map (Leaflet) + D3 bar and line charts</li>
        <li><a href="/projects/colorado-snowpack">Colorado Snowpack</a></li>
    </ul> -->


    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 space-y-3">
        {#each projects as project}
        <a href="/work/{project.slug}" class="card-link">
          <article class="bg-white rounded-lg shadow-md overflow-hidden">
            {#if project.image}
              <img src={project.image.startsWith('http') ? project.image : `/${project.image}`} alt={project.title} class="w-full h-48 object-cover" />
            {/if}
            <div class="p-6">
              <h2 class="text-xl font-semibold mb-2">{project.title}</h2>
              <p class="text-gray-600 mb-4">{project.description}</p>
              <div class="flex flex-wrap gap-2">
                {#each project.tags || [] as tag}
                  <span class="px-2 py-1 bg-blue text-sm rounded">
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
          </article>
        </a>
        {/each}
    </div>


    <!-- <hr class="py-10"> -->
    <h2 class="text-2xl font-bold mt-20" id="newswriting">Newswriting</h2>
    <p class="text-lg text-gray-600">News stories and enterprise projects</p>
    
    <ul class="mt-8 space-y-3">
        {#each allStories as story}
        <li class="story-item mb-8">
            <a href={story.url} target="_blank"><p class="">{story.headline} ↗</p></a>
            <p>{story.description}</p>
        </li>
        {/each}

    </ul>
</main>