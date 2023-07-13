// console.log(module)

exports.getDate = getDate = function() {
    var options = { weekday: 'long' , month: 'long', day: 'numeric' };
    var today  = new Date();
    var dateFormat = today.toLocaleDateString("en-US", options);
    return dateFormat;
}
