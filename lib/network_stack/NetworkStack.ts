import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
export interface NetworkStack extends cdk.Stack {
  vpc: ec2.IVpc;
}
export class NetworkStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    env: object,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);
    this.vpc = new ec2.Vpc(this, 'vpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'My_public_ALB',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 20,
        },
        {
          name: 'My_private_ALB',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: 20,
        },
      ],
    });
  }
}
