import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Notas } from '../../notas/entities/nota.entity';

@Entity('tipo_actividades')
export class TipoActividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relación 1:1 con Notas
  @ManyToMany(() => Notas, (nota) => nota.tiposActividad)
  notas: Notas[];
}