import type { GeneratorContext, IGeneratorStrategy } from './interfaces.js';

const LAYER_ORDER: Array<'domain' | 'orm' | 'framework' | 'realtime' | 'provider' | 'auth' | 'delivery'> = [
  'domain',
  'orm',
  'framework',
  'realtime',
  'provider',
  'auth',
  'delivery',
];

function strategyMatchesContext(
  strategy: IGeneratorStrategy,
  ctx: GeneratorContext
): boolean {
  const s = strategy as {
    frameworkName?: string;
    ormName?: string;
    providerName?: string;
    realtimeName?: string;
  };
  if (s.frameworkName !== undefined && s.frameworkName !== ctx.framework) return false;
  if (s.ormName !== undefined && s.ormName !== ctx.orm) return false;
  if (s.realtimeName !== undefined) {
    if (!ctx.realtimeProvider || s.realtimeName !== ctx.realtimeProvider) return false;
  }
  if (s.providerName !== undefined) {
    const ctxProvider = ctx.provider ?? ctx.authProvider;
    if (!ctxProvider || s.providerName !== ctxProvider) return false;
  }
  return true;
}

export class StrategyPipeline {
  private strategies: IGeneratorStrategy[] = [];

  register(strategy: IGeneratorStrategy): this {
    this.strategies.push(strategy);
    return this;
  }

  async execute(ctx: GeneratorContext): Promise<void> {
    for (const layer of LAYER_ORDER) {
      const layerStrategies = this.strategies.filter(
        (s) => s.layer === layer && strategyMatchesContext(s, ctx)
      );
      for (const strategy of layerStrategies) {
        await strategy.generate(ctx);
      }
    }
  }
}
