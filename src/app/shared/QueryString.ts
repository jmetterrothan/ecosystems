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

    const value = this.queryString[key];

    switch (type) {
      case QueryStringType.INTEGER:
        return parseInt(value, 10) || 0;
      case QueryStringType.BOOLEAN:
        if (value === 'true') return true;
        if (value === 'false') return false;
        return parseInt(value, 10) === 1 || false;
      default:
        return value || '';
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
