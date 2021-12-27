import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Map } from './map.entity';
import { User } from './user.entity';

export enum MarkerActive {
    Inactive = 0,
    Active = 1
}

@Entity('marker')
export class Marker {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'integer'})
    user_id: number;

    @Column({ type: 'integer'})
    map_id: number;

    @Column({ type: 'varchar', length: 24 })
    name: string;

    @Column({ type: 'varchar', length: 32 })
    latitude: string;

    @Column({ type: 'varchar', length: 32 })
    longitude: string;

    @Column({ type: 'integer', default: MarkerActive.Active })
    active: MarkerActive;

    @ManyToOne(() => User)
    @JoinColumn({'name': 'user_id'})
    user?: User

    @ManyToOne(() => Map)
    @JoinColumn({'name': 'map_id'})
    map?: Map
}