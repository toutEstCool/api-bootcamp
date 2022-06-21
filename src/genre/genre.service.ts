import {
	Injectable,
	NotAcceptableException,
	NotFoundException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CreateGenreDto } from './dto/createGenre.dto'
import { GenreModel } from './genre.model'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	async bySlug(slug: string) {
		return this.GenreModel.findOne({ slug }).exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}
		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
					{
						description: new RegExp(searchTerm, 'i'),
					},
				],
			}
			return this.GenreModel.find(options).select('-updatedAt -_v').sort({
				createdAt: 'desc',
			})
		}
	}

	async getCollections() {
		const genres = await this.getAll()
		const collections = genres
		/*Need will write */
		return collections
	}

	// Admin place

	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id)

		if (!genre) throw new NotAcceptableException('Genre not found')

		return genre
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		}

		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateDoc = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Genre not found')

		return updateDoc
	}

	async getCount() {
		return this.GenreModel.find().count().exec()
	}

	async delete(id: string) {
		const updateDoc = await this.GenreModel.findByIdAndDelete(id).exec()

		if (!updateDoc) throw new NotFoundException('Genre not found')

		return updateDoc
	}
}
