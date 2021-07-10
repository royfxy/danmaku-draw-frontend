module.exports = {
    pages: {
        index: {
            entry: 'src/index/main.js',
            template: 'public/index.html',
            title: 'Danmaku Draw'
        },
        live: {
            entry: 'src/live/main.js',
            template: 'public/live.html',
            title: 'Danmaku Draw'
        }
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: '@import "~@/assets/scss/imports.scss";'
            }
        }
    },
}