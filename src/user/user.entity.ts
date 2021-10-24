import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column("text")
  role: string;

  @Column("text", { array: true, default: [] })
  refresh_tokens: string[];
}

export enum Roles {
  USER = "User",
  SALER = "Saler",
  ADMIN = "Admin",
}
