import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Documentos } from '../../../documentos/entities/documento.entity';

@Entity('entregas')
export class Entrega {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    // Relación N:1 con Documentos
    @ManyToOne(() => Documentos, (documento) => documento.entrega)
    documento: Documentos;
}
