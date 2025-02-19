import { Injectable, NotFoundException, ConflictException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoursesService } from 'src/courses/courses.service';
import { Enrollment, EnrollmentDocument } from './enrollment.entity';

@Injectable()
export class EnrollmentsService {
    constructor(
        @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
        @Inject(forwardRef(() => CoursesService))
        private readonly coursesService: CoursesService,
    ) { }

    // Đăng ký khóa học
    async enroll(userId: string, courseId: number) {
        // Kiểm tra course tồn tại
        const course = await this.coursesService.getCourseById(courseId, userId);
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Kiểm tra user đã enroll chưa
        const existed = await this.enrollmentModel.findOne({ userId, courseId });
        if (existed) {
            throw new ConflictException('Already enrolled this course');
        }

        // Tạo enrollment
        const enrollment = new this.enrollmentModel({ userId, courseId });
        return enrollment.save();
    }

    // Hủy đăng ký
    async unenroll(userId: string, courseId: number) {
        const existed = await this.enrollmentModel.findOne({ userId, courseId });
        if (!existed) {
            throw new NotFoundException('Not enrolled in this course');
        }
        await this.enrollmentModel.deleteOne({ _id: existed._id });
        return { message: 'Unenrolled successfully' };
    }

    // Lấy danh sách khóa học đã đăng ký của user
    async getUserEnrollments(userId: string) {
        return this.enrollmentModel.find({ userId });
    }

     // Kiểm tra xem user đã đăng ký khóa học chưa
  async isUserEnrolled(userId: string, courseId: number): Promise<boolean> {
    const enrollment = await this.enrollmentModel.findOne({ userId, courseId });
    return !!enrollment;
  }

}
