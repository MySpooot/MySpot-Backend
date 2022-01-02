import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

export enum MapActive {
    Inactive = 0,
    Active = 1
}

@Entity('map')
export class Map {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'varchar', length: 24 })
    name: string;

    @Column({ type: 'integer', default: MapActive.Active })
    active: MapActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;
}
