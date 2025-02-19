import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { CoursesModule } from 'src/courses/courses.module';
import { Enrollment, EnrollmentSchema } from './enrollment.entity';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    forwardRef(() => CoursesModule),
  ],
  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],
   exports: [EnrollmentsService],
})
export class EnrollmentsModule { }
