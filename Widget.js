class Widget {
  Widget = {
    id,
    owner,
    label,
    description,
    otherAttribute
  }
  createWidgetFromRequest = (request) => {
    this.id = request.widgetId;
    this.owner = request.owner;
    this.label = request.label;
    this.description = request.discription;
    this.otherAttribute = request.otherAttribute;

  }

}

class Request {
  Request = {
    type,
    requestId,
    widgetId,
    owner,
  }

  getRequestId = () => {
    return this.requestId;
  }

  setRequestId = (newId) => {
    this.requestId = newId;
  }

  getWidgetId = () => {
    return this.widgetId;
  }

  setWidgetId = (newId) => {
    this.widgetId = newId;
  }

  getOwner = () => {
    return this.owner;
  }

  setOwner = (newOwner) => {
    this.owner = newOwner;
  }

  toJson = () => {
    return this.toJson();
  }

  fromJson = (json) => {

  }
}

class CreateRequest extends Request {
  getLabel = () => {
    return this.label;
  }

  setLabel = (newLabel) => {
    this.label = newLabel;
  }

  getDiscription = () => {
    return this.description;
  }

  setDiscription = (newDescription) => {
    this.description = newDescription;
  }
}

class UpdateRequest extends Request {
  getLabel = () => {
    return this.label;
  }

  setLabel = (newLabel) => {
    this.label = newLabel;
  }

  getDiscription = () => {
    return this.description;
  }

  setDiscription = (newDescription) => {
    this.description = newDescription;
  }
}

