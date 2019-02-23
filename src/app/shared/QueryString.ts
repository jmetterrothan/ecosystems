import queryString from 'query-string';

export enum QueryStringType {
  INTEGER,
  STRING,
  BOOLEAN,
}

class QueryString {
  private static instance : QueryString;

  private queryString: Object;

  private constructor() {
    this.queryString = Object.assign({}, queryString.parse(location.search));
  }

  get(key: string, type: QueryStringType = QueryStringType.STRING): any {
    if (!this.queryString.hasOwnProperty(key)) {
      return undefined;
    }

    switch (type) {
      case QueryStringType.INTEGER:
        return parseInt(this.queryString[key], 10) || 0;
      case QueryStringType.BOOLEAN:
        return parseInt(this.queryString[key], 10) === 1 || false;
      default:
        return this.queryString[key] || '';
    }
  }

  static create() {
    if (!QueryString.instance) {
      QueryString.instance = new QueryString();
    }
    return QueryString.instance;
  }
}

export default QueryString;
