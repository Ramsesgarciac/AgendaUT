import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Area } from '../../area/entities/area.entity';
import { Actividades } from '../../actividades/entities/actividade.entity';
import { Notas } from '../../notas/entities/nota.entity';
import { Comentarios } from '../../comentarios/entities/comentario.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  rol: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  contraseña: string;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  // Relación 1:1 con Area
  @OneToOne(() => Area, (area) => area.usuario)
  area: Area;

  // Relación 1:N con Actividades (como creador)
  @OneToMany(() => Actividades, (actividad) => actividad.userCreate)
  actividadesCreadas: Actividades[];

  // Relación 1:N con Notas
  @OneToMany(() => Notas, (nota) => nota.userCreate)
  notas: Notas[];

  // Relación 1:N con Comentarios
  @OneToMany(() => Comentarios, (comentario) => comentario.usuario)
  comentarios: Comentarios[];
}