import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BitbucketFullNameDto } from './bitbucket-fullname.dto';
import { BitbucketActorDto } from './bitbucket-actor.dto';
import { BitbucketChangesDto } from './bitbucket-changes.dto';

export class BitbucketPayloadDto {
  @ValidateNested()
  @Type(() => BitbucketFullNameDto)
  repository: BitbucketFullNameDto;

  @ValidateNested()
  @Type(() => BitbucketChangesDto)
  push: BitbucketChangesDto;

  @ValidateNested()
  @Type(() => BitbucketActorDto)
  actor: BitbucketActorDto;
}
