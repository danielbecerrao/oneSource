import { Exclude } from 'class-transformer';
import { Dashboard } from 'src/dashboards/entities/dashboard.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity('clients')
@Unique(['username'])
export class Client {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  @Index()
  public name!: string;

  @Column()
  public username!: string;

  @Column()
  @Exclude()
  public salt!: string;

  @Column()
  @Exclude()
  public password!: string;

  @CreateDateColumn()
  private readonly createdAt!: Date;

  @UpdateDateColumn()
  private readonly updatedAt!: Date;

  @DeleteDateColumn()
  private readonly deletedAt!: Date;

  @OneToMany(() => Dashboard, (dashboard: Dashboard) => dashboard.client)
  public dashboards!: Dashboard[];

  @BeforeInsert()
  @BeforeUpdate()
  public lowerCaseUsername(): void {
    if (this.username) {
      this.username = this.username.toLowerCase().trim();
    }
  }

  public constructor(partial: Partial<Client>) {
    Object.assign(this, partial);
  }
}
