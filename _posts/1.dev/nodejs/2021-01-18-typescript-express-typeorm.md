---
layout: post
title: 'typescript + express + typeorm 세팅'
categories: dev
tags: node.js
date: '2021-01-18 10:29:00 +0900'
image: 'https://velopert.com/wp-content/uploads/2016/02/nodejs-2560x1440-950x534.png'
published: true
---
사이드 프로젝트로 `typescript`, `typeorm` 및 `express`를 사용하여 백엔드 서버를 구축해봤습니다.

해당 포스트는 기본 설정방법에 대해 정리 겸해서 작성한 포스트 입니다.
* 데이터 베이스는 `mariadb`를 사용하였습니다.
<!--more-->

* toc
{:toc .large-only}

## typeorm
1. 프로젝트 루트 디렉토리에서 다음을 실행합니다.
```Terminal
$ yarn add typeorm mysql
```

2. 다음으로 init 명령어를 수행하여 프로젝트 기본 구조를 생성됩니다.
```terminal
$ yarn typeorm init --name MyProject --database mariadb
```

3. typeorm init을 수행하면 기존 `pakage.json` 내의 설치된 모듈들의 버전이 3.3333 과 같이 변경됩니다. 따라서 `typescript` 및 `ts-node`을 업데이트 해줍니다.
```terminal
$ yarn add typescript ts-node
```

4. ormconfig.json 폴더로 이동하여 자신의 db설정에 맞게 변경해줍니다.

## express
`express` 및 `@type/express`를 설치합니다.
```terminal
$ yarn add express @type/express @types/node
```

설치가 되었으면 `src/Server.ts` 파일을 작성합니다.
```typescript
import * as express from "express";

const PORT = 4000;

export default class Server {
  app = express();

  constructor() {
    this.setup();
  }

  setup() {
    // equip middlewares
    this.app.use(express.json());

    // insert router
    this.app.get("/", (req: express.Request, res: express.Response) => {
      res.json({ hello: "world" });
    });
  }

  start() {
    try {
      this.app.listen(PORT, () => {
        console.log("server is running");
      });
    } catch (e) {
      console.error(e);
    }
  }
}
```

다음으로 typeorm 설치시 생성된 `src/index.ts` 파일을 수정합니다.
```typescript
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import Server from "./Server";

createConnection()
  .then(async (connection) => {
    const server = new Server();
    server.start();
  })
  .catch((error) => console.log(error));
```

이제 다음 명령어를 통해 서버를 실행할 수 있습니다.
```terminal
$ yarn ts-node src/index.ts
```

정상적으로 실행되었다면 [http://localhost:4000](http://localhost:4000)에 접속하여 정상적으로 서버가 실행되었는지 확인할 수 있습니다.

## 참고
* [express](https://expressjs.com/ko/api.html)
* [typeorm](https://typeorm.io/)
