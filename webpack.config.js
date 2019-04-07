let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let MiniCssExtractPluginScss = require('mini-css-extract-plugin');
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const devMode = process.env.NODE_ENV !== 'production';
/** 
 * 正对于mini-css-extract-plugin插件，我们可以定义多个，也可以只定义一个，看你心情。
*/

/**
 * process.env.NODE_ENV !== 'production' 用于判断是不是生产环境
 */

module.exports = {
    optimization: {     // 优化项
        minimizer: [                
            new UglifyJsPlugin({    // webpack默认调用的就是UglifyJsPlugin，这个可以压缩js
                cache: true,        // 是否使用缓存 
                parallel: true,     // 是否并发打包，也就是同时打包多个文件
                sourceMap: true     // 例如把源码ES6变成ES5 
            }),
            new OptimizeCSSAssetsPlugin({      // 如果我们要添加压缩css的功能（也就是OptimizeCSSAssetsPlugin），那么就必须要添加UglifyJsPlugin()

            })
        ]
    },
    devServer: {    // 开发服务器的配置
        port: 3000,             // 默认端口
        progress: true,         // 打包的时候，我们能够看到精度条
        contentBase: './dist',  // 以dist文件夹作为静态的服务
        compress: true,         // 启用压缩
    },
    mode: devMode ? 'development' : 'production',   /** 
        模式 默认是生产模式  默认两种值：production development
        目前本地项目打包是development模式
    */
    entry: './src/index.js',  // 入口，读取的文件路劲
    output: {
        filename: 'bundle.[hash:8].js',  // 打包后的文件名字  中间的.[hash]. 代表的是每一次修改文件，最后都会产生一个新的bundle并且是带hash值的js文件
                                         // :8 代表的是只显示8位
        path: path.resolve(__dirname, 'dist'),   // 路径必须是一个绝对路径  __dirname代表的是以当前目录下
    },
    plugins: [  // 数组 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html',   // 选取相关的html作为模板
            filename: 'index.html',         // 打包以后的html文件名字也叫做index.html
            minify: {                       // 用于压缩html的，最小化html
                removeAttributeQuotes: true,    // 删除html上的属性的双引号
                collapseWhitespace: true,       // 折叠空行，将html压缩成一行
            },
            hash: true,                         // 希望生成的js代码引用的时候，使用hash戳，用于解决缓存的问题
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash:8].css',               // 定义抽离出来的样式名字
        })
    ],
    module: {   // 模块
        rules: [    // 规则 
            // css-loader   解析@import这种语法
            // style-loader 将css插入到head标签中
            { 
                test: /\.css$/, 
                use: [
                        // {
                        //     loader: 'style-loader',
                        //     options: {
                        //         insertAt: 'top'     // options可以做对应的style-loader配置，insertAt代表的是生成的style插入的位置，top代表的是顶部
                        //     }
                        // }, 
                        MiniCssExtractPlugin.loader,    // 抽离css样式，异步加载不重复编译，然后再 link 进页面
                        'css-loader',
                        'postcss-loader'
                    ]
            },
            { 
                test: /\.scss$/, 
                use: [
                        // {
                        //     loader: 'style-loader',
                        //     options: {
                        //         insertAt: 'top'     // options可以做对应的style-loader配置，insertAt代表的是生成的style插入的位置，top代表的是顶部
                        //     }
                        // }, 
                        MiniCssExtractPluginScss.loader,    // 抽离css样式，异步加载不重复编译，然后再 link 进页面
                        'css-loader',
                        'postcss-loader',    /** 
                                postcss-loader 它提供了一种方式用 JavaScript 代码来处理 CSS
                                postcss-loader 用来对.css 文件进行处理，并添加在 style-loader 和 css-loader 之后
                                Autoprefixer是一个流行的 PostCSS 插件，其作用是为 CSS 中的属性添加浏览器特定的前缀
                                Autoprefixer 可以根据需要指定支持的浏览器类型和版本，自动添加所需的带前缀的属性声明。
                                webpack4+，我们通过postcss.config.js进行配置postcss-loader, 因为postcss-loader调用的时候默认会调用这个配置文件
                        */
                       'sass-loader',   //sass-loader的作用就是将对应的scss文件转化为css文件
                    ]
            },
        ]
    }
};