import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { Notas } from '../../notas/entities/nota.entity';


@Entity('tipo_actividades')
export class TipoActividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relación 1:1 con Notas
  @OneToOne(() => Notas, (nota) => nota.tipoActividad)
  nota: Notas;
}