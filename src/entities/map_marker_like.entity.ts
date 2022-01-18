import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Map } from './map.entity';
import { User } from './user.entity';
import { Marker } from './marker.entity';

export enum MapMarkerLikeActive {
    Inactive = 0,
    Active = 1
}

@Entity('map_marker_like')
export class MapMarkerLike {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    modified: Date;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'integer' })
    map_id: number;

    @Column({ type: 'integer' })
    marker_id: number;

    @Column({ type: 'integer', default: MapMarkerLikeActive.Active })
    active: MapMarkerLikeActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @ManyToOne(() => Map)
    @JoinColumn({ name: 'map_id' })
    map?: Map;

    @ManyToOne(() => Marker)
    @JoinColumn({ name: 'marker_id' })
    marker?: Marker;
}
