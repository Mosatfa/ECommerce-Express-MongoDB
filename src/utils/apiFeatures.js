

class ApiFeatures {

    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData
    }

    paginate() {
        let { size, page } = this.queryData

        if (!size || size <= 0) {
            size = 1
        }

        if (!page || page <= 0) {
            page = 1
        }
        this.mongooseQuery.limit(parseInt(size)).skip((parseInt(page) - 1) * parseInt(size))
        return this
    }

    filter() {
        const excludsQueryParams = ['page', 'size', 'sort', 'fields', 'search']
        const fillterQuery = { ...this.queryData }
        excludsQueryParams.forEach(param => {
            delete fillterQuery[param]
        })
        this.mongooseQuery.find(JSON.parse(JSON.stringify(fillterQuery).replace(/gt|gte|lt|lte|in|nin|eq|neq/g, match => `$${match}`)))
        return this
    }

    sort() {
        // if(this.queryData.sort){
        //    this.mongooseQuery.sort(this.queryData.sort.replaceAll(",",' '))
        // }
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", ' '))

        return this
    }

    search() {
        // if(this.queryData.sort){
        //    this.mongooseQuery.sort(this.queryData.sort.replaceAll(",",' '))
        // }
        this.mongooseQuery.find({
            $or: [
                { name: { $regex: this.queryData.search, $options: "i" } },
                { description: { $regex: this.queryData.search, $options: "i" } },
            ]
        })//search

        return this
    }

    select() {
        // if(this.queryData.sort){
        //    this.mongooseQuery.sort(this.queryData.sort.replaceAll(",",' '))
        // }
        this.mongooseQuery.select(this.queryData.fields?.replaceAll(',' , ' '))
        return this
    }
}


export default ApiFeatures







// const { skip, limit } = pagenate(req.query.page, req.query.size)

    // const excludsQueryParams = ['page','size','sort','fields' ,'search']
    // const fillterQuery = {...req.query}
    // excludsQueryParams.forEach(param =>{
    //     delete fillterQuery[param]
    // })
   
    // // const mongooseQuery =  productModel.find().populate([{
    // //     path: 'review'
    // // }]).sort(req.query.sort.replaceAll(",",' ')) // sort
    // const mongooseQuery =  productModel.find().populate([{
    //     path: 'review'
    // }])

    // mongooseQuery.find(JSON.parse(JSON.stringify(fillterQuery).replace(/gt|gte|lt|lte|in|nin|eq|neq/g,match=>`$${match}`)))
    // mongooseQuery.limit(limit).skip(skip)
    // // mongooseQuery.find({
    // //     $or:[
    // //        { name:{ $regex :req.query.search , $options: "i"}},
    // //         {description:{$regex:req.query.search , $options: "i"}},
    // //     ]
    // // })//search
    // mongooseQuery.select(req.query.fields.replaceAll(',' , ' '))
// const products = await mongooseQuery //execute query=> awite .exct()