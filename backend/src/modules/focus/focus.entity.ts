import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('focus_sessions')
export class FocusSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.focusSessions)
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  knowledgeId: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({ type: 'int', default: 25 })
  plannedDuration: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  backgroundSound: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  distractions: string;

  @CreateDateColumn()
  createdAt: Date;
}
