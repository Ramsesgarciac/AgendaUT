import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Actividades } from '../../actividades/entities/actividade.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';


@Entity('comentarios')
export class Comentarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  contenido: string;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  // Relación N:1 con Actividades
  @ManyToOne(() => Actividades, (actividad) => actividad.comentarios)
  @JoinColumn({ name: 'idActividad' })
  actividad: Actividades;

  // Relación N:1 con Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.comentarios)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}