import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';
import { UserAccessibleMap } from './user_accessible_map.entity';
import { UserFavoriteMap } from './user_favorite_map.entity';

export enum MapActive {
    Inactive = 0,
    Active = 1
}

@Entity('map')
export class Map {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'integer' })
    created: Date;

    @UpdateDateColumn({ type: 'integer' })
    modified: Date;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'varchar', length: 24 })
    name: string;

    @Column({ type: 'boolean', default: true })
    is_private: boolean;

    @Column({ type: 'varchar', length: 4, nullable: true })
    code?: string;

    @Column({ type: 'integer', default: MapActive.Active })
    active: MapActive;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @OneToMany(() => UserAccessibleMap, accessible => accessible.map)
    accessible?: UserAccessibleMap[];

    @OneToMany(() => UserFavoriteMap, favoriteMap => favoriteMap.map)
    favoriteMap?: UserFavoriteMap[];
}
