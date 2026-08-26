import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  async getStats(@Request() req: any) {
    return this.dashboardService.getStats(req.user.id);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming task deadlines' })
  @ApiResponse({ status: 200, description: 'Upcoming deadlines retrieved successfully' })
  async getUpcoming(@Request() req: any) {
    return this.dashboardService.getUpcoming(req.user.id);
  }
}
