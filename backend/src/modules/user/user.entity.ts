import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Knowledge } from '../knowledge/knowledge.entity';
import { FocusSession } from '../focus/focus.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  isPro: boolean;

  @Column({ type: 'date', nullable: true })
  proExpireAt: Date;

  @Column({ type: 'json', nullable: true })
  settings: Record<string, any>;

  @OneToMany(() => Knowledge, (knowledge) => knowledge.user)
  knowledgeItems: Knowledge[];

  @OneToMany(() => FocusSession, (session) => session.user)
  focusSessions: FocusSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
