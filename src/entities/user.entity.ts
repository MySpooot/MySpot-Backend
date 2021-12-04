import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserLevel {
    User = 1,
    Admin = 10
}

export enum UserProvider {
    Kakao = 'kakao'
}

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @Column({ type: 'varchar', length: 12 })
    nickname: string;

    @Column({ type: 'integer' })
    snsId: number;

    @Column({ type: 'varchar', length: 128, nullable: true })
    thumbnail?: string;

    @Column({ type: 'integer', unsigned: true, default: UserLevel.User})
    level: UserLevel

    @Column({ type: 'varchar', length: 7, default: UserProvider.Kakao })
    provider: UserProvider
}