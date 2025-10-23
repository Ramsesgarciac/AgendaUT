import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Area } from '../../area/entities/area.entity';

@Entity('jefaturas')
export class Jefatura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relación N:1 con Area
  @ManyToOne(() => Area, (area) => area.jefaturas)
  area: Area;
}
