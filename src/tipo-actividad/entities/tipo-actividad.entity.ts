import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Notas } from '../../notas/entities/nota.entity';


@Entity('tipo_actividades')
export class TipoActividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relación 1:1 con Notas
  @ManyToOne(() => Notas, (nota) => nota.tiposActividad)
@JoinColumn({ name: 'idNota' })
nota: Notas;
}