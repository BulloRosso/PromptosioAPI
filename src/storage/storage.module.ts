// storage/storage.module.ts
import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';

@Module({
  providers: [
    {
      provide: StorageService,
      useFactory: () => {
        const service = new StorageService();
        return service;
      },
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}