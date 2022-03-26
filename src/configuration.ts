export default () => ({
    stage: process.env.stage || 'dev',
    kakao: {
        clientId: '025b493068d0d400f8c6b9f91b175936',
        redirectUrl:
            process.env.stage === 'prod'
                ? 'https://myspot.co.kr/'
                : process.env.stage === 'dev'
                ? 'https://myspot.netlify.app'
                : 'http://localhost:3000'
    },
    jwt: {
        signOptions: {
            expiresIn: '30d'
        }
    },
    aws: {
        access_key_id: process.env.AWS_ACCESS_KEY_ID,
        secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.REGION
    },
    typeorm:
        process.env.NODE_ENV === 'test'
            ? {
                  type: 'sqlite',
                  database: ':memory:',
                  autoLoadEntities: true,
                  logging: process.env.NODE_ENV === 'test',
                  synchronize: true
              }
            : {
                  type: 'postgres',
                  autoLoadEntities: true,
                  synchronize: false,
                  bigNumberStrings: false,
                  extra: {
                      ssl: {
                          rejectUnauthorized: false
                      }
                  }
              }
});
