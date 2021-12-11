import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserLevel {
    User = 1,
    Admin = 10
}

export enum UserProvider {
    Kakao = 'kakao'
}

export enum UserActive {
    Inactive = 0,
    Active = 1
}

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'varchar', length: 12 })
    name: string;

    @Column({ type: 'integer' })
    sns_id: number; //@TODO snake_case로 수정

    @Column({ type: 'varchar', length: 128, nullable: true })
    thumbnail?: string;

    @Column({ type: 'integer', default: UserLevel.User})
    level: UserLevel

    @Column({ type: 'varchar', length: 7, default: UserProvider.Kakao })
    provider: UserProvider

    @Column({ type: 'integer', default: UserActive.Active})
    active: UserActive;
}