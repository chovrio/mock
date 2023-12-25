import { parse } from "./src";
import { generate } from "./src/generator";
import { ThriftDocument } from "./src/types";
const ast = parse(`  
namespace js test

const string test = 'test'

struct MyStruct {
	1: optional string test
}

service MyService {
	void ping()
}
`);

if (ast?.type === "ThriftDocument") {
  const obj = generate(ast as ThriftDocument, ["GetAdoptedValueSummaries"]);
  console.log(obj.get("GetAdoptedValueSummaries"));
}
