import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Actividades } from '../../actividades/entities/actividade.entity';
import { Notas } from '../../notas/entities/nota.entity';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relación 1:1 con Usuario
  @OneToOne(() => Usuario, (usuario) => usuario.area)
  @JoinColumn()
  usuario: Usuario;

  // Relación 1:N con Actividades
  @OneToMany(() => Actividades, (actividad) => actividad.area)
  actividades: Actividades[];

  // Relación 1:N con Notas
  @OneToMany(() => Notas, (nota) => nota.area)
  notas: Notas[];
}