<p align="center">
  <img alt="Pilliz logo" src="docs/assets/Pilliz-logo.png" width="500"/>
</p>

<p align="center">REST API of the Pilliz App made with <a href="http://nestjs.com" target="_blank"><b>NestJS</b></a>.</p>
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
You can execute all the scripts below with: **pnpm** **_script_** or **pnpm run** **_script_**.
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
|  `docker:db:reset`  |                                   Delete the Database Service (**PostgreSQL**) and its persistent data                                    |
|    `docker:dev`     | Start the Development Server on port **8080** <br/> and <br/> Start Database related Services (if not already started) (see: `docker:db`) |
|    `docker:test`    |                                                             Launch Unit Tests                                                             |
|  `docker:test:cov`  |                                                   Launch Unit Tests and Create Coverage                                                   |
| `docker:test:watch` |                                     Launch Unit Tests watching for modification in the Git Work Tree                                      |
|    `docker:lint`    |                                Lint and Format files of the project (`docker:dev` is **required** before)                                 |
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

### Staging

|     SCRIPTS      |                DESCRIPTION                |
| :--------------: | :---------------------------------------: |
| `docker:staging` | Start the Staging Server on port **8082** |

### Prisma

⚠️ _**[dotenv-cli](docs/Setup.md)** is mandatory to execute studio, migrate or pull prisma scripts as well as a working database._

|            SCRIPTS             |                                                    DESCRIPTION                                                    | DEVELOPMENT | STAGING | PRODUCTION |
| :----------------------------: | :---------------------------------------------------------------------------------------------------------------: | :---------: | :-----: | :--------: |
|      `prisma:studio:dev`       |                        Access a simplest representation of the Development Database's data                        |     ✔️      |         |            |
|    `prisma:studio:staging`     |                          Access a simplest representation of the Staging Database's data                          |             |   ✔️    |            |
|      `prisma:studio:prod`      |                        Access a simplest representation of the Production Database's data                         |             |         |     ✔️     |
|      `prisma:migrate:dev`      |   Create migrations from the **[Prisma schema](prisma/schema.prisma)**, apply them to the Development Database    |     ✔️      |         |            |
|   `prisma:migrate:reset:dev`   |                           Delete all data present in tables of the Development Database                           |     ✔️      |         |            |
|    `prisma:migrate:staging`    |     Create migrations from the **[Prisma schema](prisma/schema.prisma)**, apply them to the Staging Database      |             |   ✔️    |            |
| `prisma:migrate:reset:staging` |                             Delete all data present in tables of the Staging Database                             |             |   ✔️    |            |
|     `prisma:migrate:prod`      |    Create migrations from the **[Prisma schema](prisma/schema.prisma)**, apply them to the Production Database    |             |         |     ✔️     |
|       `prisma:pull:dev`        |       Pull the schema from the Development Database, updating the **[Prisma schema](prisma/schema.prisma)**       |     ✔️      |         |            |
|     `prisma:pull:staging`      |         Pull the schema from the Staging Database, updating the **[Prisma schema](prisma/schema.prisma)**         |             |   ✔️    |            |
|       `prisma:pull:prod`       |       Pull the schema from the Production Database, updating the **[Prisma schema](prisma/schema.prisma)**        |             |         |     ✔️     |
|       `prisma:generate`        | Synchronize your Prisma Client with the migrations that have been made to manipulate the correct data when coding |     ✔️      |   ✔️    |     ✔️     |

See https://www.prisma.io/docs/reference/api-reference/command-reference for complete explanation about Prisma CLI.

## Database visualization

Like mentioned above in the different scripts regarding the database, you can access a visualization of the database via 2 ways:

- **pgAdmin 4** which provides a more complex and well-stocked interface to use for more complex operations and queries (see <a href="#urls">**URLs**</a>)

- **prisma:studio:dev**, **prisma:studio:staging** and **prisma:studio:prod** scripts which provides a more refine interface to use to don't worry too much about queries and make handling data easier

## URLs

### Environments:

- **Development:**
  - Pilliz API url: _http://localhost:8080/api/<a href="#versioning">**{version_number}**</a>_
  - pgAdmin 4 url: _http://localhost:8081_
- **Staging:**
  - Pilliz API url: _http://localhost:8082/api/<a href="#versioning">**{version_number}**</a>_ (to use when developing with staging database)
- **Production:**
  - Pilliz API url: **_none_**

## Versioning

Pilliz API support versioning and is currently supporting:

- **v1** -> /api/**v1**

## OpenAPI

Pilliz API **OpenAPI** documentation is available here:

- _http://localhost:8080/api/doc_ (for development server)
- _http://localhost:8082/api/doc_ (for staging server) (to use when developing with staging database)

### Files Syntax:

When creating a new file make sure to name it with the following syntax to allow **OpenAPI** to automatically document the code:

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
