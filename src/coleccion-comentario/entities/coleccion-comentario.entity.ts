// src/coleccion-comentarios/entities/coleccion-comentario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Comentarios } from '../../comentarios/entities/comentario.entity';

@Entity('colecciones_comentarios')
export class ColeccionComentarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  @OneToMany(() => Comentarios, comentario => comentario.coleccion)
  comentarios: Comentarios[];
}