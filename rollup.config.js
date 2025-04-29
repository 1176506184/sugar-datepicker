import replace from 'rollup-plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import {uglify} from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import {string} from "rollup-plugin-string";
import { visualizer } from 'rollup-plugin-visualizer';

const isDev = process.env.NODE_ENV !== 'production';

export default {
    input: './packages/index.js',
    output: [{
        file: 'dist/datePicker.js',
        name: 'datePicker',
        format: 'umd',
        sourceMap: true
    }],
    plugins: [
        string({
            include: '**/*.html' // 配置处理所有HTML文件
        }),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        }),
        resolve(),
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        !isDev ? uglify() : null,
        // 热更新 默认监听根文件夹
        isDev ? livereload() : null,
        // 本地服务器
        // eslint-disable-next-line multiline-ternary
        isDev ? serve({
            open: true, // 自动打开页面
            port: 8000,
            openPage: '/index.html', // 打开的页面
            contentBase: ''
        }) : null,
        visualizer()
    ]
};
