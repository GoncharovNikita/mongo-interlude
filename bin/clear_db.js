// CLEAR DB MODULE


module.exports = async (opts) => {

  const  InvalidOptionsError  = require('./_errors')

  if (typeof opts !== 'object' || !opts) throw new InvalidOptionsError('options object')
  const { silent = false, mongoose } = opts

  let RESULT    =  false
  let CLEAR_BY  =  null
  let ERROR     =  null
  if (mongoose) CLEAR_BY = "mongoose"

  const clearByMongoose = async (mongoose) => {
    const success = []
    const errors  = []

    Object.keys(mongoose.connection.collections).forEach( async (key) => {
      const model = mongoose.connection.collections[key]
      if (model.name === 'identitycounters') return
      try {
        await model.remove({})
        success.push(key)
        if (!silent) console.log('Model ' + key + ' successfully cleared!');
      } catch (e) {
        const error = {}
        error[key] = new Error(e)
        errors.push(error)
        console.log('Error occured on model ' + key);
      }
      console.log('All models successfully cleared!');
    })

    return {
      success,
      errors
    }
  }

  switch(CLEAR_BY) {
    case 'mongoose': RESULT = await clearByMongoose(mongoose); break
    case null: ERROR = new Error('Mongoose adapter is undefined!'); throw ERROR
  }


  return RESULT

}
