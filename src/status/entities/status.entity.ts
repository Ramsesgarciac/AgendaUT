import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { Actividades } from '../../actividades/entities/actividade.entity';


@Entity('status')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  // Relación 1:1 con Actividades
  @OneToOne(() => Actividades, (actividad) => actividad.status)
  actividad: Actividades;
}