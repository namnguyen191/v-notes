import { Module } from '@nestjs/common';

import { ApiCoreModule } from '@v-notes/api/core';

@Module({
  imports: [ApiCoreModule],
})
export class AppModule {}
