import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Area } from '../../area/entities/area.entity';
import { TipoActividad } from '../../tipo-actividad/entities/tipo-actividad.entity';

@Entity('notas')
export class Notas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  nota: string;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  // Relación N:1 con Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.notas)
  @JoinColumn({ name: 'idUserCreate' })
  userCreate: Usuario;

  // Relación N:1 con Area
  @ManyToOne(() => Area, (area) => area.notas)
  @JoinColumn({ name: 'idArea' })
  area: Area;

  // Relación 1:N con TipoActividad
  @ManyToMany(() => TipoActividad, (tipoActividad) => tipoActividad.notas)
  @JoinTable({
    name: 'notas_tipo_actividades', // nombre de la tabla de unión
    joinColumn: {
      name: 'nota_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tipo_actividad_id',
      referencedColumnName: 'id',
    },
  })
  tiposActividad: TipoActividad[];
}