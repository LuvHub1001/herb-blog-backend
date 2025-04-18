import { Visitor } from "../../types/visitor.type";

export class VisitorResponseDto {
  id: number;
  ip: string;
  date: string;

  constructor(visitor: Visitor) {
    this.id = visitor.id;
    this.ip = visitor.ip;
    this.date = visitor.date;
  }
}
