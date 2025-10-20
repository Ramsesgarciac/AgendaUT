// src/coleccion-comentarios/entities/coleccion-comentario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Comentarios } from '../../comentarios/entities/comentario.entity';
import { Actividades } from '../../actividades/entities/actividade.entity';

@Entity('colecciones_comentarios')
export class ColeccionComentarios {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  @ManyToOne(() => Actividades, (actividad) => actividad.coleccionComentarios)
  @JoinColumn({ name: 'idActividad' })
  actividad: Actividades;

  @OneToMany(() => Comentarios, comentario => comentario.coleccion)
  comentarios: Comentarios[];
}