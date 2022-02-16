export default () => ({
    database: {
        username: process.env.POSTGRES_USERNAME || '',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_DATABASE || '',
        host: process.env.POSTGRES_HOST || '',
        port: process.env.POSTGRES_PORT || ''
    },
    kakao: {
        clientId: '025b493068d0d400f8c6b9f91b175936',
        localRedirectUrl: 'http://localhost:3000',
        devRedirectUrl: 'https://myspot.netlify.app'
    },
    jwt: {
        signOptions: {
            expiresIn: '30d'
        }
    },
    s3Bucket: process.env.AWS_BUCKET_NAME,
    s3BucketUrl: `https://s3Bucket.myspot.kr`,
    s3AccessKey: process.env.AWS_S3_ACCESS_KEY,
    s3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});
