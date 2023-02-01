import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Player {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string

	@Column()
	region: string

	@Column()
	league_points: number

	@Column()
	win_rate: number
}