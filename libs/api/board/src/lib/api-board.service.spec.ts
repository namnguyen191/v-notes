import { Test } from '@nestjs/testing';
import { ApiBoardService } from './api-board.service';

describe('ApiBoardService', () => {
  let service: ApiBoardService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiBoardService],
    }).compile();

    service = module.get(ApiBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
