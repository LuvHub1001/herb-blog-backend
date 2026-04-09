interface VisitorData {
  id: number;
  ip: string | null;
  date: string;
}

export class VisitorResponseDto {
  id: number;
  ip: string | null;
  date: string;

  constructor(visitor: VisitorData) {
    this.id = visitor.id;
    this.ip = visitor.ip;
    this.date = visitor.date;
  }
}
