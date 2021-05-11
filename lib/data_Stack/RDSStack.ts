import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import {IDatabaseInstance} from '@aws-cdk/aws-rds';

export interface RDSStack extends cdk.NestedStack {
  DB: IDatabaseInstance;
}

export class RDSStack extends cdk.NestedStack {
  constructor(
    scope: cdk.Construct,
    id: string,
    vpc: ec2.IVpc,
    env: NodeJS.ProcessEnv,
    props?: cdk.NestedStackProps
  ) {
    super(scope, id, props);

    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.of(
        //Full version
        env.RDS_DB_FULL_VERSION || '8.0.20',
        //Major version
        env.RDS_DB_MAJOR_VERSION || '8.0'
      ),
    }); //define Engine type and version
    if (env.RDS_EXISTED == 'true') {
      const endPointAddress: string = env.RDS_ENDPOINT_ADDRESS || '';
      const DBid: string = env.RDS_DB_NAME || '';
      const port: number = parseInt(env.RDS_DB_PORT || '3306');
      const existedRDS = rds.DatabaseInstanceBase.fromDatabaseInstanceAttributes(
        this,
        'pastDB',
        {
          instanceEndpointAddress: endPointAddress,
          instanceIdentifier: DBid,
          port: port,
          securityGroups: [],
        }
      );
      this.DB = existedRDS;
    } else {
      this.DB = new rds.DatabaseInstance(this, 'My-DB', {
        engine: dbEngine, //define Engine
        vpc: vpc,
        credentials: {
          username: env.RDS_USERNAME || 'admin',
          password: new cdk.SecretValue(env.RDS_PASSWORD),
        },
        databaseName: env.RDS_DB_NAME, //define the name of the database
        deletionProtection: env.MODE == 'stage' ? false : true,
        instanceIdentifier: env.RDS_DB_NAME,
        port: Number(env.RDS_DB_PORT) || 3306,
        instanceType: new ec2.InstanceType(
          env.RDS_DB_INSTANCETYPE || 't2.micro'
        ),
        // deleteAutomatedBackups: false,
        // allocatedStorage: undefined, //define storage in GB, @default  100
        // allowMajorVersionUpgrade: false, //allow major upgrades
        // autoMinorVersionUpgrade: false, // allow minor upgrades
        // availabilityZone: undefined, //define desired AZ
        // backupRetention: undefined,
        // /**snapshot backup @type = Duration*/
        // characterSetName: undefined, //specifies the character set to associate with the DB instance
        // cloudwatchLogsExports: undefined,
        // cloudwatchLogsRetentionRole: undefined,
        // cloudwatchLogsRetention: undefined,
        // copyTagsToSnapshot: undefined, //define tags to snapshot
        // domain: undefined,
        // domainRole: undefined,
        // enablePerformanceInsights: false,
        // iamAuthentication: false, //IAM authentication
        // iops: undefined, // desired iops
        // licenseModel: undefined,
        // maxAllocatedStorage: undefined,
        // monitoringInterval: undefined,
        // /**@type duration*/ monitoringRole: undefined,
        // multiAz: false, //define if multi AZ
        // optionGroup: undefined,
        // parameterGroup: undefined,
        // performanceInsightEncryptionKey: undefined,
        // performanceInsightRetention: undefined,
        // /**@type PerformanceInsightRetention */
        // preferredBackupWindow: undefined, // a time in a day to automatically backup
        // preferredMaintenanceWindow: undefined,
        // processorFeatures: undefined,
        // publiclyAccessible: false,
        // removalPolicy: undefined,
        // securityGroups: undefined, //TODO Create a security group to allow ECS instance
        // storageEncrypted: undefined,
        // storageEncryptionKey: undefined,
        // storageType: undefined /**@default GP2 */,
        // timezone: undefined,
        // vpcSubnets: undefined, //default private subnet
      });
    }
  }
}
