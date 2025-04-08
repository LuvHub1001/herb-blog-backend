/**
 * @swagger
 * tags:
 *   name: Board
 *   description: 게시판 관련 API
 */
/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: 전체 게시글 조회
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
 *                     example: 1
 *                   writer:
 *                     type: string
 *                     example: "럽헙"
 *                   title:
 *                     type: string
 *                     example: "테스트용 제목"
 *                   subTitle:
 *                     type: string
 *                     example: "테스트용 서브 제목"
 *                   content:
 *                     type: string
 *                     example: "테스트용 내용"
 *                   subContent:
 *                     type: string
 *                     example: "테스트용 서브 내용"
 *                   thumbnail:
 *                     type: string
 *                     example: "썸네일 이미지 링크"
 *                   category:
 *                     type: string
 *                     example: "til"
 *                   workdate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-08 11:26:53"
 */

/**
 * @swagger
 * /api/boards/til:
 *   get:
 *     summary: 카테고리가 til인 게시글 조회
 *     tags: [Board]
 *     responses:
 *       200:
 *         description: 성공
 */

/**
 * @swagger
 * /api/boards/diary:
 *   get:
 *     summary: 카테고리가 diary인 게시글 조회
 *     tags: [Board]
 *     responses:
 *       200:
 *         description: 성공
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
 */
