import type { IGeneratorStrategy } from './interfaces.js';

const strategies: Map<string, IGeneratorStrategy> = new Map();

export function registerStrategy(strategy: IGeneratorStrategy): void {
  strategies.set(strategy.name, strategy);
}

export function getStrategy(name: string): IGeneratorStrategy | undefined {
  return strategies.get(name);
}

export function getStrategiesByLayer(layer: string): IGeneratorStrategy[] {
  return Array.from(strategies.values()).filter((s) => s.layer === layer);
}

export function clearStrategies(): void {
  strategies.clear();
}
