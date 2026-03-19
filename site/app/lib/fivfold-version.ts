/**
 * Marketing / docs release label shown in the site header and homepage.
 * Keep in sync with published `@fivfold/*` package versions in the monorepo.
 */
export const FIVFOLD_MARKETING_VERSION = "0.13.4";

export function formatMarketingVersionLabel(): string {
  return `v${FIVFOLD_MARKETING_VERSION}`;
}
