const config = require('./utils/config')
const app = require('./app')
const logger = require('./utils/logger')

const port = config.PORT
app.listen(port, ()=>logger.info(`Server running on port ${port}`))