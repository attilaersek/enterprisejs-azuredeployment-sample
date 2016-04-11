import { TokenType, Token } from '../node_modules/odata-v4-parser/lib/lexer';
import { Parser } from '../node_modules/odata-v4-parser/lib/parser';

var p = new Parser();

export interface VisitorFuncRes {
  (a: any): any;
}

export interface VisitorFunc {
  (node: Token, context: any): VisitorFuncRes | Array<VisitorFuncRes>;
}

export interface VisitorMap {
  [key: string]: VisitorFunc;
}

export const ODataMethodMap = {
  round: (v: number) => Math.round(v),
  indexof: (v: string, i: string) => v.indexOf && v.indexOf(i),
  substring: (v: string, i: number) => v.substr(i - 1)
};

export class Visitor implements VisitorMap {
  [k: string]: VisitorFunc;


  static buildFilterFunction(expression: string) {
    return new Visitor().Visit(p.filter(expression), {});
  }

  static buildAst(expression: string) {
    return p.filter(expression);
  }

  Visit(node: Token, context: any): any {
    //console.log("Visiting: ", node.type)
    switch (node.type) {
      //these are auto handled by visitor bubbling
      case TokenType.CollectionPathExpression:
      case TokenType.LambdaPredicateExpression:
      case TokenType.MemberExpression:
      case TokenType.PropertyPathExpression:
      case TokenType.SingleNavigationExpression:
      case TokenType.CommonExpression:
      case undefined:
        break;
      default:
        const fun = this[`Visit${node.type}`];
        if (fun) {
          return fun.call(this, node, context);
        }
        console.log(`Unhandled node type, falling back: ${node.type}`);
    }
    return this.Visit(node.value, context);
  }

  //todo fix AST so that we dont need this
  private VisitFirstMemberExpression(node: Token, context: any)  {
    if (Array.isArray(node.value)) {
      const [current, next] = node.value;
      return this.VisitODataIdentifier(<Token>{value:{ current, next}}, context);
    }
    return this.Visit(node.value, context);
  }

  private VisitBinaryExpression(node: Token, context: any) {
    return [this.Visit(node.value.left, context), this.Visit(node.value.right, context)];
  }

  protected VisitBoolParenExpression(node: Token, context: any) {
    var inner = this.Visit(node.value, context);
    return (a: any) => !!inner(a);
  }

  protected VisitLambdaVariableExpression(node: Token, context: any) {
    return (a: any) => a;
  }

  protected VisitCountExpression(node: Token, context: any) {
    return (a: any) => (a && a.length) || 0;
  }

  protected VisitAllExpression(node: Token, context: any) {
    const predicate: any = this.Visit(node.value.predicate, context);
    return (a: any) => a.every && a.every(predicate);
  }

  protected VisitAnyExpression(node: Token, context: any) {
    const predicate: any = this.Visit(node.value.predicate, context);
    return (a: any) => a.some && a.some(predicate);
  }


  protected VisitFilter(node: Token, context: any) {
    var predicate: any = this.Visit(node.value, context);
    return (a: any) => !!predicate(a);
  }

  protected VisitEqualsExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context);
    return (a: any) => left(a) === right(a);
  }

  protected VisitGreaterThanExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context);
    return (a: any) => left(a) > right(a);
  }

  protected VisitLesserThanExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context);
    return (a: any) => left(a) < right(a);
  }

  protected VisitImplicitVariableExpression(node: Token, context: any) {
    return (a: any) => a;
  }
  protected VisitAndExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context);
    return (a: any) => left(a) && right(a);
  }

  protected VisitAddExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context);
    return (a: any) => left(a) + right(a);
  }


  protected getLiteral(node: Token): any {
    switch(node.value) {
      case 'Edm.SByte':     return  parseInt(node.raw, 10);
      case 'Edm.Boolean':   return  node.raw === 'true';
      case 'Edm.String':    return  node.raw.replace(/'/g,'');
      default:
        console.log('unknown value type:' + node.value);
    }
    return node.raw;
  }
  protected VisitLiteral(node: Token, context: any) {
    return (a: any) => this.getLiteral(node);
  }

  protected VisitMethodCallExpression(node: Token, context: any) {
    var method: any = (<any>ODataMethodMap)[node.value.method];
    var params: any = node.value.parameters.map((p: any) => this.Visit(p, context));
    return (a: any) => method.apply(this, params.map((p: any) => p(a)));
  }

  protected VisitODataIdentifier(node: Token, context: any) {
    if (node.value.name) {
      return (a: any) => a[node.value.name];
    }
    const current = this.Visit(node.value.current, context);
    const next = this.Visit(node.value.next, context);
    return (a: any) => next(current(a) || {});
  }

  protected VisitOrExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context);
    return (a: any) => left(a) || right(a);
  }
}
