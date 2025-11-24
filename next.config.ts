import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.fiat.it',
      },
      {
        protocol: 'https',
        hostname: 'www.alfaromeo.it',
      },
      {
        protocol: 'https',
        hostname: 'www.volkswagen.it',
      },
      {
        protocol: 'https',
        hostname: 'www.audi.it',
      },
      {
        protocol: 'https',
        hostname: 'www.mercedes-benz.it',
      },
      {
        protocol: 'https',
        hostname: 'www.renault.it',
      },
      {
        protocol: 'https',
        hostname: 'www.peugeot.it',
      },
      {
        protocol: 'https',
        hostname: 'www.nissan.it',
      },
      {
        protocol: 'https',
        hostname: 'www.toyota.it',
      },
      {
        protocol: 'https',
        hostname: 'www.bmw.it',
      },
      {
        protocol: 'https',
        hostname: 'www.opel.it',
      },
      {
        protocol: 'https',
        hostname: 'www.ford.it',
      },
      {
        protocol: 'https',
        hostname: 'www.citroen.it',
      },
      {
        protocol: 'https',
        hostname: 'www.seat.it',
      },
      {
        protocol: 'https',
        hostname: 'www.skoda.it',
      },
      {
        protocol: 'https',
        hostname: 'www.mazda.it',
      },
      {
        protocol: 'https',
        hostname: 'www.hyundai.it',
      },
      {
        protocol: 'https',
        hostname: 'www.kia.it',
      },
      {
        protocol: 'https',
        hostname: 'www.ducati.it',
      },
      {
        protocol: 'https',
        hostname: 'www.yamaha-motor.it',
      },
    ],
  },
};

export default nextConfig;
