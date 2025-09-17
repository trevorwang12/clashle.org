/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: false,
          minifySelectors: false,
          calc: false, // 禁用calc优化避免解析错误
        }]
      }
    })
  },
}

export default config
