class Widget {
  Widget = {
    id,
    owner,
    label,
    description
  }
  createWidgetFromRequest = (request) => {
    this.id = request.getWidgetId();
    this.owner = request.getOwner();
    this.label = request.getLabel();
    this.description = request.getDiscription();

  }

}

class Request {
  Request = {
    type,
    requestId,
    widgetId,
    owner,
    label,
    description
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

  toJson = () => {
    return this.toJson();
  }

  fromJson = (json) => {

  }
}

