import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Area } from '../../area/entities/area.entity';
import { Status } from '../../status/entities/status.entity';
import { Documentos } from '../../documentos/entities/documento.entity';
import { Comentarios } from '../../comentarios/entities/comentario.entity';
import { ColeccionComentarios } from 'src/coleccion-comentario/entities/coleccion-comentario.entity';

@Entity('actividades')
export class Actividades {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  asunto: string;

  @Column({ type: 'varchar', length: 100 })
  instanciaReceptora: string;

  @Column({ type: 'varchar', length: 100 })
  instanciaEmisora: string;

  @Column({ type: 'varchar', length: 50 })
  tipoActividad: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'timestamp' })
  fechaLimite: Date;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  // Relación N:1 con Area
  @ManyToOne(() => Area, (area) => area.actividades)
  @JoinColumn({ name: 'idArea' })
  area: Area;

  // Relación N:1 con Usuario (creador)
  @ManyToOne(() => Usuario, (usuario) => usuario.actividadesCreadas)
  @JoinColumn({ name: 'idUserCreate' })
  userCreate: Usuario;

  // Relación 1:1 con Status
  @ManyToOne(() => Status, (status) => status.actividades) // Nota el plural
  @JoinColumn({ name: 'statusId' })
  status: Status;

  // Relación 1:N con Documentos
  @OneToMany(() => Documentos, (documento) => documento.actividad)
  documentos: Documentos[];

  // Relación 1:N con Comentarios
  @OneToMany(() => Comentarios, (comentario) => comentario.actividad)
  comentarios: Comentarios[];

  @OneToMany(() => ColeccionComentarios, (coleccion) => coleccion.actividad)
  coleccionComentarios: ColeccionComentarios[];
}