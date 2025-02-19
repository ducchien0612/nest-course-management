import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';



@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async findByUsername(username: string): Promise<UserDocument | null> {
        const user = await this.userModel
            .findOne({ username })
            .select('+password')
            .exec();
        return user;

    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async createUser(username: string, email: string, hashedPassword: string): Promise<User> {
        const newUser = new this.userModel({ username, email, password: hashedPassword });
        return newUser.save();
    }

    async findById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

     // Cập nhật user
  async updateUser(userId: string, updateDto: UpdateUserDto): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateDto },
      { new: true }, // trả về document đã update
    );
    if (!updatedUser) {
      throw new NotFoundException(`User not found`);
    }
    return updatedUser;
  }
}
