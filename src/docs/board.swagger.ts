/**
 * @swagger
 * tags:
 *   name: Board
 *   description: 게시판 관련 API
 */

/**
 * @swagger
 * /api/boards/{page}/{limit}:
 *   get:
 *     summary: 1페이지에 limit개 만큼의 게시글 조회
 *     tags: [Board]
 *     parameters:
 *       - name: page
 *         in: path
 *         required: true
 *         description: 페이지 번호
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: path
 *         required: true
 *         description: 몇 개의 게시글까지 조회할 건지
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   writer:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subTitle:
 *                     type: string
 *                   content:
 *                     type: string
 *                   subContent:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *                   category:
 *                     type: string
 *                   workdate:
 *                     type: string
 *                     format: date-time
 *               example:
 *                 - id: 1
 *                   writer: "LuvHub"
 *                   title: "테스트용 TITLE"
 *                   subTitle: "테스트용 SUBTITLE"
 *                   content: "테스트용 CONTENT"
 *                   subContent: "테스트용 SUBCONTNET"
 *                   thumbnail: "https://herb-image-server.s3.ap-northeast-2.amazonaws.com/uploads/sample1.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-11T06:40:12.673Z"
 */

/**
 * @swagger
 * /api/boards/{category}/{page}/{limit}:
 *   get:
 *     summary: "카테고리에 맞는 게시글 전체 조회"
 *     tags: [Board]
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         description: 게시글 카테고리
 *         schema:
 *           type: string
 *           example: "til"
 *       - name: page
 *         in: path
 *         required: true
 *         description: 페이지 번호
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: path
 *         required: true
 *         description: 페이지당 게시글 수
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   writer:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subTitle:
 *                     type: string
 *                   content:
 *                     type: string
 *                   subContent:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *                   category:
 *                     type: string
 *                   workdate:
 *                     type: string
 *                     format: date-time
 *               example:
 *                 - id: 1
 *                   writer: "LuvHub"
 *                   title: "테스트용 TITLE"
 *                   subTitle: "테스트용 SUBTITLE"
 *                   content: "테스트용 CONTENT"
 *                   subContent: "테스트용 SUBCONTNET"
 *                   thumbnail: "https://herb-image-server.s3.ap-northeast-2.amazonaws.com/uploads/sample1.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-11T06:40:12.673Z"
 *                 - id: 2
 *                   writer: "DevUser"
 *                   title: "Vue.js 학습 내용 정리"
 *                   subTitle: "컴포넌트 및 라우터 기본"
 *                   content: "Vue 컴포넌트 구조 및 라우터 설정 방법 정리..."
 *                   subContent: "상세 내용은 블로그 참고"
 *                   thumbnail: "https://example.com/uploads/vue.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-10T09:15:45.000Z"
 *                 - id: 3
 *                   writer: "CodeMaster"
 *                   title: "NestJS Swagger 설정 가이드"
 *                   subTitle: "Swagger 문서화 완전정복"
 *                   content: "Swagger 데코레이터와 설정 팁 공유"
 *                   subContent: "API 문서 자동화로 개발 효율 향상"
 *                   thumbnail: "https://example.com/uploads/swagger.jpg"
 *                   category: "dev"
 *                   workdate: "2025-04-09T12:00:00.000Z"
 *                 - id: 4
 *                   writer: "JinTech"
 *                   title: "React 성능 최적화 팁"
 *                   subTitle: "불필요한 렌더링 줄이기"
 *                   content: "useMemo, useCallback 활용 방법과 실전 팁"
 *                   subContent: "이 글을 통해 성능 이슈 해결!"
 *                   thumbnail: "https://example.com/uploads/react.jpg"
 *                   category: "dev"
 *                   workdate: "2025-04-08T08:30:00.000Z"
 */

/**
 * @swagger
 * /api/boards/detail/{id}:
 *   get:
 *     summary: id에 맞는 게시글 조회
 *     tags: [Board]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 게시글 인덱스
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   writer:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subTitle:
 *                     type: string
 *                   content:
 *                     type: string
 *                   subContent:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *                   category:
 *                     type: string
 *                   workdate:
 *                     type: string
 *                     format: date-time
 *               example:
 *                 - id: 1
 *                   writer: "LuvHub"
 *                   title: "테스트용 TITLE"
 *                   subTitle: "테스트용 SUBTITLE"
 *                   content: "테스트용 CONTENT"
 *                   subContent: "테스트용 SUBCONTNET"
 *                   thumbnail: "https://herb-image-server.s3.ap-northeast-2.amazonaws.com/uploads/sample1.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-11T06:40:12.673Z"
 */

