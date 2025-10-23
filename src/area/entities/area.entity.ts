import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Actividades } from '../../actividades/entities/actividade.entity';
import { Notas } from '../../notas/entities/nota.entity';
import { TipoArea } from '../../tipo-area/entities/tipo-area.entity';
import { Jefatura } from '../../jefatura/entities/jefatura.entity';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relación N:1 con TipoArea
  @ManyToOne(() => TipoArea, (tipoArea) => tipoArea.areas)
  tipoArea: TipoArea;

  // Relación 1:1 con Usuario
  @ManyToMany(() => Usuario, (usuario) => usuario.areas)
  usuarios: Usuario[];

  // Relación 1:N con Actividades
  @OneToMany(() => Actividades, (actividad) => actividad.area)
  actividades: Actividades[];

  // Relación 1:N con Notas
  @OneToMany(() => Notas, (nota) => nota.area)
  notas: Notas[];

  // Relación 1:N con Jefatura
  @OneToMany(() => Jefatura, (jefatura) => jefatura.area)
  jefaturas: Jefatura[];
}