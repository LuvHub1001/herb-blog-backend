import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from "typeorm";

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

  @Column({ default: "" })
  subContent: string;

  @Column({ default: "" })
  thumbnail: string;

  @Column()
  category: string;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  workdate: Date;
}
