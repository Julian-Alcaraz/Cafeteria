import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { HoppersService } from './hoppers.service.js';
import { CreateHopperConfigDto } from './dto/create-hopper-config.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('hoppers')
@UseGuards(JwtAuthGuard)
export class HoppersController {
  constructor(private readonly hoppersService: HoppersService) {}

  @Get('active')
  getActiveConfigs() {
    return this.hoppersService.getActiveConfigs();
  }

  @Get(':slot/history')
  getHistory(@Param('slot') slot: string) {
    return this.hoppersService.getConfigHistory(+slot);
  }

  @Post('active')
  setActiveConfig(@Body() createHopperConfigDto: CreateHopperConfigDto, @Request() req: any) {
    return this.hoppersService.setActiveConfig(createHopperConfigDto, req.user.userId);
  }
}
