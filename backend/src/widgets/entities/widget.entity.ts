import { Dashboard } from 'src/dashboards/entities/dashboard.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WidgetType = 'info' | 'top' | 'chart';

@Entity('widgets')
export class Widget {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'enum', enum: ['info', 'top', 'chart'] })
  public type: WidgetType;

  @Column()
  public x: number;

  @Column()
  public y: number;

  @Column()
  public w: number;

  @Column()
  public h: number;

  @Column({ type: 'json' })
  config: any;

  @Column()
  public dashboardId!: string;

  @ManyToOne(() => Dashboard, (dashboard: Dashboard) => dashboard.widgets)
  public dashboard!: Dashboard;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;
}
