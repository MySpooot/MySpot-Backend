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
    stage: process.env.stage || 'dev',
    typeorm:
        process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'prod'
            ? {
                  type: 'sqlite',
                  database: ':memory:',
                  autoLoadEntities: true,
                  logging: process.env.NODE_ENV === 'local',
                  synchronize: true
              }
            : {
                  type: 'postgres',
                  autoLoadEntities: true,
                  synchronize: false,
                  bigNumberStrings: false,
                  ssl: {
                      rejectUnauthorized: false
                  }
              }
});
