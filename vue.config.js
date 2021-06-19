module.exports = {
  // 开发环境配置
  devServer: {
    // 默认端口
    port: 8081,
    // 设置代理
    proxy: {
      //  [process.env.VUE_APP_BASE_API]  "/api/"
      // [process.env.VUE_APP_BASE_API]: {
      "/api/": {
        // ws: false, // 这里把ws代理给关闭

        // 目标 API 地址
        target: "http://localhost:8080", //目标接口域名
        // target: "http://114.116.213.241:8080",
        // 将主机标头的原点更改为目标URL
        changeOrigin: true, //是否跨域
        // pathRewrite: {
        //   ["^" + "/api/"]: "", //重写接口
        // },
      },
    },
  },
  // 生产环境配置
  // 默认，部署时按服务器下根路径寻找资源
  // 编译时资源使用相对路径
  publicPath: "./",
  // 编译后不生成map映射文件
  productionSourceMap: false,
};
