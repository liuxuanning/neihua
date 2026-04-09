import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Knowledge } from './knowledge.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Tag, (tag) => tag.children, { nullable: true })
  parent: Tag;

  @OneToMany(() => Tag, (tag) => tag.parent)
  children: Tag[];

  @ManyToMany(() => Knowledge, (knowledge) => knowledge.tags)
  knowledgeItems: Knowledge[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
