import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  writer: string;

  @Column()
  title: string;

  @Column()
  subTitle: string;

  @Column()
  content: string;

  @Column()
  subContent: string;

  @Column()
  thumbnail: string;

  @Column()
  category: string;

  @Column()
  workdate: string;
}
