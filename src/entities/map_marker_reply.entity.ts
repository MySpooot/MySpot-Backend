import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

    @CreateDateColumn({ type: 'integer' })
    created: Date;

    @UpdateDateColumn({ type: 'integer' })
    modified: Date;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'integer' })
    marker_id: number;

    @Column({ type: 'varchar', length: 64 })
    message: string;

    @Column({ type: 'integer', default: MapMarkerReplyActive.Active })
    active: MapMarkerReplyActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @ManyToOne(() => Marker)
    @JoinColumn({ name: 'marker_id' })
    marker?: Marker;
}
