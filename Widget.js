class Widget {
  jsonToWidget = (json) => {
    return {
      id: json.widgetId,
      owner: json.owner,
      label: json.label,
      description: json.description,
      otherAttributes: json.otherAttributes,
    };
  }

}

module.exports = Widget;