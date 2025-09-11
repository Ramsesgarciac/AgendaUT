import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Actividades } from '../../actividades/entities/actividade.entity';


@Entity('status')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  // Relación 1:1 con Actividades
  @OneToMany(() => Actividades, (actividad) => actividad.status)
  actividades: Actividades[]; 
}