import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test_chanhee')
export class ChanHee {
    @PrimaryGeneratedColumn('increment', { type: 'integer', unsigned: true })
    id: number;
    
    @Column({type: 'varchar', length: 24})
    name: string
}