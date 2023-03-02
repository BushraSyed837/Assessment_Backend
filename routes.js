var fp = require('fastify-plugin')
var fetch = require('node-fetch')
const opt = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '979e8ea916mshee16c8e7ff6d13ap15a64bjsnbcc7d02d2bcd',
    'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
  }
}

async function routes (fastify, options) {
  // schemas for CRUD APIs
  const getAllFoodItems = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              foodId: { type: 'string' },
              uri: { type: 'string' },
              label: { type: 'string' },
              brand: { type: 'string' },
              categoryLabel: { type: 'string' },
              foodContentsLabel: { type: 'string' }
            }
          }
        }
      }
    }
  }
  const addFoodItem = {
    schema: {
      body: {
        type: 'object',
        required: [
          // 'foodId',
          'uri',
          'label',
          'brand',
          'categoryLabel',
          'foodContentsLabel'
        ],
        properties: {
          uri: { type: 'string' },
          label: { type: 'string' },
          brand: { type: 'string' },
          categoryLabel: { type: 'string' },
          foodContentsLabel: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }
  const editFoodItem = {
    schema: {
      param: {
        type: 'string',
        properties: {
          index: 'string'
        }
      },
      body: {
        type: 'object',
        required: [
        //   'foodId',
          'uri',
          'label',
          'brand',
          'categoryLabel',
          'foodContentsLabel'
        ],
        properties: {
          foodId: { type: 'string' },
          uri: { type: 'string' },
          label: { type: 'string' },
          brand: { type: 'string' },
          categoryLabel: { type: 'string' },
          foodContentsLabel: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'array',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }
  try {
    let foodItems = await fetch(
      'https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=apple',
      opt
    )
      .then(response => response.json())
      .then(response => {
        return response.hints.map((data, i) => {
          return data.food
        })
      })
      .catch(err => console.error(err))

    console.log('hello', foodItems)

    fastify.get('/', getAllFoodItems, function (request, reply) {
      reply.send(foodItems)
    })
    fastify.post('/addFoodItem', addFoodItem, function (request, reply) {
      const foodId = Math.random()
        .toString(36)
        .substr(2)
      const uri = request.body.uri
      const label = request.body.label
      const brand = request.body.brand
      const categoryLabel = request.body.categoryLabel
      const foodContentsLabel = request.body.foodContentsLabel
      console.log({
        foodId,
        uri,
        label,
        brand,
        categoryLabel,
        foodContentsLabel
      })
      try {
        console.log(foodItems)
        foodItems.push({
          foodId,
          uri,
          label,
          brand,
          categoryLabel,
          foodContentsLabel
        })
        reply.send('food item added')
      } catch (error) {
        reply.send(error)
      }
    })
    fastify.post('/editFoodItem/:index', editFoodItem, function (
      request,
      reply
    ) {
      try {
        const index = request.params.index
        console.log(index)
        const foodId = request.body.foodId
        const uri = request.body.uri
        const label = request.body.label
        const brand = request.body.brand
        const categoryLabel = request.body.categoryLabel
        const foodContentsLabel = request.body.foodContentsLabel
        foodItems[index] = {
          foodId,
          uri,
          label,
          brand,
          categoryLabel,
          foodContentsLabel
        }
        reply.send('food item updated')
      } catch (error) {
        reply.send(error)
      }
    })
    fastify.post('/deleteFoodItem', function (request, reply) {
      try {
        const index = request.body.index
        const items = foodItems.splice(index, 1)
        reply.send("food item deleted")
      } catch (error) {
        console.log(error)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
module.exports = fp(routes)
