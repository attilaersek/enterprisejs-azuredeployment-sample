import { Request, Response} from 'express';
import { Visitor } from './visitor';
import * as express from 'express';

const app = express();
const port = process.env.PORT || 1337;

app.get('/api/products', (req: Request, res: Response) => {
  const visitor = new Visitor();
  const ast = Visitor.buildAst(req.query.$filter);
  res.json({
    'result': ast
  });
});

app.get('/odata/products', (req: Request, res: Response) => {
  const visitor = new Visitor();
  const filter = Visitor.buildFilterFunction(req.query.$filter);

  res.json({
    'result': filter.toString()
  });
});

app.listen(port, () => {
    console.log(`service listing in ${port}`);
});
