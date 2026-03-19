import Handlebars from 'handlebars';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { camelCase, pascalCase, kebabCase } from './helpers.js';

export function registerTemplateHelpers(): void {
  Handlebars.registerHelper('camelCase', (str: string) => (str ? camelCase(str) : ''));
  Handlebars.registerHelper('pascalCase', (str: string) => (str ? pascalCase(str) : ''));
  Handlebars.registerHelper('kebabCase', (str: string) => (str ? kebabCase(str) : ''));
  Handlebars.registerHelper('eq', (a, b) => a === b);
  Handlebars.registerHelper('or', (...args) => args.slice(0, -1).some(Boolean));
  Handlebars.registerHelper('and', (...args) => args.slice(0, -1).every(Boolean));
}

export class TemplateEngine {
  private templateRoot: string;

  constructor(templateRoot: string) {
    this.templateRoot = templateRoot;
    registerTemplateHelpers();
  }

  renderTemplate(templatePath: string, context: Record<string, unknown>): string {
    const fullPath = templatePath.startsWith(this.templateRoot)
      ? templatePath
      : join(this.templateRoot, templatePath);
    if (!existsSync(fullPath)) {
      throw new Error(`Template not found: ${fullPath}`);
    }
    const source = readFileSync(fullPath, 'utf8');
    const template = Handlebars.compile(source);
    return template(context);
  }

  renderString(template: string, context: Record<string, unknown>): string {
    const compiled = Handlebars.compile(template);
    return compiled(context);
  }
}
