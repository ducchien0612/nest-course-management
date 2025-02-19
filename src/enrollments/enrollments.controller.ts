import { Controller, Post, Delete, Get, Body, UseGuards, Request } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EnrollmentDto } from './dto/enrollment.dto';


@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    // 1. Đăng ký khóa học
    @Post('enroll')
    async enroll(@Body() body: EnrollmentDto, @Request() req) {
        const { courseId } = body;
        return this.enrollmentsService.enroll(req.user.userId, courseId);
    }

    // 2. Hủy đăng ký
    @Delete('unenroll')
    async unenroll(@Body() body: EnrollmentDto, @Request() req) {
        const { courseId } = body;
        return this.enrollmentsService.unenroll(req.user.userId, courseId);
    }

    // 3. Xem danh sách khóa học đã đăng ký
    @Get('my-courses')
    async myCourses(@Request() req) {
        return this.enrollmentsService.getUserEnrollments(req.user.userId);
    }
}
