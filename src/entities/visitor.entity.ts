import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  date: string;
}
