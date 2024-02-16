import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('media_pkey', ['id'], { unique: true })
@Entity('media', { schema: 'public' })
export class Media {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'public_id',
    nullable: true,
  })
  publicId: string | null;

  @Column('character varying', { name: 'url', nullable: true })
  url: string | null;
}
