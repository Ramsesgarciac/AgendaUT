import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Actividades } from '../../actividades/entities/actividade.entity';


@Entity('documentos')
export class Documentos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  tipoDoc: string;

  @Column({ type: 'longblob', nullable: true })
  archivo: Buffer | null;

  // Relación N:1 con Actividades
  @ManyToOne(() => Actividades, (actividad) => actividad.documentos)
  @JoinColumn({ name: 'idActividades' })
  actividad: Actividades;
}