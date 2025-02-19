import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';


export type EnrollmentDocument = HydratedDocument<Enrollment> & {
    _id: Types.ObjectId;
    id: string;
};

@Schema()
export class Enrollment {
    // Lưu _id của user (Mongo)
    @Prop({ required: true })
    userId: string;

    // Lưu id (number) của course (MySQL)
    @Prop({ required: true })
    courseId: number;

}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
