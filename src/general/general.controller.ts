import { Controller, Get } from '@nestjs/common';
import { GeneralService } from './general.service';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}
  @UseGuards(AccessTokenGuard)
  @Roles(Role.Admin)
  @Get()
  async getGeneral() {
    try {
      const data = await this.generalService.getGeneral();
      return new ResponseSuccess('Get data success', data, true);
    } catch (error) {
      return new ResponseError('Get fail', error);
    }
  }
}
