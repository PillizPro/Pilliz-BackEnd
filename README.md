<p align="center">
  ![Pilliz logo](docs/assets/Pilliz-logo)
</p>

<p align="center">REST API of the Pilliz App made with <a href="http://nestjs.com" target="_blank">NestJS</a>.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img alt="Nest Version" src="https://img.shields.io/npm/v/%40nestjs%2Fcore?label=nest"></a>
  <a href="https://pnpm.io/" target="_blank"><img alt="npm" src="https://img.shields.io/npm/v/pnpm?label=pnpm"></a>
  <a href="https://github.com/PillizPro/Pilliz-BackEnd/blob/main/LICENSE" target="_blank"><img alt="Static Badge" src="https://img.shields.io/badge/license-GPL--3.0%20license-green"></a>
  <a href="https://github.com/PillizPro/Pilliz-BackEnd" target="_blank"><img alt="Maintenance" src="https://img.shields.io/maintenance/yes/2023"></a>
</p>

## Setup

See **[Setup.md](docs/Setup.md)**

## Scripts

The **scripts** are made to make easier the writing of long commands.
<br/>
<br/>
You can execute all the scripts below with: **pnpm \***script**\*** or **pnpm run \***script**\***.
<br/>
<br/>
E.g.:
<br/>

```bash
$ pnpm docker:dev
```

or
<br/>

```bash
$ pnpm run docker:dev
```

An autocomplete is available when starting the command with **pnpm run** if you desire (see: https://pnpm.io/completion).
<br/>
<br/>
**_N.B.:_** _Starting a service that is already started doesn't do anything._

### Development

|       SCRIPTS       |                                                                DESCRIPTION                                                                |
| :-----------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|     `docker:db`     |       Start the Database Service (**PostgreSQL**) <br/> and <br/> Start the Database Admin Service (**pgAdmin 4**) on port **8081**       |
|  `docker:db:reset`  |                                            Delete the Database Service and its persistent data                                            |
|    `docker:dev`     | Start the Development Server on port **8080** <br/> and <br/> Start Database related Services (if not already started) (see: `docker:db`) |
|    `docker:test`    |                                                             Launch Unit Tests                                                             |
|  `docker:test:cov`  |                                                   Launch Unit Tests and Create Coverage                                                   |
| `docker:test:watch` |                                     Launch Unit Tests watching for modification in the Git Work Tree                                      |
|    `docker:lint`    |                                                      Launch Linting for the project                                                       |
|   `docker:clean`    |                                               Delete all Services and their persistent data                                               |
| `docker:clean:img`  |                                    Like `docker:clean` but also delete Docker images of those Services                                    |

**<ins>Case where you need to restart the Development Server:</ins>**
<br/>
<br/>
When any of the files outside **src** and **test** folders have been modified.
<br/>
E.g:

- git pull
- a <a href="#prisma">prisma script command</a> has been executed
- a new dependency is added to the package.json
- etc...

### Production

|    SCRIPTS    |                 DESCRIPTION                  |
| :-----------: | :------------------------------------------: |
| `docker:prod` | Start the Production Server on port **8080** |

### Prisma

⚠️ _<a href="#setup">**dotenv-cli**</a> is mandatory to execute migrate or pull scripts._

|        SCRIPTS         |                                                    DESCRIPTION                                                    | DEVELOPMENT | PRODUCTION |
| :--------------------: | :---------------------------------------------------------------------------------------------------------------: | :---------: | :--------: |
|  `prisma:migrate:dev`  |   Create migrations from the **[Prisma schema](prisma/schema.prisma)**, apply them to the Development Database    |     ✔️      |            |
| `prisma:migrate:reset` |                           Delete all data present in tables of the Development Database                           |     ✔️      |            |
| `prisma:migrate:prod`  |    Create migrations from the **[Prisma schema](prisma/schema.prisma)**, apply them to the Production Database    |             |     ✔️     |
|   `prisma:pull:dev`    |       Pull the schema from the Development Database, updating the **[Prisma schema](prisma/schema.prisma)**       |     ✔️      |            |
|   `prisma:pull:prod`   |       Pull the schema from the Production Database, updating the **[Prisma schema](prisma/schema.prisma)**        |             |     ✔️     |
|   `prisma:generate`    | Synchronize your Prisma Client with the migrations that have been made to manipulate the correct data when coding |     ✔️      |     ✔️     |

See https://www.prisma.io/docs/reference/api-reference/command-reference for complete explanation about Prisma CLI.

## URLs

### Environments:

- **Development:**
  - Pilliz API url: _http://localhost:8080/api/<a href="#versioning">**{version_number}**</a>_
  - pgAdmin 4 url: _http://localhost:8081_
- **Production:**
  - Pilliz API url: **_none_**

## Versioning

Pilliz API support versioning and is currently supporting:

- **v1** -> /api/**v1**

## OpenAPI

Pilliz API **OpenAPI** documentation is available here: _http://localhost:8080/api/doc_

### Files Syntax:

When creating a new file make sure to create it with the following syntax to allow **OpenAPI** to automatically document the code:

#### DTO Files:

- end with: **.dto.ts**

#### Entity Files:

- end with: **.entity.ts**

## License

Pilliz API is [GPL-3.0 licensed](LICENSE).
<br/>
<br/>
<br/>
Learn more here on Nest: **[Nest-README.md](docs/Nest-README.md)**
