import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Knowledge } from '../knowledge/knowledge.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Knowledge, (knowledge) => knowledge.reviews)
  knowledge: Knowledge;

  @Column()
  knowledgeId: string;

  @Column({ type: 'date' })
  reviewDate: Date;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'int' })
  interval: number;

  @Column({ type: 'float' })
  easeFactor: number;

  @Column({ type: 'date' })
  nextReviewDate: Date;

  @Column({ type: 'text', nullable: true })
  userAnswer: string;

  @Column({ type: 'text', nullable: true })
  aiFeedback: string;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @CreateDateColumn()
  createdAt: Date;
}
