# Setup

### Prerequisites:

<br/>

**<ins>For everyone:</ins>**

<a href="http://nodejs.org" target="_blank">**Node.js**</a> version _16.18.0_ or later.

```bash
# node version
$ node -v
```

Install **dotenv-cli**.

```bash
# install dotenv-cli
$ npm install -g dotenv-cli
```

<a href="https://pnpm.io/installation#using-npm" target="_blank">**pnpm**</a> version _8.11.0_ (the latest version).
<br/>
Using **npm** to install **pnpm** is recommended but you can try other ways.

```bash
# pnpm version
$ pnpm -v
```

**pnpm** will replace **npm** for the project to install dependencies, etc...
<br/>
It is similar to **npm** in term of CLI commands.
<br/>
See https://pnpm.io/pnpm-cli and the **CLI commands** section for more information.

<a href="https://docs.docker.com/engine/install/" target="_blank">**Docker**</a> Engine version _23.0_ or later and docker compose version _2_ or later.
<br/>
Download either **Docker Desktop** (contains already **_Docker Engine_** and **_docker-compose-plugin_**).
<br/>
_or_
<br/>
Download **Docker Engine** and **docker-compose-plugin** separately.

```bash
# docker engine version
$ docker -v

# docker compose version
$ docker compose version
```

<br/>

**<ins>For backend developers:</ins>**

Install **NestJS**.

```bash
# install NestJS
$ npm i -g @nestjs/cli
```

See https://docs.nestjs.com/cli/usages for more usage of the nest CLI (e.g.: create module, controller, service, etc...)

If you are using **VSCode** there are some extensions you will need to install:

- ESLint
- Prettier - Code formatter
- Prisma

When **VSCode** is launched it should asks for installing those extensions if you didn't have them already.
<br/>
(thanks to the [extensions.json](../.vscode/extensions.json) in the .vscode folder)
