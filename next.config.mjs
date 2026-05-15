/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 이 줄을 추가해줍니다!
  images: {
    unoptimized: true, // 깃허브 페이지에서 이미지 잘 나오게 하는 설정
  },
};

export default nextConfig;
