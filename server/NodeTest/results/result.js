
module.exports.Success = function Success(message){
    this.result = 0;
    this.message = message;
    this.JSON = function(){
        return JSON.stringify(this);
    }
}

module.exports.Error = function Error(message){
    this.result = 1;
    this.message = message;
    this.JSON = function(){
        return JSON.stringify(this);
    }
}

module.exports.Exception = function Exception(message){
    this.result = 2;
    this.message = message;
    this.JSON = function(){
        return JSON.stringify(this);
    }
}
