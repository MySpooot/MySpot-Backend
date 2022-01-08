import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';

export enum MapActive {
    Inactive = 0,
    Active = 1
}

export enum IsMapPublic {
    Private = 0,
    Public = 1
}

@Entity('map')
export class Map {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    modified: Date;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'varchar', length: 24 })
    name: string;

    @Column({ type: 'integer', default: IsMapPublic.Public })
    is_public: IsMapPublic;

    @Column({ type: 'integer', default: MapActive.Active })
    active: MapActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;
}
