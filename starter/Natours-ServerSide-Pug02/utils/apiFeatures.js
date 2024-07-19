class APIFeatures{
  constructor(query,queryString){
    this.query = query;
    this.queryString = queryString;
  }

  // 1A) FILTERIG...
  filter(){
    const requestQuery = {...this.queryString};
    const excludedFields = ['page','sort','limit','fields'];
    excludedFields.forEach(element => delete requestQuery[element]);
  
    // 1B) ADVANCE FILTERING..
    let queryString = JSON.stringify(requestQuery);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  // 2) SORTING...
  sort(){
    if(this.queryString.sort){
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }else(
      this.query = this.query.sort('maxGroupSize')
    )

    return this;
  }

  // 3) FIELDS LIMITING...
  limitFields(){
    if(this.queryString.fields){
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }

    return this;
  }

  // 4) PAGINATION...
  paginate(){
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const  skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
};

module.exports = APIFeatures;