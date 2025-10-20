import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Area } from '../../area/entities/area.entity';

@Entity('tipo_areas')
export class TipoArea {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    // Relación 1:N con Area
    @OneToMany(() => Area, (area) => area.tipoArea)
    areas: Area[];
}
