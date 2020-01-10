/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { readTsConfig } from '@nrwl/workspace';
import { resolve } from 'path';
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as ts from 'typescript';
import * as webpack from 'webpack';
import { Configuration, ProgressPlugin } from 'webpack';
import { TypescriptBuilderOptions } from './schema';

import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export function getBaseWebpackPartial(
  options: TypescriptBuilderOptions,
): Configuration {
  const { options: compilerOptions } = readTsConfig(options.tsConfig);
  const supportsEs2015 =
    compilerOptions.target !== ts.ScriptTarget.ES3 &&
    compilerOptions.target !== ts.ScriptTarget.ES5;
  const mainFields = [...(supportsEs2015 ? ['es2015'] : []), 'module', 'main'];
  const extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx'];
  const webpackConfig: Configuration = {
    entry: options.entry,
    // devtool: options.sourceMap ? 'source-map' : false,
    // mode: options.optimization ? 'production' : 'development',
    output: {
      filename: '[name].bundle.js',
      path: resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          loader: `ts-loader`,
          options: {
            configFile: options.tsConfig,
            transpileOnly: true,
            // https://github.com/TypeStrong/ts-loader/pull/685
            experimentalWatchApi: true,
          },
        },
      ],
    },
    resolve: {
      extensions,
      // alias: getAliases(options),
      plugins: [
        new TsConfigPathsPlugin({
          configFile: options.tsConfig,
          extensions,
          mainFields,
        }),
      ],
      mainFields,
    },
    performance: {
      hints: false,
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        tsconfig: options.tsConfig,
        workers: options.maxWorkers || ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
        // useTypescriptIncrementalApi: false
      }),
    ],
    // watch: options.watch,
    // watchOptions: {
    //   poll: options.poll
    // },
    // stats: getStatsConfig(options)
  };

  const extraPlugins: webpack.Plugin[] = [];

  // if (options.progress) {
  extraPlugins.push(new ProgressPlugin());
  // }

  webpackConfig.plugins = [...webpackConfig.plugins, ...extraPlugins];

  return webpackConfig;
}
