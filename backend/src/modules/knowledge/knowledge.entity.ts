import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Review } from '../review/review.entity';
import { Tag } from './tag.entity';

@Entity('knowledge')
export class Knowledge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  sourceUrl: string;

  @Column({ nullable: true })
  sourceTitle: string;

  @Column({ type: 'text', nullable: true })
  aiSummary: string;

  @Column({ type: 'simple-array', nullable: true })
  aiKeywords: string[];

  @Column({ type: 'text', nullable: true })
  userReflection: string;

  @Column({ type: 'text', nullable: true })
  aiQuestions: string;

  @Column({ type: 'json', nullable: true })
  mindmap: Record<string, any>;

  @Column({ default: 1 })
  understandingLevel: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ type: 'date', nullable: true })
  nextReviewDate: Date;

  @Column({ type: 'date', nullable: true })
  lastReviewDate: Date;

  @Column({ type: 'float', default: 2.5 })
  easeFactor: number;

  @Column({ default: 1 })
  interval: number;

  @ManyToOne(() => User, (user) => user.knowledgeItems)
  user: User;

  @OneToMany(() => Review, (review) => review.knowledge)
  reviews: Review[];

  @ManyToMany(() => Tag, (tag) => tag.knowledgeItems, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
