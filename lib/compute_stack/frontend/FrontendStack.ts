import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
//S3
import * as s3 from '@aws-cdk/aws-s3';
import * as s3assets from '@aws-cdk/aws-s3-assets';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
//CloudFront
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as path from 'path';
export class FrontendStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    vpc: ec2.IVpc,
    env: NodeJS.ProcessEnv,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);
    let bucketName: string = env.S3_BUCKET_NAME || '';
    let My_bucket;
    if (s3.Bucket.fromBucketName(this, 'pastBucket', bucketName)) {
      My_bucket = s3.Bucket.fromBucketName(this, 'MyBucket', bucketName);
    } else {
      My_bucket = new s3.Bucket(this, 'my-bucket', {
        bucketName: bucketName,
        versioned: true,
        publicReadAccess: true,
        websiteIndexDocument: 'index.html',
        // accessControl: undefined,
        // autoDeleteObjects: false, //delete when remove from stack or destroy
        // blockPublicAccess: undefined, // TODO allow public
        // bucketKeyEnabled: false,
        // cors: undefined,
        // encryption: undefined,
        // inventories: undefined,
        // lifecycleRules: undefined,
        // metrics: undefined,
        // objectOwnership: undefined /**@default-who uploads will grant ownership */,
        // removalPolicy: undefined,
        // serverAccessLogsBucket: undefined,
        // serverAccessLogsPrefix: undefined,
        // websiteErrorDocument: undefined,
        // websiteRedirect: undefined,
        // websiteRoutingRules: undefined,
      });
    }

    //now host it with s3_deploy
    const My_deploy = new s3deploy.BucketDeployment(
      this,
      'Deploy-Frontend',
      {
        sources: [
          s3deploy.Source.asset(
            path.resolve(__dirname, '../../resource/frontend/dist')
          ),
        ],
        destinationBucket:My_bucket,
      }
    );
    //-------------------CloudFront--------------------------
    const behavior_options: cloudfront.BehaviorOptions = {
      origin: new origins.S3Origin(My_bucket), //define origin
      // allowedMethods: undefined,
      // cachePolicy: undefined,
      // compress: undefined,
      // edgeLambdas: undefined,
      // originRequestPolicy: undefined,
      // smoothStreaming: undefined,
      // trustedKeyGroups: undefined,
      // viewerProtocolPolicy: undefined,
    };
    const My_cloudfront = new cloudfront.Distribution(
      this,
      'myCloudfront',
      {
        defaultBehavior: behavior_options,
        defaultRootObject: 'index.html', //defined root object
        // certificate: undefined,
        // comment: undefined,
        // domainNames: undefined,
        // enableIpv6: true,
        // enableLogging: false,
        // enabled: true,
        // errorResponses: undefined,
        // geoRestriction: undefined,
        // httpVersion: undefined /**@default HTTP2 */,
        // logBucket: undefined,
        // logFilePrefix: undefined,
        // logIncludesCookies: undefined,
        // minimumProtocolVersion: undefined,
        // priceClass: undefined,
        // webAclId: undefined,
      }
    );
  }
}
