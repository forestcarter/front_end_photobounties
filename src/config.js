export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-2",
    BUCKET: "photobountyhunter-prod-serverlessdeploymentbucket-yv0sxaxy6qtx"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://krd58s7a7d.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_yxME53l8E",
    APP_CLIENT_ID: "665ev7qhskq3q4j5srqdbr7avj",
    IDENTITY_POOL_ID: "us-east-2:734c84b0-d544-4718-9a3a-9a0e14fb274b"
  },
  social: {
    FB: "787296384956823"
  }
};