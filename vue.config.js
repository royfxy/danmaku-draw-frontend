module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'src/index/main.js',
            template: 'public/index.html',
        },
        live: {
            // page 的入口
            entry: 'src/live/main.js',
            template: 'public/live.html',
        }
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: '@import "~@/assets/scss/imports.scss";'
            }
        }
    }
}