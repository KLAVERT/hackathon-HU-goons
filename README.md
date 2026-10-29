# Vite React Template

A template for quick-starting any React app!

<details>
<summary>Table of Contents</summary>

- [Vite React Template](#vite-react-template)
  - [🏃‍♂️ Getting started](#️-getting-started)
    - [👥 CODEOWNERS](#-codeowners)
    - [🟢 OpenAPI](#-openapi)
  - [🚀 Deployments](#-deployments)
    - [🔁 Github Workflows](#-github-workflows)
    - [🛠️ DIY](#️-diy)

</details>

## 🏃‍♂️ Getting started

To run this project, [use `bun`](https://bun.sh/):

```sh
# Install dependencies
bun install
bun run dev
```

### 👥 CODEOWNERS

[`.github/CODEOWNERS`](.github/CODEOWNERS) lists the maintainers of this template. When starting a new project, replace them with the owners of that project, or remove the file. (Also, remove this chapter).

### 🟢 OpenAPI

The API client is generated automatically on every `bun dev` and `bun run build` by the [heyapi](https://heyapi.dev/) Vite plugin. It reads the OpenAPI spec and generates typesafe types, an SDK, TanStack Query hooks and zod schemas into `src/lib/heyapi`. These files are gitignored; don't edit them.

Code generation is configured in [`vite.config.ts`](./vite.config.ts), under `heyApiPlugin`.

> ⚠️ The provided spec is an example. You should delete `openapi.yaml` and reference your own OpenAPI specification by changing the `input` of `heyApiPlugin` in `vite.config.ts`

### 💻 Editor setup

#### Code quality

Most of us [work with VSCode](https://code.visualstudio.com/) or clones thereof. Project settings are applied automatically. Make sure you've installed the [BiomeJS](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) and [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) editor extensions. They let your editor format files.  
You should find them in the "Recommended" section of the extensions tab.

If you use another editor, the same applies: make sure it understands how to format according to the Biome & prettier configs.

#### Claude

The `.claude` folder can be extended per project by specific skills, etc. See Claude docs.  
To overwrite any general settings, create a `settings.local.json` file.

## 🚀 Deployments

### 🔁 Github Workflows / Bitbucket pipeline (todo)

The provided [.github/workflows/build.yml](.github/workflows/build.yml) builds the app on pull requests to `main` and `develop`. Deploy steps are project-specific: make sure to update it to your needs.

### 🛠️ DIY

If you want to do it yourself, run the following command(s):

```sh
# Install the exact versions of each package specified in the lockfile for reproducible installs.
bun install --frozen-lockfile
# If you are deploying for production, remove the mode parameter
bun run build --mode develop
```

The app is now built in `./dist` and ready to be hosted.

> ⚠️ Note that the web app is configured to send requests to the server it's hosted on. This is to prevent CORS issues while developing our projects.
>
> In order to support this, the server must reverse proxy requests according to [the following rules in `vite.config.ts`](./vite.config.ts):
>
> ```
> "/api": "https://api.example.CHANGE_ME.com/api/v1",
> "/oauth2": "https://CHANGE_ME.exampleauthservice.com/v3/oauth2"
> ```
