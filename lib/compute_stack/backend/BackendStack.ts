import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import {IDatabaseInstance} from '@aws-cdk/aws-rds';

import * as path from 'path';
//nested stacks
import {ECSStack} from './ECSStack';
export interface BackendProps extends cdk.StackProps {
  DB: IDatabaseInstance;
}

export class BackendStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    vpc: ec2.IVpc,
    env: NodeJS.ProcessEnv,
    props?: BackendProps
  ) {
    super(scope, id, props);
    // 1. create a DB

    // 2. create a ECS service
    const ECS = new ECSStack(this, 'ECS', vpc, env);
    // 3. allow RDS and ECS to communicate
    if (props) {
      props.DB.connections.allowFrom(
        ECS.service.service,
        ec2.Port.tcp(3306),
        'allow ECS to RDS'
      );
    }
  }
}
