export class CustomerEntity {
  // @PrimaryGeneratedColumn("uuid")
  public customer_id!: string;

  // @Column({ type: "varchar", length: 25, select: true, unique: true })
  public phone_number!: string;

  // @Column({ type: 'varchar', length: 255 })
  public name!: string;

  // @Column({ type: 'varchar', length: 255 })
  public email!: string;

  // @Column({ type: 'date' })
  public birthday!: Date;

  // @Column({ type: 'char', length: 1 })
  public sex!: string;

  // @Column({ type: 'int' })
  public profile_image!: number;

  // @Column({ type: 'char', length: 1 })
  public is_active!: string;

  // @Column({ type: 'int' })
  public health_info_id!: number;

  // @Column({ type: 'varchar',length:255, nullable: true, select: false })
  public refresh_token!: string;

  //   @CreateDateColumn({
  //     type: 'timestamptz',
  //     default: () => 'CURRENT_TIMESTAMP',
  //     select: true,
  //   })
  public created_at!: Date;
}
