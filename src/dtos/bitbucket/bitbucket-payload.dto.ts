import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BitbucketActorDto } from './bitbucket-actor.dto';
import { BitbucketRepositoryDto } from './bitbucket-repository.dto';
import { BitbucketPushDto } from './bitbucket-push.dto';

export class BitbucketPayloadDto {
  @ValidateNested()
  @Type(() => BitbucketRepositoryDto)
  repository: BitbucketRepositoryDto;

  @ValidateNested()
  @Type(() => BitbucketPushDto)
  push: BitbucketPushDto;

  @ValidateNested()
  @Type(() => BitbucketActorDto)
  actor: BitbucketActorDto;
}
