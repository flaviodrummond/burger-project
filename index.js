const express = require('express')
const app = express ()
const port = 3900
app.use(express.json())
const uuid = require('uuid')


const clients = []

const checkOrder = (request, response, next) => {
    const {id} = request.params
    const index = clients.findIndex(client => client.id === id)

    if(index < 0) {
        return response.status(404).json({error: "client not found"})
    }    


    request.clientId = id
    request.clientIndex = index

    next()
    
}

const ckeckRequest = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(`[${method}] - ${url}`);



    next()
}

app.post('/order', ckeckRequest, (request, response) => {
    const {order, clientName, price} = request.body
    const client = {id: uuid.v4(), order, clientName, price, status:"Em preparação"}

    clients.push(client)

    return response.status(201).json(client)
})

app.get('/order', ckeckRequest, (request, response) => {
    return response.json(clients)
})

app.put('/order/:id', ckeckRequest, checkOrder, (request, response) => {

    const id = request.clientId
    const index = request.clientIndex
    
    const {order, clientName, price} = request.body
    const updateOrder = {id, order, clientName, price, status: "Em preparação"}


        clients[index] = updateOrder

        return response.json(updateOrder)
    })

app.delete('/order/:id',ckeckRequest, checkOrder, (request, response) => {
    const index = request.clientIndex

    clients.splice(index,1)

    return response.status(204).json()
})

app.get('/order/:id',ckeckRequest, checkOrder, (request, response) => {


    const index = request.clientIndex


    return response.json(clients[index]);

})

app.patch('/order/:id', ckeckRequest, checkOrder, (request, response) => {
    const index = request.clientIndex
    clients[index].status = "pronto"

    return response.json(clients[index])
})

app.listen(port, () => {
    console.log(`🚀 server started on port ${port}`)
})
