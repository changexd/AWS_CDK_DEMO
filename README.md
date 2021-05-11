# This repo demonstrates the basic usage of AWS CDK including 
- A VPC with two private subnets and two public subnets
- A Public Application Load Balancer that directs traffic to two services on ECS container
- A RDS database running MySql on private subnet and only allows request from our service from ECS
- A static site hosting with S3 bucket and using cloudfront as a content delivery network