import { parse } from "./src";
import { generate } from "./src/generater";
import { ThriftDocument } from "./src/types";

const ast = parse(`  
  enum AdoptedValueType {
      AD = 1;         
      STAR = 2;       
      SEARCH = 3;   
  }
  
  struct AdoptedValueSummarieItem {
      1: required string date; 
      2: required i64 brand_id; 
      3: required string brand_name; 
      4: required i64 industry_id;
      5: required string industry_name; 
      6: required AdoptedValueType type;
      9: required double cost;
      17: optional string channel; 
      18: optional string action_event; 
      19: optional string platform;
  }
  
  struct GetAdoptedValueSummariesResp {
      1: required list<AdoptedValueSummarieItem> data; 
      2: required i64 total_cnt; 
      3: required list<string> channel_list; 
  }
  
  service ProviderService {
      GetAdoptedValueSummariesResp GetAdoptedValueSummaries(1: GetAdoptedValueReq req);
  }
  `);

if (ast.type === "ThriftDocument") {
  const obj = generate(ast as ThriftDocument, ["GetAdoptedValueSummariesResp"]);
  console.log(obj);
}
