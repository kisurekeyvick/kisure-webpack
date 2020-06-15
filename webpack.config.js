let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';
let optimizeCss = require('optimize-css-assets-webpack-plugin');
let TerserJSPlugin = require('terser-webpack-plugin'); 

module.exports = {
    /** 优化项 */
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new optimizeCss({})
        ]
    },
    /** 开发服务器的配置 */
    devServer: {
        /** 端口是3000 */
        port: 3000,
        /** 使用webpack打包的时候，能够看到进度条 */
        progress: true,
        /** 找到build文件夹作为静态服务资源 */
        contentBase: './build',
        /** 自动打开浏览器 */
        open: true,
        /** 启用 gzip 压缩 */
        compress: true
    },
    mode: 'production', // 模式 默认两种 production(生产模式)  development(开发模式)
    // 入口文件 代表的是从哪个地方开始打包  
    entry: './src/index.js',
    // 出口文件
    output: {
        filename: 'bundle.[hash:8].js',   // 打包后的文件名
        // 打包以后，文件存放的位置，需要注意的是路径必须是绝对路径
        path: path.resolve(__dirname, 'build')      // 这句话的意思就是，从当前目录下解析出build文件
    },
    plugins: [
        /** 是个数组 放着所有webpack的插件 */
        new HtmlWebpackPlugin({
            /** 希望以src/index.html作为模板 */
            template: './src/index.html',
            /** 打包出来的文件的命名 */
            filename: 'index.html',
            minify: {
                /** 删除html中的"" */
                removeAttributeQuotes: true,
                /** 将html整理成一行 */
                collapseWhitespace: true,
            },
            /** 添加hash戳 */
            hash: true
        }),
        new MiniCssExtractPlugin({
            /**抽离出来的样式的名字 */
            filename: '[name].[hash:8].css'
        })
    ],
    module: {
        /** 
         * 模块 模块可以是js css html img 等等
         * module里面需要配置相关的规则
         */
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env"],
                            plugins: [
                                ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                                ['@babel/plugin-proposal-class-properties', {'loose': true}]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    // {
                    //     loader: 'style-loader',
                    // },
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // {
                    //     loader: 'style-loader',
                    // },
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    'postcss-loader',
                ]
            }
        ] 
    }
};