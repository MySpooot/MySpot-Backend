import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { MapReply } from './map_reply.entity';
import { User } from './user.entity';

export enum MapReplyLikeActive {
    Inactive = 0,
    Active = 1
}

@Entity('map_reply_like')
export class MapReplyLike {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    modified: Date;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'integer' })
    map_reply_id: number;

    @Column({ type: 'integer', default: MapReplyLikeActive.Active })
    active: MapReplyLikeActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @ManyToOne(() => MapReply)
    @JoinColumn({ name: 'map_reply_id' })
    mapReply?: MapReply;
}
