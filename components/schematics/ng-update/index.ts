import { Rule, SchematicContext } from '@angular-devkit/schematics';
import {
  RuleUpgradeData,
  TargetVersion,
  createUpgradeRule,
  MigrationRuleType,
} from '@angular/cdk/schematics';

import { DtTargetVersion } from './migration-rule';
import { SecondaryEntryPointsRule } from './package-upgrade-v5/secondary-entry-points-rule';

/** Data that can be populated for each version upgrade with changes that can be done automatically */
const defaultUpgradeData: RuleUpgradeData = {
  attributeSelectors: {},
  classNames: {},
  constructorChecks: {},
  cssSelectors: {},
  elementSelectors: {},
  inputNames: {},
  methodCallChecks: {},
  outputNames: {},
  propertyNames: {},
};

/** Array of Rule contructors that will be created and run inside the createUpgradeRule function */
const upgradeRules: MigrationRuleType<RuleUpgradeData | null>[] = [
  SecondaryEntryPointsRule,
];

/** Entry point for the migration schematics with target of Dynatrace Angular components v5 */
export function updateToV5(): Rule {
  return createDtUpgradeRule(
    DtTargetVersion.V5,
    upgradeRules,
    defaultUpgradeData,
    onMigrationComplete,
  );
}

/** Wrapper for the @angular/cdk/schematics function since TargetVersion is currently hardcoded to material versions */
function createDtUpgradeRule(
  targetVersion: DtTargetVersion,
  migrationRules: MigrationRuleType<RuleUpgradeData | null>[],
  upgradeData: RuleUpgradeData,
  onMigrationCompleteFn: (
    context: SchematicContext,
    targetVersion: TargetVersion,
    hasFailures: boolean,
  ) => void,
): Rule {
  return createUpgradeRule(
    (targetVersion as unknown) as TargetVersion,
    migrationRules,
    upgradeData,
    onMigrationCompleteFn,
  );
}

// tslint:disable: no-console

/** Function that will be called when the migration completed. */
function onMigrationComplete(
  context: SchematicContext,
  targetVersion: TargetVersion,
  hasFailures: boolean,
): void {
  context.logger.info('');
  context.logger.info(
    `  ✓  Updated Dynatrace Angular Components to ${targetVersion}`,
  );
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      `  ⚠  Some issues were detected but could not be fixed automatically. ` +
        `Please check the output above and fix these issues manually.`,
    );
  }
}
