import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type UserDocument = HydratedDocument<User> & {
    _id: Types.ObjectId;
    id: string;
  };

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  displayName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
