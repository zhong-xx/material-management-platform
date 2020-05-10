module.exports = {
    devServer: {
        proxy: {
            '/materialApi': {
                target: 'http://localhost:3002'
            }
        }
    }
}