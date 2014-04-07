
module.exports.Success = function Success(message, data){
    this.result = 0;
    this.message = message;
    this.data=data;
    this.JSON = function(){
        return JSON.stringify(this);
    }
}

module.exports.Error = function Error(message, data){
    this.result = 1;
    this.message = message;
    this.data=data;
    this.JSON = function(){
        return JSON.stringify(this);
    }
}

module.exports.Exception = function Exception(message, data){
    this.result = 2;
    this.message = message;
    this.data=data;
    this.JSON = function(){
        return JSON.stringify(this);
    }
}
