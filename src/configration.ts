export default () => ({
  database: {
    username: process.env.POSTGRES_USERNAME || '',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DATABASE || '',
    host: process.env.POSTGRES_HOST || '',
    port: process.env.POSTGRES_PORT || '',
  },
  kakao: {
    clientId: '025b493068d0d400f8c6b9f91b175936',
    redirectUrl: 'http://localhost:3000/auth/kakao',
  },
});