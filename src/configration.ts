export default () => ({
    database: {
      host: process.env.DATABASE_HOST || '',
      user: process.env.DATABASE_USER || '',
      name: process.env.DATABASE_NAME || '',
      password: process.env.DATABASE_PASSWORD || '',
      port: process.env.DATABASE_PORT || '',
    },
    kakao: {
      clientId: '025b493068d0d400f8c6b9f91b175936',
      redirectUrl: 'http://localhost:3000/auth/kakao'
  }
});