import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserLevel } from '../lib/user_decorator';


export enum UserProvider {
    Kakao = 'kakao'
}

export enum UserActive {
    Inactive = 0,
    Active = 1,
    Pending = 2
}

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'varchar', length: 12 , nullable: true })
    nickname?: string;

    @Column({ type: 'integer' })
    sns_id: number;

    @Column({ type: 'varchar', length: 128, nullable: true })
    thumbnail?: string;

    @Column({ type: 'integer', default: UserLevel.User })
    level: UserLevel

    @Column({ type: 'varchar', length: 7, default: UserProvider.Kakao })
    provider: UserProvider

    @Column({ type: 'integer', default: UserActive.Pending })
    active: UserActive;
}