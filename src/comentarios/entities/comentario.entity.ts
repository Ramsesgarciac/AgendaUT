// src/comentarios/entities/comentario.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Actividades } from '../../actividades/entities/actividade.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { ColeccionComentarios } from '../../coleccion-comentario/entities/coleccion-comentario.entity'; // Asegúrate de tener esta entidad

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

  // Relación N:1 con ColeccionComentarios (si decides usar esta entidad)
  @ManyToOne(() => ColeccionComentarios, (coleccion) => coleccion.comentarios, {
    nullable: true
  })
  @JoinColumn({ name: 'idColeccion' })
  coleccion: ColeccionComentarios;
}