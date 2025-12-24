import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/users.entity';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request: { user: User } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
