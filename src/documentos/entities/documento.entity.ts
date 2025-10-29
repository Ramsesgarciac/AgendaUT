import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Actividades } from '../../actividades/entities/actividade.entity';
import { Entrega } from '../../entrega/entities/entrega/entrega.entity';


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

  // Relación N:1 con Entrega
  @ManyToOne(() => Entrega, (entrega) => entrega.documento)
  @JoinColumn({ name: 'entregaId' })
  entrega: Entrega;
}