var fastify = require ('fastify')({logger:true})
var routes = require('./routes.js')
fastify.register(routes)
// fastify server
fastify.listen(3000, function(err, address){
    if(err){
        fastify.log.info(err)
    }
    else{
        fastify.log.info(address)
    }
})