import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Customer')
export class Customer {
  @PrimaryGeneratedColumn()
  public customer_id: number;

  @Column({ type: 'varchar', length: 25, nullable: false, unique: true })
  public phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
  public name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
  public email: string;

  @Column({ type: 'date', nullable: true, unique: false })
  public birthday: Date;

  @Column({ type: 'char', length: 1, nullable: true, unique: false })
  public sex: string;

  @Column({ type: 'int', nullable: true, unique: false })
  public profile_image: number;

  @Column({
    type: 'char',
    length: 1,
    nullable: false,
    unique: false,
    default: '0',
  })
  public is_active: string;

  @Column({ type: 'int', nullable: true, unique: false })
  public health_info_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
  public refresh_token: string;

  @CreateDateColumn({
    type: 'datetime',
    nullable: false,
    unique: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;
}