/**
 * @swagger
 * /api/boards/main-recent:
 *   get:
 *     summary: 메인용 최신글 4개 조회
 *     tags: [Board]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   writer:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subTitle:
 *                     type: string
 *                   content:
 *                     type: string
 *                   subContent:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *                   category:
 *                     type: string
 *                   workdate:
 *                     type: string
 *                     format: date-time
 *               example:
 *                 - id: 1
 *                   writer: "LuvHub"
 *                   title: "테스트용 TITLE"
 *                   subTitle: "테스트용 SUBTITLE"
 *                   content: "테스트용 CONTENT"
 *                   subContent: "테스트용 SUBCONTNET"
 *                   thumbnail: "https://herb-image-server.s3.ap-northeast-2.amazonaws.com/uploads/sample1.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-11T06:40:12.673Z"
 *                 - id: 2
 *                   writer: "DevUser"
 *                   title: "Vue.js 학습 내용 정리"
 *                   subTitle: "컴포넌트 및 라우터 기본"
 *                   content: "Vue 컴포넌트 구조 및 라우터 설정 방법 정리..."
 *                   subContent: "상세 내용은 블로그 참고"
 *                   thumbnail: "https://example.com/uploads/vue.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-10T09:15:45.000Z"
 *                 - id: 3
 *                   writer: "CodeMaster"
 *                   title: "NestJS Swagger 설정 가이드"
 *                   subTitle: "Swagger 문서화 완전정복"
 *                   content: "Swagger 데코레이터와 설정 팁 공유"
 *                   subContent: "API 문서 자동화로 개발 효율 향상"
 *                   thumbnail: "https://example.com/uploads/swagger.jpg"
 *                   category: "dev"
 *                   workdate: "2025-04-09T12:00:00.000Z"
 *                 - id: 4
 *                   writer: "JinTech"
 *                   title: "React 성능 최적화 팁"
 *                   subTitle: "불필요한 렌더링 줄이기"
 *                   content: "useMemo, useCallback 활용 방법과 실전 팁"
 *                   subContent: "이 글을 통해 성능 이슈 해결!"
 *                   thumbnail: "https://example.com/uploads/react.jpg"
 *                   category: "dev"
 *                   workdate: "2025-04-08T08:30:00.000Z"
 */

/**
 * @swagger
 * /api/boards/main-til:
 *   get:
 *     summary: 메인용 카테고리가 til인 글 4개 조회
 *     tags: [Board]
 *     responses:
 *       200:
 *         description: 성공
  *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   writer:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subTitle:
 *                     type: string
 *                   content:
 *                     type: string
 *                   subContent:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *                   category:
 *                     type: string
 *                   workdate:
 *                     type: string
 *                     format: date-time
 *               example:
 *                 - id: 1
 *                   writer: "LuvHub"
 *                   title: "테스트용 TITLE"
 *                   subTitle: "테스트용 SUBTITLE"
 *                   content: "테스트용 CONTENT"
 *                   subContent: "테스트용 SUBCONTNET"
 *                   thumbnail: "https://herb-image-server.s3.ap-northeast-2.amazonaws.com/uploads/sample1.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-11T06:40:12.673Z"
 *                 - id: 2
 *                   writer: "DevUser"
 *                   title: "Vue.js 학습 내용 정리"
 *                   subTitle: "컴포넌트 및 라우터 기본"
 *                   content: "Vue 컴포넌트 구조 및 라우터 설정 방법 정리..."
 *                   subContent: "상세 내용은 블로그 참고"
 *                   thumbnail: "https://example.com/uploads/vue.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-10T09:15:45.000Z"
 *                 - id: 3
 *                   writer: "CodeMaster"
 *                   title: "NestJS Swagger 설정 가이드"
 *                   subTitle: "Swagger 문서화 완전정복"
 *                   content: "Swagger 데코레이터와 설정 팁 공유"
 *                   subContent: "API 문서 자동화로 개발 효율 향상"
 *                   thumbnail: "https://example.com/uploads/swagger.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-09T12:00:00.000Z"
 *                 - id: 4
 *                   writer: "JinTech"
 *                   title: "React 성능 최적화 팁"
 *                   subTitle: "불필요한 렌더링 줄이기"
 *                   content: "useMemo, useCallback 활용 방법과 실전 팁"
 *                   subContent: "이 글을 통해 성능 이슈 해결!"
 *                   thumbnail: "https://example.com/uploads/react.jpg"
 *                   category: "til"
 *                   workdate: "2025-04-08T08:30:00.000Z"

 */

