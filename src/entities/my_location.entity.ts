import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';

export enum MarkerActive {
    Inactive = 0,
    Active = 1
}

@Unique(['address_id', 'user_id'])
@Entity('my_location')
export class MyLocation {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    modified: Date;

    @Column({ type: 'varchar', length: 24 })
    name: string;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'integer' })
    address_id: number;

    @Column({ type: 'varchar', length: 128, nullable: true })
    address?: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    road_address?: string;

    @Column({ type: 'integer', default: MarkerActive.Active })
    active: MarkerActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;
}
