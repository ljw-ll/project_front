import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { ResultVO } from "@/store/Response";

const mock = new MockAdapter(axios);

// 地址，支持JS正则表达式
// 正则表达式中 \，由转义符，\/，替代
// 匹配任意字符，\w+；
// $，结束。避免匹配多个
// 通用的，将{}占位符的字符串路径，转为正则表达式对象
// 例如，/users/{uid}; /users/{uid}/courses/{hid}
function path(p: string) {
  const reg = p.replace(/{\w+}/g, "(\\w+)").replace(/\//g, "\\/") + "$";
  return new RegExp(reg);
}
//--------------------------------------------------

// config，axios config对象。包含请求信息
// 返回数组，[status, {data对象}, {header对象}]
mock.onPost("login").reply((c) => {
  console.log("mock login");
  //console.log(c);
  const resultVO: ResultVO = { code: 200 };
  // 获取请求数据
  // 此时请求的js对象已转为json字符串。因此需要转换回JS对象
  const data = c.data;
  const { phone, password } = JSON.parse(data);

  if (phone == "1001" && password == "1001") {
    resultVO.code = 200;
    resultVO.data = { role: "1", user: { title: "讲师" } };
    resultVO.message = "";
    return [
      200,
      resultVO,
      {
        token:
          "744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6",
      },
    ];
  }
  // 模拟admin
  if (phone == "2002" && password == "2002") {
    resultVO.data = { role: "0", user: { title: "admin" } };
    resultVO.code = 200;
    resultVO.message = "";
    return [
      200,
      resultVO,
      {
        //role: 0,
        token:
          "744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6",
      },
    ];
  }

  resultVO.code = 401;
  resultVO.message = "用户名密码错误";
  console.log(resultVO);

  return [200, resultVO];
});

// 模拟请求携带token是否合法
mock.onGet("home").reply((c) => {
  console.log(c);

  const resultVO: ResultVO = { code: 200 };
  const auth = c.headers?.token;
  if (
    auth ==
    "744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6"
  ) {
    resultVO.code = 200;
    resultVO.data = { courses: [] };
    return [200, resultVO];
  }
  resultVO.code = 403;
  resultVO.message = "无权限";
  return [200, resultVO];
});
