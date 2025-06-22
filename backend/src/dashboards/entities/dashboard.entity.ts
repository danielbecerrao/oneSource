import { Widget } from 'src/widgets/entities/widget.entity';
import { Client } from '../../clients/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('dashboards')
export class Dashboard {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public clientId!: string;

  @ManyToOne(() => Client, (client: Client) => client.dashboards)
  public client!: Client;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;

  @OneToMany(() => Widget, (widget: Widget) => widget.dashboard)
  public widgets!: Widget[];
}
