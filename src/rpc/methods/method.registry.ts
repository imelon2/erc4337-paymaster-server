import { Injectable } from '@nestjs/common';
import { ERC7477Method, Handler, MethodMap } from './method.types';

@Injectable()
export class MethodRegistry {
  private readonly methods: Partial<Record<keyof MethodMap, Handler<keyof MethodMap>>> = {};

  register<M extends keyof MethodMap>(name: M, fn: Handler<M>) {
    if (this.methods[name as ERC7477Method]) {
      throw new Error(`Duplicate method: ${name}`);
    }
    // 타입 단언은 내부 저장용 – 밖으로 꺼낼 때 타입 회복
    this.methods[name] = fn as Handler<keyof MethodMap>;
  }

  get<M extends keyof MethodMap>(name: M): Handler<M> | undefined {
    return this.methods[name as ERC7477Method] as Handler<M> | undefined;
  }
}
