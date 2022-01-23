import { Module } from '@nestjs/common';

import { MarkerController } from './marker.controller';
import { MarkerService } from './marker.service';

@Module({
    imports: [],
    controllers: [MarkerController],
    providers: [MarkerService]
})
export class MarkerModule {}
