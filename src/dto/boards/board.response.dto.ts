import { board } from "../../types/board.type";

export class BoardResponseDto {
  id: number;
  writer: string;
  title: string;
  subTitle: string;
  content: string;
  subContent: string;
  thumbnail: string;
  category: string;
  workdate: string;
  viewCount: number;

  constructor(data: board) {
    this.id = data.id;
    this.writer = data.writer;
    this.title = data.title;
    this.subTitle = data.subTitle;
    this.content = data.content;
    this.subContent = data.subContent;
    this.thumbnail = data.thumbnail;
    this.category = data.category;
    this.workdate = data.workdate.toISOString().split("T")[0];
    this.viewCount = data.viewCount;
  }
}
