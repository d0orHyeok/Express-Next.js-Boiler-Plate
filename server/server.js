const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' }); // 환경변수 사용
const path = require('path');

/** Create Express */
const app = express();

/** Next.js 모듈 가져오기 */
const next = require('next');
const { parse } = require('url');

/** Next.js 설정 */
const port = process.env.SERVER_PORT;
/**
 * 개발환경이아니라면 dev 옵션을 false 로 설정하고
 * 서버 시작전에 next build 를 실행해준다.
 */
const nextApp = next({ dev: true, port });
const handle = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(() => {
    /** Express Settings */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    /** static 경로 설정 */
    app.use(express.static(path.join(__dirname, '../', 'public')));

    /** Express Router Settings */
    app.use('/api', (req, res, next) => {
      res.send('hello!');
    });

    /** Next.js Routing */
    app.get('/', (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      nextApp.render(req, res, pathname, query);
    });
    app.get('*', (req, res) => {
      return handle(req, res);
    });

    app.listen(port, () => {
      console.log(`Express server listen port:${port}`);
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

module.exports = app;