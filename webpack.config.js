var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin'); //这个插件可以帮助生成 HTML 文件，在 body 元素中，使用 script 来包含所有你的 webpack bundles
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin'); //打开浏览器
var TransferWebpackPlugin = require('transfer-webpack-plugin'); //拷贝文件
var SpritesmithPlugin = require('webpack-spritesmith');
var prod = process.env.NODE_ENV === 'production' ? true : false;

//需要用到glob模块 
var glob = require('glob'),
    pageArr = [];
var getEntry = function() {
    var entry = {};
    //首先我们先读取我们的开发目录
    glob.sync('./javascript/*.js').forEach(function(name) {
        var n = name.slice(name.lastIndexOf('javascript/') + 11, name.length - 2);
        n = n.slice(0, n.lastIndexOf('/')); //接着我对路径字符串进行了一些裁剪成想要的路径
        entry[n] = name;
        pageArr.push(n);
    });
    entry['vendors'] = ['jquery']; //增加jquery
    console.log('entry', entry);
    return entry;
};

module.exports = {
    entry: getEntry(), //入口
    output: {
        path: path.join(__dirname, "build"),
        //path: __dirname,
        //publicPath: 'http://ww.baidu.com',
        filename: 'js/[name].[hash].js'
    },
    resolve: {
        alias: {
            // Force all modules to use the same jquery version.
            'jquery': path.join(__dirname, 'node_modules/jquery/src/jquery')
        }
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: "raw"
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=400&name=/images/[name].[ext]?[hash:10]'
        }, {
            test: /\.rgl$/,
            loader: 'rgl'
        }, {
            test: /\.js$/,
            loader: 'babel?cacheDirectory=false'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },
    plugins: [
        /*new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, './res/images/icons'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, './build/images/sprite.png'),
                css: path.resolve(__dirname, './build/css/sprite.css')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: '../images/sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        }),*/
        //这个使用uglifyJs压缩你的js代码
        //new webpack.optimize.UglifyJsPlugin({minimize: false}),
        //把入口文件里面的数组打包成verdors.js
        //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        new ExtractTextPlugin("css/[name].css?[hash:10]"), //合成css文件 对应不同的html模板
        new CleanWebpackPlugin(['build'], {
            root: __dirname,
            verbose: true,
            dry: false,
            exclude: []
        }),
        //把指定文件夹下的文件复制到指定的目录
        new TransferWebpackPlugin([{
            from: '../res'
        }], path.resolve(__dirname, "build"))
    ]
};
//根据enter创建同名html
pageArr.forEach(function(page) {
    console.info('$page页面', page, __dirname)
    var htmlPlugin = new HtmlwebpackPlugin({
        filename: page + '.html',
        template: path.resolve(__dirname, 'template/' + page + '.html'),
        chunks: [page, 'vendors'],
        minify:{    //压缩HTML文件
            removeComments:true  //移除HTML中的注释
        }
    });
    module.exports.plugins.push(htmlPlugin);
});
// 判断开发环境还是生产环境,添加uglify等插件
if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = (module.exports.plugins || [])
        .concat([new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin() //用了很多hashing，确保有一个一致的模块顺序
        ]);
} else {
    module.exports.devtool = 'cheap-module-eval-source-map';
    module.exports.devServer = {
        port: 8090,
        contentBase: './build',
        hot: true,
        historyApiFallback: true,
        publicPath: "",
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        stats: {
            colors: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    };
    module.exports.plugins = (module.exports.plugins || [])
        .concat([
            new OpenBrowserPlugin({
                url: 'http://localhost:8090'
            }),
            new webpack.optimize.OccurenceOrderPlugin() //用了很多hashing，确保有一个一致的模块顺序
        ]);
}