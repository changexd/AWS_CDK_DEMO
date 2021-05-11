import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import {ECSStack} from '../compute_stack/backend/ECSStack';
import {RDSStack} from './RDSStack';

import {IDatabaseInstance} from '@aws-cdk/aws-rds';

export interface DataStack extends cdk.Stack {
  DB: IDatabaseInstance;
}

export class DataStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    vpc: ec2.IVpc,
    env: NodeJS.ProcessEnv,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const RDS = new RDSStack(this, 'RDS', vpc, env);
    this.DB = RDS.DB;
  }
}
