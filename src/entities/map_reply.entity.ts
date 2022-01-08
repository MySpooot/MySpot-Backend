import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Map } from './map.entity';
import { User } from './user.entity';

export enum MapReplyActive {
    Inactive = 0,
    Active = 1
}

@Entity('map_reply')
export class MapReply {
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

    @Column({ type: 'integer' })
    like_count: number;

    @Column({ type: 'integer', default: MapReplyActive.Active })
    active: MapReplyActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @ManyToOne(() => Map)
    @JoinColumn({ name: 'map_id' })
    map?: Map;
}
