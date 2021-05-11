#!/usr/bin/env node
//Network Stack
import {NetworkStack} from '../lib/network_stack/NetworkStack';
//Backend Stack
import {BackendStack} from '../lib/compute_stack/backend/BackendStack';
//Frontend Stack
import {FrontendStack} from '../lib/compute_stack/frontend/FrontendStack';
//Data Stack
import {DataStack} from '../lib/data_stack/DataStack';
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv';
dotenv.config();
const env = process.env;
const app = new cdk.App();
const vpc = new NetworkStack(app, 'vpc', env, {});
const database = new DataStack(app, 'database', vpc.vpc, env);
const backend = new BackendStack(app, 'backend', vpc.vpc, env, {
  DB: database.DB,
});
const frontend = new FrontendStack(app, 'frontend', vpc.vpc, env, {});
