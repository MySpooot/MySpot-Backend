import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

    @CreateDateColumn({ type: 'integer' })
    created: Date;

    @UpdateDateColumn({ type: 'integer' })
    modified: Date;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'integer' })
    marker_id: number;

    @Column({ type: 'integer', default: MapMarkerLikeActive.Active })
    active: MapMarkerLikeActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @ManyToOne(() => Marker)
    @JoinColumn({ name: 'marker_id' })
    marker?: Marker;
}
