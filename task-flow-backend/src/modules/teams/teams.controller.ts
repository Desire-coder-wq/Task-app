import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@ApiTags('teams')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  async createTeam(@Request() req: any, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.createTeam(req.user.id, createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams for the current user' })
  @ApiResponse({ status: 200, description: 'Teams retrieved successfully' })
  async getUserTeams(@Request() req: any) {
    return this.teamsService.getUserTeams(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific team by ID' })
  @ApiResponse({ status: 200, description: 'Team retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async getTeam(@Param('id') id: string, @Request() req: any) {
    return this.teamsService.getTeam(id, req.user.id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get team members' })
  @ApiResponse({ status: 200, description: 'Team members retrieved successfully' })
  async getTeamMembers(@Param('id') id: string, @Request() req: any) {
    return this.teamsService.getTeamMembers(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a team' })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async updateTeam(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam(id, req.user.id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiResponse({ status: 200, description: 'Team deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async deleteTeam(@Param('id') id: string, @Request() req: any) {
    return this.teamsService.deleteTeam(id, req.user.id);
  }

  @Get(':id/role')
  @ApiOperation({ summary: 'Get current user role in team' })
  @ApiResponse({ status: 200, description: 'User role retrieved successfully' })
  async getUserRole(@Param('id') id: string, @Request() req: any) {
    return this.teamsService.getUserRoleInTeam(id, req.user.id);
  }
}