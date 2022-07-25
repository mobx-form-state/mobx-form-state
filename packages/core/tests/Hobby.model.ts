import { field } from '../src/decorators';
import { required } from './utils';

export class Hobby {
  @field({ validate: [required()] })
  hobbyId = 1;

  @field<Hobby, 'hobbyName'>({ validate: required() })
  hobbyName = 'dev';

  @field<Hobby, 'createdAt', string>({
    format: (value) => (value ? value.toString() : ''),
    parse: (value) => new Date(value),
  })
  createdAt?: Date = new Date('2022-05-29');
}
