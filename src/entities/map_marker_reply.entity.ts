import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Map } from './map.entity';
import { Marker } from './marker.entity';
import { User } from './user.entity';

export enum MapMarkerReplyActive {
    Inactive = 0,
    Active = 1
}

@Entity('map_marker_reply')
export class MapMarkerReply {
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

    @Column({ type: 'varchar', length: 64 })
    message: string;

    @Column({ type: 'integer', default: MapMarkerReplyActive.Active })
    active: MapMarkerReplyActive;

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