/**
 * @swagger
 * /api/boards/main-diary:
 *   get:
 *     summary: 메인용 카테고리가 diary인 글 4개 조회
 *     tags: [Board]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   writer:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subTitle:
 *                     type: string
 *                   content:
 *                     type: string
 *                   subContent:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *                   category:
 *                     type: string
 *                   workdate:
 *                     type: string
 *                     format: date-time
 *               example:
 *                 - id: 1
 *                   writer: "LuvHub"
 *                   title: "테스트용 TITLE"
 *                   subTitle: "테스트용 SUBTITLE"
 *                   content: "테스트용 CONTENT"
 *                   subContent: "테스트용 SUBCONTNET"
 *                   thumbnail: "https://herb-image-server.s3.ap-northeast-2.amazonaws.com/uploads/sample1.jpg"
 *                   category: "diary"
 *                   workdate: "2025-04-11T06:40:12.673Z"
 *                 - id: 2
 *                   writer: "DevUser"
 *                   title: "Vue.js 학습 내용 정리"
 *                   subTitle: "컴포넌트 및 라우터 기본"
 *                   content: "Vue 컴포넌트 구조 및 라우터 설정 방법 정리..."
 *                   subContent: "상세 내용은 블로그 참고"
 *                   thumbnail: "https://example.com/uploads/vue.jpg"
 *                   category: "diary"
 *                   workdate: "2025-04-10T09:15:45.000Z"
 *                 - id: 3
 *                   writer: "CodeMaster"
 *                   title: "NestJS Swagger 설정 가이드"
 *                   subTitle: "Swagger 문서화 완전정복"
 *                   content: "Swagger 데코레이터와 설정 팁 공유"
 *                   subContent: "API 문서 자동화로 개발 효율 향상"
 *                   thumbnail: "https://example.com/uploads/swagger.jpg"
 *                   category: "diary"
 *                   workdate: "2025-04-09T12:00:00.000Z"
 *                 - id: 4
 *                   writer: "JinTech"
 *                   title: "React 성능 최적화 팁"
 *                   subTitle: "불필요한 렌더링 줄이기"
 *                   content: "useMemo, useCallback 활용 방법과 실전 팁"
 *                   subContent: "이 글을 통해 성능 이슈 해결!"
 *                   thumbnail: "https://example.com/uploads/react.jpg"
 *                   category: "diary"
 *                   workdate: "2025-04-08T08:30:00.000Z"
 */

/**
 * @swagger
 * /api/boards:
 *   post:
 *     summary: 게시글 생성
 *     tags: [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               writer:
 *                 type: string
 *                 example: "LuvHub"
 *               title:
 *                 type: string
 *                 example: "테스트용 TITLE"
 *               subTitle:
 *                 type: string
 *                 example: "테스트용 SUBTITLE"
 *               content:
 *                 type: string
 *                 example: "테스트용 CONTENT"
 *               subContent:
 *                 type: string
 *                 example: "테스트용 SUBCONTENT"
 *               thumbnail:
 *                 type: string
 *                 example: "https://example.com/uploads/sample.jpg"
 *               category:
 *                 type: string
 *                 example: "til"
 *     responses:
 *       201:
 *         description: 게시글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 writer:
 *                   type: string
 *                   example: "LuvHub"
 *                 title:
 *                   type: string
 *                   example: "테스트용 TITLE"
 *                 subTitle:
 *                   type: string
 *                   example: "테스트용 SUBTITLE"
 *                 content:
 *                   type: string
 *                   example: "테스트용 CONTENT"
 *                 subContent:
 *                   type: string
 *                   example: "테스트용 SUBCONTENT"
 *                 thumbnail:
 *                   type: string
 *                   example: "https://example.com/uploads/sample.jpg"
 *                 category:
 *                   type: string
 *                   example: "til"
 *                 workdate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-14T12:00:00.000Z"
 *       500:
 *         description: 서버 오류 (게시글 생성 실패)
 */
