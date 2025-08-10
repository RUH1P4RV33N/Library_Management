const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    },
  databaseUrl: process.env.DATABASE_URL!,
    upstash:{
      redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
      redisToken: process.env.UPSTASH_REDIS_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
    },
    emailjsServiceId: process.env.EMAILJS_SERVICE_ID!, // e.g. service_5bejxor
    emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID!, // e.g. template_abcd123
    emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY!,   // Your EmailJS Public Key
  },
};

export default config;