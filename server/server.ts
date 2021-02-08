import * as Express from 'express';

const app = Express();
const port = 3000;

app.get( "/", ( req, res ) => {
  res.send( "Hello world!" );
} );

app.listen(port, () => {
  console.log(`server started at http://localhost:${ port }`);
});
