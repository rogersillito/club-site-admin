exports = module.exports = {};

var dumpObject = function(obj)
{
    var od = new Object;
    var result = "";
    var len = 0;

    for (var property in obj)
    {
        var value = obj[property];
        if (typeof value == 'string')
            value = "'" + value + "'";
        else if (typeof value == 'object')
        {
            if (value instanceof Array)
            {
                value = "[ " + value + " ]";
            }
            else
            {
                var ood = dumpObject(value);
                value = "{ " + ood.dump + " }";
            }
        }
        result += "'" + property + "' : " + value + ", ";
        len++;
    }
    od.dump = result.replace(/, $/, "");
    od.len = len;

    return od;
};

exports.dumpObject = dumpObject;
