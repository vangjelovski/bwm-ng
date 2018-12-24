module.exports = {
    normalizedErrors: function (errors) {
        for(var property in errors) {
            let normalizedErrors = [];
            if(errors.hasOwnProperty(property)) {
                normalizedErrors.push({title: property.title, detail: errors[property].message });
            }
        }
        return normalizedErrors;
    }
}