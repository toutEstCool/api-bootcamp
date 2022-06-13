import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(8, {
		message: 'The password cannot be less than 8 characters',
	})
	@IsString()
	password: string

	@MinLength(3, {
		message: 'The name cannot be less than 3 characters',
	})
	@IsString()
	name: string

	@IsString()
	gitHubLink: string
}
