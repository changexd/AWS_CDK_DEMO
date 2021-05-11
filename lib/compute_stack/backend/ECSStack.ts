import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import {ApplicationLoadBalancedTaskImageOptions} from '@aws-cdk/aws-ecs-patterns';
import * as path from 'path';

export interface ECSStack extends cdk.NestedStack {
  service: ecs_patterns.ApplicationLoadBalancedFargateService;
}

export class ECSStack extends cdk.NestedStack {
  constructor(
    scope: cdk.Construct,
    id: string,
    vpc: ec2.IVpc,
    env: NodeJS.ProcessEnv,
    props?: cdk.NestedStackProps
  ) {
    super(scope, id, props);
    const imageOption: ApplicationLoadBalancedTaskImageOptions = {
      image: ecs.ContainerImage.fromAsset(
        path.resolve(__dirname, '../../resource/backend/localImage')
      ),
      containerName: env.ECS_CONTAINERNAME,
      containerPort: Number(env.ECS_CONTAINERPORT), //define container port
      // enableLogging: undefined,
      // environment: undefined, //define env variables
      // executionRole: undefined, // define IAM role
      // family: undefined, //family is versions of task defs
      // secrets: undefined, //secret ENV variables
      // taskRole: undefined, // define IAM for task
    };
    this.service = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'MyCluster',
      {
        healthCheckGracePeriod: cdk.Duration.seconds(1800), //health check
        serviceName: 'My_ECS', // name of the service
        targetProtocol: undefined, // default HTTP, determined by protocol above
        taskDefinition: undefined, //define task definition //TODO add local docker image to ECR
        taskImageOptions: imageOption, //define new task definition
        vpc: vpc, // defined desired vpc
        desiredCount: 2, //define desire count
        assignPublicIp: false,
        publicLoadBalancer: false, //default true determines to internet or internal

        // certificate: undefined, //SSL certificate
        // cloudMapOptions: undefined,
        // cluster: undefined,
        // cpu: undefined, //defined cpu default 256
        // deploymentController: undefined,
        // domainName: undefined, //HTTPS required
        // domainZone: undefined, //HTTPS required
        // enableECSManagedTags: false,
        // listenerPort: undefined, //default 80 for HTTP 443 for HTTPS
        // loadBalancer: undefined, //will create a new one
        // maxHealthyPercent: undefined, //default 100, if daemon 200
        // memoryLimitMiB: undefined, //default 512
        // minHealthyPercent: undefined, //percentage of desired task count default 0 max 50
        // openListener: undefined, //default true, determines will ALB listener open to all
        // platformVersion: undefined,
        // propagateTags: undefined,
        // protocol: undefined, //default HTTP, if certificate != undefined, will automatically be HTTPS
        // recordType: undefined, //Specifies whether the Route53 record should be a CNAME, an A record using the Alias feature or no record at all.
        // redirectHTTP: undefined, // only available when HTTPS is on
        // securityGroups: undefined, //default will create a new SG, //TODO specify SG for this behavior
        //TaskDefinition or TaskImageOptions must be specified, but not both//
      }
    );
  }
}
